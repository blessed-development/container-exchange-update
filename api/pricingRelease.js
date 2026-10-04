// Server-only pricing registry. Pending proposals never return a public price.
const PENDING_PROPOSALS = Object.freeze([
  { country: 'US', state: 'GA', city: 'Atlanta', productId: 'new-20-iicl', proposedPrice: 2800, currency: 'USD' },
  { country: 'US', state: 'GA', city: 'Atlanta', productId: 'new-40hc-iicl', proposedPrice: 4350, currency: 'USD' },
  { country: 'US', state: 'TX', city: 'Houston', productId: 'new-20-iicl', proposedPrice: 2750, currency: 'USD' },
  { country: 'US', state: 'TX', city: 'Houston', productId: 'new-40hc-iicl', proposedPrice: 3500, currency: 'USD' },
  { country: 'US', state: 'CA', city: 'Los Angeles', productId: 'new-20-iicl', proposedPrice: 2700, currency: 'USD' },
  { country: 'US', state: 'CA', city: 'Los Angeles', productId: 'new-40hc-iicl', proposedPrice: 4550, currency: 'USD' },
]);

export const RELEASED_PRICE_RECORDS = Object.freeze([]);
const normalize = (value = '') => String(value).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
const isCurrent = (record) => record.validUntil && new Date(record.validUntil).getTime() > Date.now();

export function validatePriceRelease({ country, state, city, productId }) {
  const value = { country: normalize(country), state: normalize(state), city: normalize(city), productId: normalize(productId) };
  const released = RELEASED_PRICE_RECORDS.find((record) => normalize(record.country) === value.country && normalize(record.state) === value.state && normalize(record.city) === value.city && normalize(record.productId) === value.productId && record.currency === 'USD' && Number(record.price) > 0 && isCurrent(record));
  if (!released) return { eligible: false, status: 'request_quote', reason: 'Current fixed-price release is not available for this exact product and market.' };
  return { eligible: true, status: 'released', price: Number(released.price), currency: 'USD', delivery: 'Delivery quoted separately.' };
}

export function listPendingProposalKeys() {
  return PENDING_PROPOSALS.map(({ country, state, city, productId }) => ({ country, state, city, productId, status: 'pending_supplier_confirmation' }));
}
