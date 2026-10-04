import { createServer } from 'vite';

const vite = await createServer({ server: { middlewareMode: true } });

try {
  const { getMarketPrice } = await vite.ssrLoadModule('/src/data/marketPricing.js');
  const product = (id) => ({ id });
  const atlanta = getMarketPrice(product('new-20-iicl'), { country: 'US', city: 'Atlanta', state: 'GA' });
  const toronto = getMarketPrice(product('new-20-iicl'), { country: 'CA', city: 'Toronto', state: 'ON' });
  const calgary = getMarketPrice(product('new-20-iicl'), { country: 'CA', city: 'Calgary', state: 'AB' });
  const unsupported = getMarketPrice(product('used-40hc-iicl'), { country: 'US', city: 'Houston', state: 'TX' });
  const firstVisit = getMarketPrice(product('new-20-iicl'), null);

  if (!(atlanta.status === 'indicative' && atlanta.currency === 'USD' && atlanta.price === 2800 && !atlanta.isPublished)) {
    throw new Error(`Atlanta estimate is invalid: ${JSON.stringify(atlanta)}`);
  }
  if (!(toronto.status === 'indicative' && toronto.currency === 'USD' && toronto.price === 2550 && !toronto.isPublished)) {
    throw new Error(`Toronto USD estimate is invalid: ${JSON.stringify(toronto)}`);
  }
  if (!(calgary.status === 'indicative' && calgary.currency === 'USD' && calgary.price === 3350 && !calgary.isPublished)) {
    throw new Error(`Calgary USD estimate is invalid: ${JSON.stringify(calgary)}`);
  }
  if (!(unsupported.status === 'request_quote' && !unsupported.price)) {
    throw new Error(`Unsupported evidence handling is invalid: ${JSON.stringify(unsupported)}`);
  }
  if (!(firstVisit.status === 'request_quote' && !firstVisit.price && !firstVisit.marketId)) {
    throw new Error(`First-visit pricing fallback is invalid: ${JSON.stringify(firstVisit)}`);
  }

  console.log('Indicative pricing verified: US and Canadian USD estimates are quote-only; unsupported evidence remains quote-only.');
} finally {
  await vite.close();
}
