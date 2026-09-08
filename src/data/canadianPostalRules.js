const clean = (value = '') => String(value).trim().toLowerCase();

// Canada Post and geographic data commonly retain the names of Toronto's
// former boroughs. Customers expect the recognized municipality, Toronto,
// while independent municipalities such as Mississauga remain unchanged.
const TORONTO_BOROUGHS = new Set([
  'east york',
  'etobicoke',
  'north york',
  'scarborough',
  'york',
]);

export const getCustomerFacingCanadianCity = (city, postalCode = '') => {
  const normalizedPostal = String(postalCode).replace(/\s+/g, '').toUpperCase();
  if (normalizedPostal.startsWith('M') && TORONTO_BOROUGHS.has(clean(city))) {
    return 'Toronto';
  }
  return city;
};
