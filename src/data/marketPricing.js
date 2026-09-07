import { locations } from '@/data/locations';
import { serviceAreas } from '@/data/serviceAreas';

// This is the single editable source for customer-facing container prices.
// All amounts are USD. A product price is used only when its status is
// "published"; reference prices stay private until an operator approves them.
export const MARKET_PRICE_OVERRIDES = {
  'jacksonville-fl': {
    updatedAt: '2024-07-29',
    source: 'Supplier inventory email',
    products: {
      'used-40hc-cw': {
        supplierCost: 1950,
        retailPrice: null,
        status: 'reference',
        note: 'Historical supplier reference — review before publishing.',
      },
      'new-40hc-iicl': {
        supplierCost: 3800,
        retailPrice: null,
        status: 'reference',
        note: 'Historical supplier reference — review before publishing.',
      },
    },
  },
};

const normalize = (value = '') =>
  String(value).trim().toLowerCase().replace(/[^a-z0-9]/g, '');

const matchesState = (market, state) => {
  if (!state) return true;
  return String(market.stateCode || '')
    .split('/')
    .some((code) => normalize(code) === normalize(state));
};

export const getMarketIdForLocation = (location = {}) => {
  if (location.marketId) return location.marketId;

  const city = normalize(location.city || location.detectedCity);
  const state = location.stateCode || location.state || location.detectedState;
  if (!city) return null;

  const directMarket = locations.find((market) => {
    const names = [
      market.city,
      market.displayName,
      ...(market.directoryNames || []),
      ...(market.marketAliases || []),
    ];
    return matchesState(market, state) && names.some((name) => normalize(name) === city);
  });

  if (directMarket) return directMarket.slug;

  const serviceArea = serviceAreas.find((area) =>
    normalize(area.name) === city && normalize(area.abbreviation) === normalize(state)
  );

  return serviceArea?.parentLocationId || null;
};

export const getMarketPrice = (product, location) => {
  const basePrice = Number(product?.base_price ?? product?.price ?? 0);
  const marketId = getMarketIdForLocation(location);
  const record = marketId ? MARKET_PRICE_OVERRIDES[marketId]?.products?.[product?.id] : null;
  const isPublished = record?.status === 'published' && Number(record?.retailPrice) > 0;

  return {
    price: isPublished ? Number(record.retailPrice) : basePrice,
    marketId,
    isPublished,
    source: record?.source || MARKET_PRICE_OVERRIDES[marketId]?.source || null,
    updatedAt: MARKET_PRICE_OVERRIDES[marketId]?.updatedAt || null,
  };
};

