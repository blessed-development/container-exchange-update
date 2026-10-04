import { locations } from '@/data/locations';
import { serviceAreas } from '@/data/serviceAreas';
import { RELEASED_MARKET_PRICES } from '@/data/releasedMarketPrices';
import { INDICATIVE_MARKET_PRICES } from '@/data/indicativeMarketPrices';

// Fixed prices are limited to records that have completed the supplier,
// currency, fee, market-evidence, margin and expiry checks on the server.
// Indicative estimates are a separately assessed, quote-only customer aid.
// Do not put supplier costs, quantities or pending proposals here.
const normalize = (value = '') => String(value).trim().toLowerCase().replace(/[^a-z0-9]/g, '');

const matchesState = (market, state) => {
  if (!state) return true;
  return String(market.stateCode || '').split('/').some((code) => normalize(code) === normalize(state));
};

export const getMarketIdForLocation = (location = {}) => {
  // A first-time visitor has no stored location. Inventory must remain
  // browseable and quote-only in that state rather than crashing while cards
  // ask the pricing resolver for a market.
  location = location || {};
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
  location = location || {};
  const marketId = getMarketIdForLocation(location);
  const country = countryCode(location.country);
  const releasedRecord = marketId ? RELEASED_MARKET_PRICES[marketId]?.[product?.id] : null;
  const isReleased = Boolean(releasedRecord && releasedRecord.country === country && releasedRecord.currency === 'USD' && Number(releasedRecord.price) > 0 && (!releasedRecord.validUntil || new Date(releasedRecord.validUntil).getTime() > Date.now()));
  const indicativeRecord = marketId ? INDICATIVE_MARKET_PRICES[marketId]?.[product?.id] : null;
  const isIndicative = !isReleased && Boolean(
    indicativeRecord &&
      (country === 'US' || country === 'CA') &&
      indicativeRecord.country === country &&
      indicativeRecord.currency === 'USD' &&
      Number(indicativeRecord.price) > 0
  );

  return {
    price: isReleased ? Number(releasedRecord.price) : isIndicative ? Number(indicativeRecord.price) : null,
    currency: isReleased ? releasedRecord.currency : isIndicative ? indicativeRecord.currency : null,
    marketId,
    isPublished: isReleased,
    isIndicative,
    status: isReleased ? 'released' : isIndicative ? 'indicative' : 'request_quote',
    delivery: isReleased || isIndicative ? 'Delivery quoted separately.' : null,
  };
};
