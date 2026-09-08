import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getCustomerFacingCanadianCity } from '../src/data/canadianPostalRules.js';

const root = path.resolve('public/data/canadian-postal');
const samples = [
  ['V6B3K9', 'Vancouver', 'BC'],
  ['N0G2M0', 'Neustadt', 'ON'],
  ['G1R1B8', 'Quebec', 'QC'],
  ['S0C1R0', 'Manor', 'SK'],
  ['M5V2T6', 'Toronto', 'ON'],
  ['T2P1J9', 'Calgary', 'AB'],
  ['B3H0A1', 'Halifax', 'NS'],
  ['M8Z4H4', 'Toronto', 'ON'],
];

let failures = 0;
for (const [postalCode, city, province] of samples) {
  const file = path.join(root, `${postalCode.slice(0, 3)}.json`);
  if (!existsSync(file)) {
    console.error(`Missing lookup file: ${file}`);
    failures += 1;
    continue;
  }
  const entries = JSON.parse(await readFile(file, 'utf8'));
  const result = entries[postalCode];
  const customerCity = result && getCustomerFacingCanadianCity(result[0], postalCode);
  if (!result || customerCity !== city || result[1] !== province) {
    console.error(`Unexpected result for ${postalCode}: ${JSON.stringify(result)}`);
    failures += 1;
  }
}

const attribution = path.join(root, 'ATTRIBUTION.txt');
if (!existsSync(attribution)) {
  console.error('Missing GeoNames attribution file.');
  failures += 1;
}

if (failures) process.exit(1);
console.log(`Canadian postal lookup data passed ${samples.length} representative exact-code checks.`);
