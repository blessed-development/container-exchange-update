import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const jobs = [
  ['public/images/hero/global-supply-network.png', 'public/images/hero/global-supply-network'],
  ['public/images/hero/depot-operations.png', 'public/images/hero/depot-operations'],
  ['public/images/hero/customer-delivery.png', 'public/images/hero/customer-delivery'],
  ['public/images/about/container-terminal-source.png', 'public/images/about/container-terminal'],
  ['public/images/buy/delivery-source.png', 'public/images/buy/delivery'],
];
const variants = [
  { suffix: '-mobile.webp', width: 768, quality: 76 },
  { suffix: '-desktop.webp', width: 1600, quality: 80 },
];

for (const [input, outputBase] of jobs) {
  const source = path.join(root, input);
  const metadata = await sharp(source).metadata();
  for (const { suffix, width, quality } of variants) {
    await sharp(source)
      .resize({ width: Math.min(width, metadata.width), withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(path.join(root, `${outputBase}${suffix}`));
  }
}
