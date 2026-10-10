import { deliveryMarketCentroids } from '@/data/generatedDeliveryMarketCentroids.js';
import { resolveDeliveryMarket } from '@/data/deliveryMarketRules.js';

const toRadians = (value) => (Number(value) * Math.PI) / 180;

const milesBetween = (from, to) => {
  if (!Number.isFinite(from?.latitude) || !Number.isFinite(from?.longitude)
    || !Number.isFinite(to?.latitude) || !Number.isFinite(to?.longitude)) {
    return null;
  }

  const earthRadiusMiles = 3958.8;
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const a = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(toRadians(from.latitude))
      * Math.cos(toRadians(to.latitude))
      * Math.sin(longitudeDelta / 2) ** 2;

  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// This is deliberately an estimate, not a carrier quote. It uses the selected
// delivery market as a proxy origin, a conservative road-distance allowance,
// and a minimum tilt-bed dispatch charge. Access, carrier availability, and
// container configuration are confirmed after the reservation request.
export const getDeliveryEstimate = (location) => {
  if (!location?.postalCode && !location?.zip && !location?.zipCode) return null;

  const marketLocation = resolveDeliveryMarket(location, { preserveDisplayCity: true });
  const market = deliveryMarketCentroids.find((entry) => entry.slug === marketLocation?.marketId);
  const directMiles = milesBetween(location, market);

  if (directMiles === null) return null;

  const estimatedRoadMiles = Math.round(directMiles * 1.18);
  const low = Math.round(450 + estimatedRoadMiles * 6);
  const high = Math.round(low + Math.max(150, low * 0.2));

  return {
    low,
    high,
    marketName: marketLocation?.marketDisplayName || marketLocation?.city || '',
  };
};

export const formatDeliveryEstimate = (estimate) => {
  if (!estimate) return 'Enter ZIP / postal code';

  const format = (value) => `$${Number(value).toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })}`;

  return `${format(estimate.low)}–${format(estimate.high)} USD`;
};
