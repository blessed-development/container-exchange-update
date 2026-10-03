import { createServer } from 'vite';

const vite = await createServer({ server: { middlewareMode: true } });

try {
  const { getMarketPrice } = await vite.ssrLoadModule('/src/data/marketPricing.js');
  const product = (id) => ({ id });
  const atlanta = getMarketPrice(product('new-20-iicl'), { country: 'US', city: 'Atlanta', state: 'GA' });
  const canadian = getMarketPrice(product('new-20-iicl'), { country: 'CA', city: 'Toronto', state: 'ON' });
  const unsupported = getMarketPrice(product('used-40hc-iicl'), { country: 'US', city: 'Houston', state: 'TX' });
  const firstVisit = getMarketPrice(product('new-20-iicl'), null);

  if (!(atlanta.status === 'indicative' && atlanta.currency === 'USD' && atlanta.price === 2800 && !atlanta.isPublished)) {
    throw new Error(`Atlanta estimate is invalid: ${JSON.stringify(atlanta)}`);
  }
  if (!(canadian.status === 'request_quote' && !canadian.price)) {
    throw new Error(`Canadian currency hold is invalid: ${JSON.stringify(canadian)}`);
  }
  if (!(unsupported.status === 'request_quote' && !unsupported.price)) {
    throw new Error(`Unsupported evidence handling is invalid: ${JSON.stringify(unsupported)}`);
  }
  if (!(firstVisit.status === 'request_quote' && !firstVisit.price && !firstVisit.marketId)) {
    throw new Error(`First-visit pricing fallback is invalid: ${JSON.stringify(firstVisit)}`);
  }

  console.log('Indicative pricing verified: US estimate is quote-only; Canada and unsupported evidence are quote-only.');
} finally {
  await vite.close();
}
