const locationRoutePrefix = '/buy-shipping-containers-';

const createLocation = ({
  slug,
  city,
  displayName,
  stateCode,
  stateName,
  country,
  regionLabel,
  deliveryRegion = stateName,
  heroImage,
  heroAlt,
  heroPosition = 'center 45%',
  featured = false,
  imageReady = false,
  directoryNames = [],
}) => ({
  slug,
  city,
  displayName,
  stateCode,
  stateName,
  country,
  deliveryRegion,
  regionLabel,
  subtitle: `New and used shipping containers for sale in ${stateName ? `${city}, ${stateName}` : city}, with unbeatable pricing and fast delivery across ${stateName}.`,
  heroImage: heroImage || `/images/locations/${slug}-hero.webp`,
  heroAlt: heroAlt || `${city} skyline representing the local shipping container market`,
  heroPosition,
  rating: 4.9,
  featured,
  imageReady: imageReady || locationImageStatus[slug] === true,
  directoryNames: [displayName, city, ...directoryNames],
});

export const locations = [
  createLocation({ slug: 'houston-tx', city: 'Houston', displayName: 'Houston, TX', stateCode: 'TX', stateName: 'Texas', country: 'USA', regionLabel: 'GULF COAST CONTAINER DEPOT', heroPosition: 'center 46%', featured: true, imageReady: true }),
  createLocation({ slug: 'chicago-il', city: 'Chicago', displayName: 'Chicago, IL', stateCode: 'IL', stateName: 'Illinois', country: 'USA', deliveryRegion: 'Illinois', regionLabel: 'MIDWEST CONTAINER DEPOT', heroImage: '/images/locations/us/chicago-il-hero.webp', heroAlt: 'Chicago skyline representing the local shipping container market', heroPosition: 'center 44%', featured: true }),
  createLocation({ slug: 'toronto-on', city: 'Toronto', displayName: 'Toronto, ON', stateCode: 'ON', stateName: 'Ontario', country: 'Canada', deliveryRegion: 'Ontario', regionLabel: 'GREATER TORONTO CONTAINER DEPOT', heroImage: '/images/locations/canada/toronto-on-hero.webp', heroAlt: 'Toronto skyline with the CN Tower representing the local shipping container market', heroPosition: 'center 42%', featured: true }),
  createLocation({ slug: 'dallas-tx', city: 'Dallas', displayName: 'Dallas, TX', stateCode: 'TX', stateName: 'Texas', country: 'USA', deliveryRegion: 'Texas', regionLabel: 'NORTH TEXAS CONTAINER DEPOT', heroImage: '/images/locations/us/dallas-tx-hero.webp', heroAlt: 'Dallas skyline representing the local shipping container market', heroPosition: 'center 43%', featured: true }),
  createLocation({ slug: 'montreal-qc', city: 'Montreal', displayName: 'Montreal, QC', stateCode: 'QC', stateName: 'Quebec', country: 'Canada', deliveryRegion: 'Quebec', regionLabel: 'QUEBEC CONTAINER DEPOT', heroImage: '/images/locations/canada/montreal-qc-hero.webp', heroAlt: 'Montreal skyline and waterfront representing the local shipping container market', heroPosition: 'center 46%', featured: true }),
  createLocation({ slug: 'savannah-ga', city: 'Savannah', displayName: 'Savannah, GA', stateCode: 'GA', stateName: 'Georgia', country: 'USA', deliveryRegion: 'Georgia', regionLabel: 'SOUTHEAST PORT CONTAINER DEPOT', heroImage: '/images/locations/us/savannah-ga-hero.webp', heroAlt: 'Savannah riverfront representing the local shipping container market', heroPosition: 'center 45%', featured: true }),
  createLocation({ slug: 'vancouver-delta-bc', city: 'Vancouver', displayName: 'Vancouver / Delta, BC', stateCode: 'BC', stateName: 'British Columbia', country: 'Canada', regionLabel: 'PACIFIC COAST CONTAINER DEPOT', featured: true, directoryNames: ['Vancouver, BC / Delta, BC', 'Vancouver / Delta'] }),
  createLocation({ slug: 'los-angeles-long-beach-ca', city: 'Los Angeles / Long Beach', displayName: 'Los Angeles / Long Beach, CA', stateCode: 'CA', stateName: 'California', country: 'USA', regionLabel: 'SOUTHERN CALIFORNIA CONTAINER DEPOT', heroPosition: 'center 43%', featured: true, imageReady: true }),
  createLocation({ slug: 'calgary-ab', city: 'Calgary', displayName: 'Calgary, AB', stateCode: 'AB', stateName: 'Alberta', country: 'Canada', regionLabel: 'ALBERTA CONTAINER DEPOT', featured: true }),
  createLocation({ slug: 'halifax-dartmouth-ns', city: 'Halifax / Dartmouth', displayName: 'Halifax / Dartmouth, NS', stateCode: 'NS', stateName: 'Nova Scotia', country: 'Canada', regionLabel: 'ATLANTIC CANADA CONTAINER DEPOT', featured: true, directoryNames: ['Halifax', 'Halifax, NS'] }),
  createLocation({ slug: 'atlanta-ga', city: 'Atlanta', displayName: 'Atlanta, GA', stateCode: 'GA', stateName: 'Georgia', country: 'USA', regionLabel: 'SOUTHEAST CONTAINER DEPOT' }),
  createLocation({ slug: 'charlotte-nc', city: 'Charlotte', displayName: 'Charlotte, NC', stateCode: 'NC', stateName: 'North Carolina', country: 'USA', regionLabel: 'CAROLINAS CONTAINER DEPOT' }),
  createLocation({ slug: 'columbus-oh', city: 'Columbus', displayName: 'Columbus, OH', stateCode: 'OH', stateName: 'Ohio', country: 'USA', regionLabel: 'OHIO VALLEY CONTAINER DEPOT' }),
  createLocation({ slug: 'el-paso-tx', city: 'El Paso', displayName: 'El Paso, TX', stateCode: 'TX', stateName: 'Texas', country: 'USA', regionLabel: 'WEST TEXAS CONTAINER DEPOT' }),
  createLocation({ slug: 'kansas-city-ks', city: 'Kansas City', displayName: 'Kansas City, KS', stateCode: 'KS', stateName: 'Kansas', country: 'USA', regionLabel: 'CENTRAL PLAINS CONTAINER DEPOT' }),
  createLocation({ slug: 'louisville-ky', city: 'Louisville', displayName: 'Louisville, KY', stateCode: 'KY', stateName: 'Kentucky', country: 'USA', regionLabel: 'KENTUCKY CONTAINER DEPOT' }),
  createLocation({ slug: 'mobile-al', city: 'Mobile', displayName: 'Mobile, AL', stateCode: 'AL', stateName: 'Alabama', country: 'USA', regionLabel: 'GULF SOUTH CONTAINER DEPOT' }),
  createLocation({ slug: 'norfolk-va', city: 'Norfolk', displayName: 'Norfolk, VA', stateCode: 'VA', stateName: 'Virginia', country: 'USA', regionLabel: 'HAMPTON ROADS CONTAINER DEPOT' }),
  createLocation({ slug: 'raleigh-nc', city: 'Raleigh', displayName: 'Raleigh, NC', stateCode: 'NC', stateName: 'North Carolina', country: 'USA', regionLabel: 'TRIANGLE CONTAINER DEPOT' }),
  createLocation({ slug: 'tampa-fl', city: 'Tampa', displayName: 'Tampa, FL', stateCode: 'FL', stateName: 'Florida', country: 'USA', regionLabel: 'WEST FLORIDA CONTAINER DEPOT' }),
  createLocation({ slug: 'saskatoon-sk', city: 'Saskatoon', displayName: 'Saskatoon, SK', stateCode: 'SK', stateName: 'Saskatchewan', country: 'Canada', regionLabel: 'SASKATCHEWAN CONTAINER DEPOT' }),
  createLocation({ slug: 'bakersfield-ca', city: 'Bakersfield', displayName: 'Bakersfield, CA', stateCode: 'CA', stateName: 'California', country: 'USA', regionLabel: 'CENTRAL CALIFORNIA CONTAINER DEPOT' }),
  createLocation({ slug: 'laredo-tx', city: 'Laredo', displayName: 'Laredo, TX', stateCode: 'TX', stateName: 'Texas', country: 'USA', regionLabel: 'SOUTH TEXAS CONTAINER DEPOT' }),
  createLocation({ slug: 'memphis-tn', city: 'Memphis', displayName: 'Memphis, TN', stateCode: 'TN', stateName: 'Tennessee', country: 'USA', regionLabel: 'MID-SOUTH CONTAINER DEPOT' }),
  createLocation({ slug: 'nashville-tn', city: 'Nashville', displayName: 'Nashville, TN', stateCode: 'TN', stateName: 'Tennessee', country: 'USA', regionLabel: 'TENNESSEE CONTAINER DEPOT' }),
  createLocation({ slug: 'omaha-ne', city: 'Omaha', displayName: 'Omaha, NE', stateCode: 'NE', stateName: 'Nebraska', country: 'USA', regionLabel: 'NEBRASKA CONTAINER DEPOT' }),
  createLocation({ slug: 'salt-lake-city-ut', city: 'Salt Lake City', displayName: 'Salt Lake City, UT', stateCode: 'UT', stateName: 'Utah', country: 'USA', regionLabel: 'MOUNTAIN WEST CONTAINER DEPOT' }),
  createLocation({ slug: 'seattle-wa', city: 'Seattle', displayName: 'Seattle, WA', stateCode: 'WA', stateName: 'Washington', country: 'USA', regionLabel: 'PUGET SOUND CONTAINER DEPOT' }),
  createLocation({ slug: 'temecula-ca', city: 'Temecula', displayName: 'Temecula, CA', stateCode: 'CA', stateName: 'California', country: 'USA', regionLabel: 'INLAND SOUTHERN CALIFORNIA CONTAINER DEPOT' }),
  createLocation({ slug: 'baltimore-md', city: 'Baltimore', displayName: 'Baltimore, MD', stateCode: 'MD', stateName: 'Maryland', country: 'USA', regionLabel: 'CHESAPEAKE CONTAINER DEPOT' }),
  createLocation({ slug: 'cincinnati-oh', city: 'Cincinnati', displayName: 'Cincinnati, OH', stateCode: 'OH', stateName: 'Ohio', country: 'USA', regionLabel: 'OHIO RIVER CONTAINER DEPOT' }),
  createLocation({ slug: 'denver-co', city: 'Denver', displayName: 'Denver, CO', stateCode: 'CO', stateName: 'Colorado', country: 'USA', regionLabel: 'ROCKY MOUNTAIN CONTAINER DEPOT' }),
  createLocation({ slug: 'indianapolis-in', city: 'Indianapolis', displayName: 'Indianapolis, IN', stateCode: 'IN', stateName: 'Indiana', country: 'USA', regionLabel: 'INDIANA CONTAINER DEPOT' }),
  createLocation({ slug: 'las-vegas-nv', city: 'Las Vegas', displayName: 'Las Vegas, NV', stateCode: 'NV', stateName: 'Nevada', country: 'USA', regionLabel: 'NEVADA CONTAINER DEPOT' }),
  createLocation({ slug: 'miami-fl', city: 'Miami', displayName: 'Miami, FL', stateCode: 'FL', stateName: 'Florida', country: 'USA', regionLabel: 'SOUTH FLORIDA CONTAINER DEPOT' }),
  createLocation({ slug: 'new-orleans-la', city: 'New Orleans', displayName: 'New Orleans, LA', stateCode: 'LA', stateName: 'Louisiana', country: 'USA', regionLabel: 'LOUISIANA CONTAINER DEPOT' }),
  createLocation({ slug: 'phoenix-az', city: 'Phoenix', displayName: 'Phoenix, AZ', stateCode: 'AZ', stateName: 'Arizona', country: 'USA', regionLabel: 'ARIZONA CONTAINER DEPOT' }),
  createLocation({ slug: 'san-antonio-tx', city: 'San Antonio', displayName: 'San Antonio, TX', stateCode: 'TX', stateName: 'Texas', country: 'USA', regionLabel: 'SOUTH CENTRAL TEXAS CONTAINER DEPOT' }),
  createLocation({ slug: 'st-louis-mo', city: 'St. Louis', displayName: 'St. Louis, MO', stateCode: 'MO', stateName: 'Missouri', country: 'USA', regionLabel: 'MISSOURI CONTAINER DEPOT' }),
  createLocation({ slug: 'wilmington-nc', city: 'Wilmington', displayName: 'Wilmington, NC', stateCode: 'NC', stateName: 'North Carolina', country: 'USA', regionLabel: 'COASTAL CAROLINAS CONTAINER DEPOT' }),
  createLocation({ slug: 'edmonton-ab', city: 'Edmonton', displayName: 'Edmonton, AB', stateCode: 'AB', stateName: 'Alberta', country: 'Canada', regionLabel: 'NORTHERN ALBERTA CONTAINER DEPOT' }),
  createLocation({ slug: 'winnipeg-mb', city: 'Winnipeg', displayName: 'Winnipeg, MB', stateCode: 'MB', stateName: 'Manitoba', country: 'Canada', regionLabel: 'MANITOBA CONTAINER DEPOT' }),
  createLocation({ slug: 'charleston-sc', city: 'Charleston', displayName: 'Charleston, SC', stateCode: 'SC', stateName: 'South Carolina', country: 'USA', regionLabel: 'LOWCOUNTRY CONTAINER DEPOT' }),
  createLocation({ slug: 'cleveland-oh', city: 'Cleveland', displayName: 'Cleveland, OH', stateCode: 'OH', stateName: 'Ohio', country: 'USA', regionLabel: 'GREAT LAKES CONTAINER DEPOT' }),
  createLocation({ slug: 'detroit-mi', city: 'Detroit', displayName: 'Detroit, MI', stateCode: 'MI', stateName: 'Michigan', country: 'USA', regionLabel: 'MICHIGAN CONTAINER DEPOT' }),
  createLocation({ slug: 'jacksonville-fl', city: 'Jacksonville', displayName: 'Jacksonville, FL', stateCode: 'FL', stateName: 'Florida', country: 'USA', regionLabel: 'NORTHEAST FLORIDA CONTAINER DEPOT' }),
  createLocation({ slug: 'minneapolis-mn', city: 'Minneapolis', displayName: 'Minneapolis, MN', stateCode: 'MN', stateName: 'Minnesota', country: 'USA', regionLabel: 'UPPER MIDWEST CONTAINER DEPOT' }),
  createLocation({ slug: 'new-york-newark-ny-nj', city: 'New York / Newark', displayName: 'New York, NY / Newark, NJ', stateCode: 'NY / NJ', stateName: 'New York / New Jersey', country: 'USA', regionLabel: 'NORTHEAST CONTAINER DEPOT', directoryNames: ['New York / Newark'] }),
  createLocation({ slug: 'portland-or', city: 'Portland', displayName: 'Portland, OR', stateCode: 'OR', stateName: 'Oregon', country: 'USA', regionLabel: 'OREGON CONTAINER DEPOT' }),
  createLocation({ slug: 'san-francisco-oakland-ca', city: 'San Francisco / Oakland', displayName: 'San Francisco / Oakland, CA', stateCode: 'CA', stateName: 'California', country: 'USA', regionLabel: 'BAY AREA CONTAINER DEPOT' }),
  createLocation({ slug: 'tacoma-wa', city: 'Tacoma', displayName: 'Tacoma, WA', stateCode: 'WA', stateName: 'Washington', country: 'USA', regionLabel: 'SOUTH PUGET SOUND CONTAINER DEPOT' }),
  createLocation({ slug: 'worcester-boston-ma', city: 'Worcester / Boston', displayName: 'Worcester / Boston, MA', stateCode: 'MA', stateName: 'Massachusetts', country: 'USA', regionLabel: 'NEW ENGLAND CONTAINER DEPOT' }),
  createLocation({ slug: 'regina-sk', city: 'Regina', displayName: 'Regina, SK', stateCode: 'SK', stateName: 'Saskatchewan', country: 'Canada', regionLabel: 'SOUTHERN SASKATCHEWAN CONTAINER DEPOT' }),
];

export const getLocationBySlug = (slug) => locations.find((location) => location.slug === slug);
export const getLocationByDirectoryName = (name) => locations.find((location) => location.directoryNames.includes(name));
export const getLocationPath = (location) => `${locationRoutePrefix}${location.slug}`;

export const findDuplicateHeroImages = (items = locations) => {
  const seen = new Map();
  items.forEach((location) => {
    const matches = seen.get(location.heroImage) || [];
    matches.push(location.slug);
    seen.set(location.heroImage, matches);
  });
  return [...seen.entries()].filter(([, slugs]) => slugs.length > 1);
};

export const duplicateHeroImages = findDuplicateHeroImages();

if (typeof import.meta.env !== 'undefined' && import.meta.env.DEV && duplicateHeroImages.length) {
  console.warn('Duplicate location hero image paths detected:', duplicateHeroImages);
}
import locationImageStatus from './locationImageStatus.js';
