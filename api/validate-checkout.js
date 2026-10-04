import { validatePriceRelease } from './pricingRelease.js';

export default function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed.' });
  const items = Array.isArray(request.body?.items) ? request.body.items : [];
  if (!items.length) return response.status(400).json({ error: 'No cart items were supplied.' });
  const results = items.map((item) => validatePriceRelease({ country: item?.country, state: item?.state, city: item?.city, productId: item?.productId }));
  if (results.some((result) => !result.eligible)) return response.status(409).json({ eligible: false, error: 'A fixed price is no longer available for one or more items. Please request a quote so our team can confirm current availability.' });
  return response.status(200).json({ eligible: true, items: results });
}
