import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sourceRoot = path.join(process.cwd(), 'public/images/products');
const thumbnailRoot = path.join(process.cwd(), 'public/images/product-thumbnails');

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const resolved = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(resolved);
    return entry.isFile() && entry.name.endsWith('.webp') ? [resolved] : [];
  }))).flat();
}

for (const source of await walk(sourceRoot)) {
  const relative = path.relative(sourceRoot, source);
  const output = path.join(thumbnailRoot, relative);
  await fs.mkdir(path.dirname(output), { recursive: true });
  await sharp(source)
    .resize({ width: 180, height: 140, fit: 'cover', withoutEnlargement: true })
    .webp({ quality: 68, effort: 5 })
    .toFile(output);
}
