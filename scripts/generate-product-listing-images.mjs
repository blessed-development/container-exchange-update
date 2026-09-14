import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sourceRoot = path.join(process.cwd(), 'public/images/products');
const listingRoot = path.join(process.cwd(), 'public/images/product-listings');
const widths = [480, 720];

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const resolved = path.join(directory, entry.name);
    if (entry.isDirectory()) return walk(resolved);
    return entry.isFile() && entry.name === 'hero.webp' ? [resolved] : [];
  }))).flat();
}

for (const source of await walk(sourceRoot)) {
  const relativeDirectory = path.dirname(path.relative(sourceRoot, source));
  const outputDirectory = path.join(listingRoot, relativeDirectory);
  await fs.mkdir(outputDirectory, { recursive: true });

  await Promise.all(widths.map((width) => sharp(source)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 72, effort: 5 })
    .toFile(path.join(outputDirectory, `hero-${width}.webp`))));
}
