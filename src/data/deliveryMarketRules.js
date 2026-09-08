import { locations } from './locations.js';
import { normalizeLocationSearch, serviceAreas } from './serviceAreas.js';
import { deliveryMarketCentroids } from './generatedDeliveryMarketCentroids.js';

const sameText = (left, right) =>
  normalizeLocationSearch(left) === normalizeLocationSearch(right);

const marketIncludesState = (market, state) => {
  if (!state) return true;

  return String(market.stateCode || '')
    .split('/')
    .map((code) => code.trim())
    .some((code) => sameText(code, state));
};

const countryCodeFor = (country) => (country === 'CA' || country === 'Canada' ? 'CA' : 'US');

export const isPairedMarket = (market) => (market?.marketAliases || []).length > 1;

export const getDirectMarket = ({ city = '', state = '' } = {}) => {
  if (!city) return null;

  return locations.find((market) =>
    marketIncludesState(market, state)
    && [market.city, ...(market.marketAliases || [])].some((name) => sameText(name, city))
  ) || null;
};

export const getServiceAreaMarket = ({ city = '', state = '' } = {}) => {
  if (!city) return null;

  const area = serviceAreas.find((entry) =>
    sameText(entry.name, city)
    && (!state || sameText(entry.abbreviation, state))
  );

  return area ? locations.find((market) => market.slug === area.parentLocationId) || null : null;
};

const toRadians = (value) => (Number(value) * Math.PI) / 180;

const distanceInKilometers = (from, to) => {
  const earthRadius = 6371;
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(longitudeDelta / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const getNearestMarket = ({ country = 'US', state = '', latitude, longitude } = {}) => {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;

  const countryCode = countryCodeFor(country);
  const candidates = deliveryMarketCentroids.filter((market) => market.country === countryCode);
  const inSameState = state
    ? candidates.filter((market) => market.stateCodes.some((code) => sameText(code, state)))
    : [];
  const eligibleMarkets = inSameState.length ? inSameState : candidates;

  const nearest = eligibleMarkets.reduce((nearest, candidate) => {
    const distance = distanceInKilometers({ latitude, longitude }, candidate);
    return !nearest || distance < nearest.distance ? { candidate, distance } : nearest;
  }, null);

  return nearest ? locations.find((market) => market.slug === nearest.candidate.slug) || null : null;
};

// The resolved market is intentionally separate from the exact postal locality.
// For example, Anaheim continues to be a valid locality, while its inventory and
// pricing come from the Los Angeles / Long Beach market.
export const resolveDeliveryMarket = (location, { preserveDisplayCity = false } = {}) => {
  if (!location) return location;

  const market = getDirectMarket(location)
    || getServiceAreaMarket(location)
    || getNearestMarket(location);

  if (!market) return location;

  return {
    ...location,
    detectedCity: location.detectedCity || location.city,
    detectedState: location.detectedState || location.state || location.stateCode,
    ...(isPairedMarket(market) && !preserveDisplayCity
      ? { city: market.city, state: market.stateCode, stateCode: market.stateCode }
      : {}),
    marketId: market.slug,
    marketDisplayName: market.displayName,
  };
};
