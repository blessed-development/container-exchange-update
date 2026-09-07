import { locations } from '@/data/locations';
import { serviceAreas } from '@/data/serviceAreas';

// This is the single editable source for customer-facing container prices.
// All amounts are USD. Each listed retail price uses the approved 25% markup
// on its historical supplier cost and is rounded to the nearest $25.
export const MARKET_PRICE_OVERRIDES = {
  'jacksonville-fl': {
    updatedAt: '2024-07-29',
    source: 'Supplier inventory email',
    products: {
      'new-20-iicl': {
        supplierCost: 2700,
        retailPrice: 3375,
        status: 'published',
        note: 'Historical supplier cost with approved 25% retail markup.',
      },
      'used-20-cw': {
        supplierCost: 1700,
        retailPrice: 2125,
        status: 'published',
        note: 'Historical supplier cost with approved 25% retail markup.',
      },
      'used-40-cw': {
        supplierCost: 1850,
        retailPrice: 2325,
        status: 'published',
        note: 'Historical supplier cost with approved 25% retail markup.',
      },
      'used-40hc-cw': {
        supplierCost: 1950,
        retailPrice: 2450,
        status: 'published',
        note: 'Historical supplier cost with approved 25% retail markup.',
      },
      'new-40hc-iicl': {
        supplierCost: 3800,
        retailPrice: 4750,
        status: 'published',
        note: 'Historical supplier cost with approved 25% retail markup.',
      },
    },
  },
  'miami-fl': {
    updatedAt: '2024-07-29',
    source: 'Supplier inventory email',
    products: {
      'new-20-iicl': { supplierCost: 2350, retailPrice: 2950, status: 'published', note: 'Historical supplier cost with approved 25% retail markup.' },
      'used-20-cw': { supplierCost: 1300, retailPrice: 1625, status: 'published', note: 'Historical supplier cost with approved 25% retail markup.' },
      'used-40-cw': { supplierCost: 1500, retailPrice: 1875, status: 'published', note: 'Historical supplier cost with approved 25% retail markup.' },
      'used-40hc-cw': { supplierCost: 1700, retailPrice: 2125, status: 'published', note: 'Historical supplier cost with approved 25% retail markup.' },
      'new-40hc-iicl': { supplierCost: 3500, retailPrice: 4375, status: 'published', note: 'Historical supplier cost with approved 25% retail markup.' },
    },
  },
  'los-angeles-long-beach-ca': {
    updatedAt: '2024-07-29',
    source: 'Supplier inventory email',
    products: {
      'used-20-cw': { supplierCost: 1350, retailPrice: 1700, status: 'published', note: 'Historical supplier cost with approved 25% retail markup.' },
      'used-40-cw': { supplierCost: 1500, retailPrice: 1875, status: 'published', note: 'Historical supplier cost with approved 25% retail markup.' },
      'used-40hc-cw': { supplierCost: 1850, retailPrice: 2325, status: 'published', note: 'Historical supplier cost with approved 25% retail markup.' },
      'new-40hc-iicl': { supplierCost: 3850, retailPrice: 4825, status: 'published', note: 'Historical supplier cost with approved 25% retail markup.' },
    },
  },
  'san-francisco-oakland-ca': {
    updatedAt: '2024-07-29',
    source: 'Supplier inventory email',
    products: {
      'new-20-iicl': { supplierCost: 2450, retailPrice: 3075, status: 'published', note: 'Historical supplier cost with approved 25% retail markup.' },
      'used-20-cw': { supplierCost: 1550, retailPrice: 1950, status: 'published', note: 'Historical supplier cost with approved 25% retail markup.' },
      'used-40-cw': { supplierCost: 1700, retailPrice: 2125, status: 'published', note: 'Historical supplier cost with approved 25% retail markup.' },
      'used-40hc-cw': { supplierCost: 1850, retailPrice: 2325, status: 'published', note: 'Historical supplier cost with approved 25% retail markup.' },
      'new-40hc-iicl': { supplierCost: 4150, retailPrice: 5200, status: 'published', note: 'Historical supplier cost with approved 25% retail markup.' },
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
