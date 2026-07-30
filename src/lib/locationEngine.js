export const POSTAL_OVERRIDES = {
  L4C3Y2: {
    city: 'Richmond Hill',
    state: 'ON',
  },
  L0L1P0: {
    city: 'Springwater',
    state: 'ON',
  },
};

export const LOCATION_STORAGE_KEY = 'ce_selected_location';

export const cleanPostal = (value) =>
  String(value || '').trim().toUpperCase().replace(/\s+/g, '');

export const formatCanadianPostal = (value) => {
  const clean = cleanPostal(value);
  return clean.length === 6 ? `${clean.slice(0, 3)} ${clean.slice(3)}` : value;
};

export const isUsZip = (value) => /^\d{5}$/.test(cleanPostal(value));

export const isCanadianPostal = (value) =>
  /^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(cleanPostal(value));

export const getCountryLabel = (country) => {
  if (country === 'US') return 'USA';
  if (country === 'CA') return 'CA';
  return '';
};

export async function lookupPostalCode(value) {
  const clean = cleanPostal(value);

  if (!isUsZip(clean) && !isCanadianPostal(clean)) {
    throw new Error('Enter a valid US ZIP or Canadian postal code.');
  }

  const override = POSTAL_OVERRIDES[clean];

  if (override) {
    return {
      city: override.city,
      state: override.state,
      postalCode: formatCanadianPostal(clean),
      country: 'CA',
    };
  }

  const isCanada = isCanadianPostal(clean);
  const country = isCanada ? 'ca' : 'us';
  const apiPostal = isCanada ? clean.slice(0, 3) : clean;

  const response = await fetch(
    `https://api.zippopotam.us/${country}/${encodeURIComponent(apiPostal)}`
  );

  if (!response.ok) {
    throw new Error('ZIP / Postal Code not found.');
  }

  const data = await response.json();
  const place = data?.places?.[0];
  const CANADA_CITY_OVERRIDES = {
  M9C: 'Toronto',
  M9V: 'Toronto',
  M5V: 'Toronto',
  H3B: 'Montreal',
  R3C: 'Winnipeg',
  L4C: 'Richmond Hill',
  L0L: 'Springwater',
};

const canadaPrefix = clean.slice(0, 3);

const city = isCanada
  ? CANADA_CITY_OVERRIDES[canadaPrefix] || place['place name']?.split('(')[0]?.split('/')[0]?.trim()
  : place['place name'];
  if (!place) {
    throw new Error('ZIP / Postal Code not found.');
  }

  return {
    city: city || '',
    state: place['state abbreviation'] || place.state || '',
    postalCode: isCanada ? formatCanadianPostal(clean) : clean,
    country: isCanada ? 'CA' : 'US',
  };
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

export function getLocalizedPrice(price, location) {
  const original = Number(price || 0);

  if (!location?.postalCode) {
    return getStartingPrice(original);
  }

  return original;
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
