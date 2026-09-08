import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const siteUrl = (process.env.VITE_SITE_URL || 'https://containersexchange.com').replace(/\/+$/, '');
const read = (path) => readFile(resolve(process.cwd(), path), 'utf8');
const locationsSource = await read('src/data/locations.js');
const productsSource = await read('src/data/inventoryProducts.js');
const collect = (source, pattern) => [...source.matchAll(pattern)].map((match) => match[1]);
const paths = ['/', '/inventory', '/about', '/delivery', '/faq', '/contact', ...collect(productsSource, /id:\s*'([^']+)'/g).map((id) => `/product/${id}`), ...collect(locationsSource, /slug:\s*'([^']+)'/g).map((slug) => `/buy-shipping-containers-${slug}`)];
const entries = [...new Set(paths)].map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`).join('\n');
await writeFile(resolve(process.cwd(), 'public/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`, 'utf8');
console.log(`Generated sitemap with ${new Set(paths).size} URLs.`);
