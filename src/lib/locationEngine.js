import { normalizeLocationSearch } from '@/data/serviceAreas';
import { getMarketPrice } from '@/data/marketPricing';
import { getCustomerFacingCanadianCity } from '@/data/canadianPostalRules';
import { getDirectMarket, resolveDeliveryMarket } from '@/data/deliveryMarketRules';
import { canadianPostalFsaCentroids } from '@/data/generatedCanadianPostalFsaCentroids.js';

export const LOCATION_STORAGE_KEY = 'ce_selected_location';

export const cleanPostal = (value) =>
  String(value || '').trim().toUpperCase().replace(/\s+/g, '');

export const formatCanadianPostal = (value) => {
  const clean = cleanPostal(value);
  return clean.length === 6 ? `${clean.slice(0, 3)} ${clean.slice(3)}` : value;
};

// Delivery-market routing is deliberately separate from the customer-facing
// locality. A postal code can display "Neustadt, ON" while still routing to a
// nearby inventory market when one is configured.
const CANADIAN_PARENT_CITY_BY_FSA = [
  { prefixes: ['M'], city: 'Toronto', state: 'ON', marketId: 'toronto-on' },
  { prefixes: ['H'], city: 'Montreal', state: 'QC', marketId: 'montreal-qc' },
  { prefixes: ['G1'], city: 'Quebec', state: 'QC', marketId: 'montreal-qc' },
  { prefixes: ['V5', 'V6'], city: 'Vancouver', state: 'BC', marketId: 'vancouver-delta-bc' },
  { prefixes: ['T2', 'T3'], city: 'Calgary', state: 'AB', marketId: 'calgary-ab' },
  { prefixes: ['T5', 'T6'], city: 'Edmonton', state: 'AB', marketId: 'edmonton-ab' },
  { prefixes: ['B2'], city: 'Dartmouth', state: 'NS', marketId: 'halifax-dartmouth-ns' },
  { prefixes: ['B3'], city: 'Halifax', state: 'NS', marketId: 'halifax-dartmouth-ns' },
  { prefixes: ['R2', 'R3'], city: 'Winnipeg', state: 'MB', marketId: 'winnipeg-mb' },
  { prefixes: ['S4'], city: 'Regina', state: 'SK', marketId: 'regina-sk' },
  { prefixes: ['S7'], city: 'Saskatoon', state: 'SK', marketId: 'saskatoon-sk' },
];

const getCanadianMarket = (postalCode) => {
  const fsa = cleanPostal(postalCode).slice(0, 3);
  return CANADIAN_PARENT_CITY_BY_FSA.find(({ prefixes }) =>
    prefixes.some((prefix) => fsa.startsWith(prefix))
  );
};

const CANADIAN_POSTAL_DATA_ROOT = '/data/canadian-postal';
const canadianPostalCache = new Map();
const US_POSTAL_DATA_ROOT = '/data/us-postal';
const usPostalCache = new Map();

async function lookupCanadianPostalCode(postalCode) {
  const clean = cleanPostal(postalCode);
  const fsa = clean.slice(0, 3);
  let entries = canadianPostalCache.get(fsa);

  if (!entries) {
    const response = await fetch(`${CANADIAN_POSTAL_DATA_ROOT}/${fsa}.json`);
    if (!response.ok) throw new Error('Canadian postal code not found.');
    entries = await response.json();
    canadianPostalCache.set(fsa, entries);
  }

  const result = entries[clean];
  if (!Array.isArray(result) || !result[0] || !result[1]) {
    throw new Error('Canadian postal code not found.');
  }

  const market = getCanadianMarket(clean);
  const [latitude, longitude] = canadianPostalFsaCentroids[fsa] || [];
  return {
    city: getCustomerFacingCanadianCity(result[0], clean),
    state: result[1],
    marketId: market?.marketId,
    latitude,
    longitude,
  };
}

export const isUsZip = (value) => /^\d{5}$/.test(cleanPostal(value));

export const isCanadianPostal = (value) =>
  /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(cleanPostal(value));

export const getCountryLabel = (country) => {
  if (country === 'US') return 'USA';
  if (country === 'CA') return 'CA';
  return '';
};

// Some homepage markets intentionally pair two named cities. A ZIP/postal code
// that resolves to either exact city uses the pair's shared display name.
export const getSharedMarket = ({ city = '', state = '' } = {}) => {
  const market = getDirectMarket({ city, state });
  return (market?.marketAliases || []).length > 1 ? market : null;
};

export const resolveSharedMarketLocation = (location, { preserveDisplayCity = false } = {}) => {
  return resolveDeliveryMarket(location, { preserveDisplayCity });
};

async function lookupUsPostalCode(postalCode) {
  const clean = cleanPostal(postalCode);
  const prefix = clean.slice(0, 1);
  let entries = usPostalCache.get(prefix);

  if (!entries) {
    const response = await fetch(`${US_POSTAL_DATA_ROOT}/${prefix}.json`);
    if (!response.ok) throw new Error('ZIP / Postal Code not found.');
    entries = await response.json();
    usPostalCache.set(prefix, entries);
  }

  const result = entries[clean];
  if (!Array.isArray(result) || !result[0] || !result[1]) {
    throw new Error('ZIP / Postal Code not found.');
  }

  return {
    city: result[0],
    state: result[1],
    latitude: Number(result[2]),
    longitude: Number(result[3]),
  };
}

export async function lookupPostalCode(value) {
  const clean = cleanPostal(value);

  if (!isUsZip(clean) && !isCanadianPostal(clean)) {
    throw new Error('Enter a valid US ZIP or Canadian postal code.');
  }

  const isCanada = isCanadianPostal(clean);
  if (isCanada) {
    const canadianLocation = await lookupCanadianPostalCode(clean);
    const resolved = resolveSharedMarketLocation({
      ...canadianLocation,
      postalCode: formatCanadianPostal(clean),
      country: 'CA',
    }, { preserveDisplayCity: true });
    return canadianLocation.marketId ? { ...resolved, marketId: canadianLocation.marketId } : resolved;
  }

  const usLocation = await lookupUsPostalCode(clean);
  return resolveSharedMarketLocation({
    ...usLocation,
    postalCode: clean,
    country: 'US',
  });
}

export function saveSelectedLocation(location) {
  try {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
    window.dispatchEvent(new Event('ce-location-change'));
  } catch {}
}

export function getSavedSelectedLocation() {
  try {
    const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}
export function getStartingPrice(price) {
  return Math.round(Number(price || 0) * 0.88);
}

export function getLocalizedPrice(price, location, product = null) {
  const original = Number(price || 0);

  if (!location?.postalCode) {
    return getStartingPrice(original);
  }

  return getMarketPrice(
    product ? { ...product, base_price: original } : { base_price: original },
    location
  ).price;
}

// Geographic autocomplete shares the existing location-engine module but keeps
// postal lookup entirely separate. Open-Meteo supplies an up-to-date, public
// North American place index without exposing ZIP/postal searching here.
const GEOGRAPHIC_ENDPOINT = 'https://geocoding-api.open-meteo.com/v1/search';

const REGION_CODES = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA', Colorado: 'CO', Connecticut: 'CT', Delaware: 'DE', Florida: 'FL', Georgia: 'GA', Hawaii: 'HI', Idaho: 'ID', Illinois: 'IL', Indiana: 'IN', Iowa: 'IA', Kansas: 'KS', Kentucky: 'KY', Louisiana: 'LA', Maine: 'ME', Maryland: 'MD', Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN', Mississippi: 'MS', Missouri: 'MO', Montana: 'MT', Nebraska: 'NE', Nevada: 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', Ohio: 'OH', Oklahoma: 'OK', Oregon: 'OR', Pennsylvania: 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD', Tennessee: 'TN', Texas: 'TX', Utah: 'UT', Vermont: 'VT', Virginia: 'VA', Washington: 'WA', 'West Virginia': 'WV', Wisconsin: 'WI', Wyoming: 'WY',
  Alberta: 'AB', 'British Columbia': 'BC', Manitoba: 'MB', 'New Brunswick': 'NB', 'Newfoundland and Labrador': 'NL', 'Nova Scotia': 'NS', Nunavut: 'NU', Ontario: 'ON', 'Prince Edward Island': 'PE', Quebec: 'QC', Saskatchewan: 'SK', Yukon: 'YT', 'Northwest Territories': 'NT',
};

export const isGeographicNameQuery = (value) => {
  const query = String(value || '').trim();
  return Boolean(query) && !/\d/.test(query) && /[a-z]/i.test(query);
};

export async function searchNorthAmericanGeography(value) {
  if (!isGeographicNameQuery(value)) return [];

  const params = new URLSearchParams({
    name: String(value).trim(),
    count: '10',
    language: 'en',
    format: 'json',
  });
  const response = await fetch(`${GEOGRAPHIC_ENDPOINT}?${params.toString()}`);
  if (!response.ok) throw new Error('Geographic lookup is unavailable.');

  const payload = await response.json();
  const results = Array.isArray(payload?.results) ? payload.results : [];
  return results
    .filter((place) => place.country_code === 'US' || place.country_code === 'CA')
    .map((place) => ({
      key: `geography-${place.id}`,
      type: 'geography',
      city: place.name,
      displayName: `${place.name}, ${REGION_CODES[place.admin1] || place.admin1 || place.country_code}`,
      stateCode: REGION_CODES[place.admin1] || place.admin1 || '',
      stateName: place.admin1 || '',
      country: place.country_code === 'US' ? 'United States' : 'Canada',
      latitude: place.latitude,
      longitude: place.longitude,
    }));
}
