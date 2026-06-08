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

  if (!place) {
    throw new Error('ZIP / Postal Code not found.');
  }

  return {
    city: place['place name'] || '',
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
