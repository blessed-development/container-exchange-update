import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { deliveryMarketCentroids } from '../src/data/generatedDeliveryMarketCentroids.js';
import { resolveDeliveryMarket } from '../src/data/deliveryMarketRules.js';
import { canadianPostalFsaCentroids } from '../src/data/generatedCanadianPostalFsaCentroids.js';

const root = path.resolve('public/data/us-postal');
const samples = [
  ['92805', 'Anaheim', 'CA'],
  ['92101', 'San Diego', 'CA'],
  ['95112', 'San Jose', 'CA'],
  ['95401', 'Santa Rosa', 'CA'],
  ['02108', 'Boston', 'MA'],
];

const routingSamples = [
  [{ city: 'Anaheim', state: 'CA', country: 'US', latitude: 33.8359, longitude: -117.9086 }, 'los-angeles-long-beach-ca'],
  [{ city: 'San Diego', state: 'CA', country: 'US', latitude: 32.7157, longitude: -117.1611 }, 'los-angeles-long-beach-ca'],
  [{ city: 'San Jose', state: 'CA', country: 'US', latitude: 37.3382, longitude: -121.8863 }, 'san-francisco-oakland-ca'],
  [{ city: 'Santa Rosa', state: 'CA', country: 'US', latitude: 38.4404, longitude: -122.7141 }, 'san-francisco-oakland-ca'],
  [{ city: 'Springfield', state: 'MA', country: 'US', latitude: 42.1015, longitude: -72.5898 }, 'worcester-boston-ma'],
  [{ city: 'Delta', state: 'BC', country: 'CA' }, 'vancouver-delta-bc'],
  [{ city: 'Dartmouth', state: 'NS', country: 'CA' }, 'halifax-dartmouth-ns'],
];

let failures = 0;
for (const [zip, city, state] of samples) {
  const file = path.join(root, `${zip[0]}.json`);
  const entries = JSON.parse(await readFile(file, 'utf8'));
  const result = entries[zip];
  if (!result || result[0] !== city || result[1] !== state) {
    console.error(`Unexpected result for ${zip}: ${JSON.stringify(result)}`);
    failures += 1;
  }
}

for (const [location, marketId] of routingSamples) {
  const resolved = resolveDeliveryMarket(location, { preserveDisplayCity: location.country === 'CA' });
  if (resolved?.marketId !== marketId) {
    console.error(`Unexpected delivery market for ${location.city}, ${location.state}: ${resolved?.marketId || 'none'}`);
    failures += 1;
  }
}

if (deliveryMarketCentroids.length !== 53 || deliveryMarketCentroids.some((market) =>
  !Number.isFinite(market.latitude)
  || !Number.isFinite(market.longitude)
  || Math.abs(market.latitude) > 90
  || Math.abs(market.longitude) > 180
)) {
  console.error('Delivery-market centroid data is incomplete.');
  failures += 1;
}

if (Object.keys(canadianPostalFsaCentroids).length < 1000 || Object.values(canadianPostalFsaCentroids).some(([latitude, longitude]) =>
  !Number.isFinite(latitude)
  || !Number.isFinite(longitude)
  || Math.abs(latitude) > 90
  || Math.abs(longitude) > 180
)) {
  console.error('Canadian FSA centroid data is incomplete.');
  failures += 1;
}

if (!existsSync(path.join(root, 'ATTRIBUTION.txt'))) {
  console.error('Missing GeoNames attribution for US postal data.');
  failures += 1;
}

if (failures) process.exit(1);
console.log(`Delivery-market data passed ${samples.length} US postal checks, ${routingSamples.length} delivery-market routing checks, and ${deliveryMarketCentroids.length} market-centroid checks.`);
