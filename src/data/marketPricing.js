import { locations } from '@/data/locations';
import { serviceAreas } from '@/data/serviceAreas';
import { RELEASED_MARKET_PRICES } from '@/data/releasedMarketPrices';

// Public pricing is intentionally limited to records that have completed the
// supplier, currency, fee, market-evidence, margin and expiry checks on the
// server. Do not put supplier costs, quantities or pending proposals here.
const normalize = (value = '') => String(value).trim().toLowerCase().replace(/[^a-z0-9]/g, '');

const matchesState = (market, state) => {
  if (!state) return true;
  return String(market.stateCode || '').split('/').some((code) => normalize(code) === normalize(state));
};

export const getMarketIdForLocation = (location = {}) => {
  if (location.marketId) return location.marketId;
  const city = normalize(location.city || location.detectedCity);
  const state = location.stateCode || location.state || location.detectedState;
  if (!city) return null;
  const directMarket = locations.find((market) => {
    const names = [market.city, market.displayName, ...(market.directoryNames || []), ...(market.marketAliases || [])];
    return matchesState(market, state) && names.some((name) => normalize(name) === city);
  });
  if (directMarket) return directMarket.slug;
  const serviceArea = serviceAreas.find((area) => normalize(area.name) === city && normalize(area.abbreviation) === normalize(state));
  return serviceArea?.parentLocationId || null;
};

const countryCode = (value) => {
  const normalized = String(value || '').trim().toUpperCase();
  return normalized === 'CA' || normalized === 'CANADA' ? 'CA' : 'US';
};

export const getMarketPrice = (product, location = {}) => {
  const marketId = getMarketIdForLocation(location);
  const country = countryCode(location.country);
  const record = marketId ? RELEASED_MARKET_PRICES[marketId]?.[product?.id] : null;
  const isReleased = Boolean(record && record.country === country && record.currency === 'USD' && Number(record.price) > 0 && (!record.validUntil || new Date(record.validUntil).getTime() > Date.now()));
  return {
    price: isReleased ? Number(record.price) : null,
    currency: isReleased ? record.currency : null,
    marketId,
    isPublished: isReleased,
    status: isReleased ? 'released' : 'request_quote',
    delivery: isReleased ? 'Delivery quoted separately.' : null,
  };
};
