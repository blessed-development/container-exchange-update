import { createReadStream, existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';
import { locations } from '../src/data/locations.js';

const usSource = path.resolve('.cache/us/US.txt');
const caSource = path.resolve('.cache/ca-full/CA_full.txt');
const usOutput = path.resolve('public/data/us-postal');
const centroidOutput = path.resolve('src/data/generatedDeliveryMarketCentroids.js');
const canadianFsaOutput = path.resolve('src/data/generatedCanadianPostalFsaCentroids.js');

if (!existsSync(usSource) || !existsSync(caSource)) {
  throw new Error('Missing GeoNames US or Canadian source data in .cache.');
}

const normalize = (value = '') => String(value)
  .trim()
  .toLowerCase()
  .replace(/\bsaint\b/g, 'st')
  .replace(/[^a-z0-9]/g, '');
const usBuckets = new Map();
const placeCoordinates = new Map();
const canadianFsaCoordinates = new Map();

const addPlaceCoordinate = ({ country, city, state, latitude, longitude }) => {
  const key = [country, state, normalize(city)].join('|');
  const entries = placeCoordinates.get(key) || [];
  if (Number.isFinite(latitude) && Number.isFinite(longitude)) entries.push([latitude, longitude]);
  placeCoordinates.set(key, entries);
};

const readPostalFile = async (source, onRow) => {
  const lines = readline.createInterface({ input: createReadStream(source, 'utf8'), crlfDelay: Infinity });
  for await (const line of lines) {
    const [country, postalCode, city, , state, , , , , latitude, longitude] = line.split('\t');
    onRow({ country, postalCode, city, state, latitude: Number(latitude), longitude: Number(longitude) });
  }
};

await readPostalFile(usSource, ({ country, postalCode, city, state, latitude, longitude }) => {
  if (country !== 'US' || !/^\d{5}$/.test(postalCode || '') || !city || !state) return;
  const bucket = usBuckets.get(postalCode[0]) || {};
  bucket[postalCode] = [city, state, latitude, longitude];
  usBuckets.set(postalCode[0], bucket);
  addPlaceCoordinate({ country, city, state, latitude, longitude });
});

await readPostalFile(caSource, ({ country, city, state, latitude, longitude }) => {
  if (country !== 'CA' || !city || !state) return;
  addPlaceCoordinate({ country, city, state, latitude, longitude });
});

await readPostalFile(caSource, ({ country, postalCode, latitude, longitude }) => {
  const fsa = String(postalCode || '').replace(/\s+/g, '').slice(0, 3).toUpperCase();
  if (country !== 'CA' || !/^[A-Z]\d[A-Z]$/.test(fsa) || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
  const points = canadianFsaCoordinates.get(fsa) || [];
  points.push([latitude, longitude]);
  canadianFsaCoordinates.set(fsa, points);
});

await rm(usOutput, { recursive: true, force: true });
await mkdir(usOutput, { recursive: true });
for (const [prefix, entries] of usBuckets) {
  await writeFile(path.join(usOutput, `${prefix}.json`), JSON.stringify(entries));
}
await writeFile(
  path.join(usOutput, 'ATTRIBUTION.txt'),
  await readFile(path.resolve('scripts/templates/geonames-attribution.txt'), 'utf8')
);

const pairedSeeds = {
  'new-york-newark-ny-nj': [['New York', 'NY'], ['Newark', 'NJ']],
};

const average = (points) => [
  points.reduce((total, [latitude]) => total + latitude, 0) / points.length,
  points.reduce((total, [, longitude]) => total + longitude, 0) / points.length,
];

const marketCentroids = locations.map((location) => {
  const seeds = pairedSeeds[location.slug] || (location.marketAliases || [location.city]).map((city) => [city, location.stateCode]);
  const points = seeds.flatMap(([city, state]) => {
    const key = [location.country === 'Canada' ? 'CA' : 'US', state, normalize(city)].join('|');
    return placeCoordinates.get(key) || [];
  });
  if (!points.length) throw new Error(`No GeoNames centroid found for ${location.slug}.`);
  const [latitude, longitude] = average(points);
  return {
    slug: location.slug,
    country: location.country === 'Canada' ? 'CA' : 'US',
    stateCodes: String(location.stateCode).split('/').map((value) => value.trim()),
    latitude: Number(latitude.toFixed(5)),
    longitude: Number(longitude.toFixed(5)),
  };
});

await writeFile(
  centroidOutput,
  `// Generated from GeoNames postal-code data. Run npm run delivery-markets:build to refresh.\nexport const deliveryMarketCentroids = ${JSON.stringify(marketCentroids, null, 2)};\n`
);

const canadianPostalFsaCentroids = Object.fromEntries(
  [...canadianFsaCoordinates.entries()].map(([fsa, points]) => {
    const [latitude, longitude] = average(points);
    return [fsa, [Number(latitude.toFixed(5)), Number(longitude.toFixed(5))]];
  })
);
await writeFile(
  canadianFsaOutput,
  `// Generated from GeoNames postal-code data. Run npm run delivery-markets:build to refresh.\nexport const canadianPostalFsaCentroids = ${JSON.stringify(canadianPostalFsaCentroids, null, 2)};\n`
);

console.log(`Built ${usBuckets.size} US postal lookup files, ${marketCentroids.length} delivery-market centroids, and ${Object.keys(canadianPostalFsaCentroids).length} Canadian FSA centroids.`);
