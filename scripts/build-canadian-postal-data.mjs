import { createReadStream, existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';

const source = path.resolve('.cache/ca-full/CA_full.txt');
const output = path.resolve('public/data/canadian-postal');

if (!existsSync(source)) {
  throw new Error(
    'Missing .cache/ca-full/CA_full.txt. Download the GeoNames CA_full dataset before running postal:build.'
  );
}

const normalizePostal = (value = '') => value.replace(/\s+/g, '').toUpperCase();
const buckets = new Map();

const lines = readline.createInterface({
  input: createReadStream(source, 'utf8'),
  crlfDelay: Infinity,
});

for await (const line of lines) {
  const [country, postalCode, city, , province] = line.split('\t');
  const normalized = normalizePostal(postalCode || '');
  if (country !== 'CA' || !/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(normalized) || !city || !province) continue;

  const fsa = normalized.slice(0, 3);
  const bucket = buckets.get(fsa) || {};
  // Keep the first canonical locality supplied by GeoNames for any duplicated code.
  if (!bucket[normalized]) bucket[normalized] = [city, province];
  buckets.set(fsa, bucket);
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const [fsa, entries] of buckets) {
  await writeFile(path.join(output, `${fsa}.json`), JSON.stringify(entries));
}

const attribution = await readFile(path.resolve('scripts/templates/geonames-attribution.txt'), 'utf8');
await writeFile(path.join(output, 'ATTRIBUTION.txt'), attribution);

console.log(`Built ${buckets.size} Canadian postal-code lookup files.`);
