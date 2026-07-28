import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { findDuplicateHeroImages, locations } from '../src/data/locations.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const resolvePublicImage = (heroImage) =>
  path.join(projectRoot, 'public', heroImage.replace(/^\//, ''));

export const inspectLocationImages = () => {
  const duplicatePaths = new Set(findDuplicateHeroImages().flatMap(([, slugs]) => slugs));

  return locations.map((location) => {
    const absolutePath = resolvePublicImage(location.heroImage);
    const fileExists = fs.existsSync(absolutePath);
    const isWebp = path.extname(location.heroImage).toLowerCase() === '.webp';

    return {
      location,
      absolutePath,
      fileExists,
      isWebp,
      isUnique: !duplicatePaths.has(location.slug),
      eligible: fileExists && isWebp && !duplicatePaths.has(location.slug),
    };
  });
};

export const printImageReport = (inspections) => {
  inspections.forEach(({ location, fileExists, isWebp, isUnique }) => {
    const status = fileExists && isWebp && isUnique ? 'FOUND' : 'MISSING';
    console.log(`${status.padEnd(7)} ${location.displayName}`);
    console.log(`        ${location.heroImage}${isUnique ? '' : ' (DUPLICATE PATH)'}`);
  });
};
