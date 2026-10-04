import { inspectLocationImages, printImageReport } from './location-image-utils.mjs';

const inspections = inspectLocationImages();
printImageReport(inspections);

const found = inspections.filter((item) => item.eligible);
const missing = inspections.filter((item) => !item.eligible);

console.log(`\nSummary: ${found.length} valid hero images, ${missing.length} missing or invalid.`);
console.log('A file is valid only when it exists, uses .webp, and has a unique registered hero path.');
