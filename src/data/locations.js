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
  headingSize = 'text-[clamp(2.65rem,5.25vw,6.1rem)]',
  featured = false,
  imageReady = false,
  directoryNames = [],
  marketAliases = [],
}) => {
  const subtitle = `New and used shipping containers for sale in ${stateName ? `${city}, ${stateName}` : city}, with unbeatable pricing and fast delivery across ${deliveryRegion}.`;

  return {
    slug,
    city,
    displayName,
    stateCode,
    stateName,
    country,
    deliveryRegion,
    regionLabel,
    subtitle,
    heroImage: heroImage || `/images/locations/${slug}-hero.webp`,
    heroAlt: heroAlt || `${city} skyline representing the local shipping container market`,
    heroPosition,
    headingSize,
    seo: {
      title: `Buy Shipping Containers in ${displayName} | Container Exchange`,
      description: subtitle,
    },
    rating: 4.9,
    featured,
    imageReady: imageReady || locationImageStatus[slug] === true,
    directoryNames: [displayName, city, ...directoryNames],
    marketAliases: [city, ...marketAliases],
  };
};

export const locations = [
  createLocation({ slug: 'houston-tx', city: 'Houston', displayName: 'Houston, TX', stateCode: 'TX', stateName: 'Texas', country: 'USA', regionLabel: 'GULF COAST CONTAINER DEPOT', heroPosition: 'center 46%', featured: true, imageReady: true }),
  createLocation({ slug: 'chicago-il', city: 'Chicago', displayName: 'Chicago, IL', stateCode: 'IL', stateName: 'Illinois', country: 'USA', deliveryRegion: 'Illinois', regionLabel: 'MIDWEST CONTAINER DEPOT', heroImage: '/images/locations/us/chicago-il-hero.webp', heroAlt: 'Chicago skyline representing the local shipping container market', heroPosition: 'center 44%', featured: true }),
  createLocation({ slug: 'toronto-on', city: 'Toronto', displayName: 'Toronto, ON', stateCode: 'ON', stateName: 'Ontario', country: 'Canada', deliveryRegion: 'Ontario', regionLabel: 'GREATER TORONTO CONTAINER DEPOT', heroImage: '/images/locations/canada/toronto-on-hero.webp', heroAlt: 'Toronto skyline with the CN Tower representing the local shipping container market', heroPosition: 'center 42%', featured: true }),
  createLocation({ slug: 'dallas-tx', city: 'Dallas', displayName: 'Dallas, TX', stateCode: 'TX', stateName: 'Texas', country: 'USA', deliveryRegion: 'Texas', regionLabel: 'NORTH TEXAS CONTAINER DEPOT', heroImage: '/images/locations/us/dallas-tx-hero.webp', heroAlt: 'Dallas skyline representing the local shipping container market', heroPosition: 'center 43%', featured: true }),
  createLocation({ slug: 'montreal-qc', city: 'Montreal', displayName: 'Montreal, QC', stateCode: 'QC', stateName: 'Quebec', country: 'Canada', deliveryRegion: 'Quebec', regionLabel: 'QUEBEC CONTAINER DEPOT', heroImage: '/images/locations/canada/montreal-qc-hero.webp', heroAlt: 'Montreal skyline and waterfront representing the local shipping container market', heroPosition: 'center 46%', featured: true }),
  createLocation({ slug: 'savannah-ga', city: 'Savannah', displayName: 'Savannah, GA', stateCode: 'GA', stateName: 'Georgia', country: 'USA', deliveryRegion: 'Georgia', regionLabel: 'SOUTHEAST CONTAINER DEPOT', heroImage: '/images/locations/us/savannah-ga-hero.webp', heroAlt: 'Savannah riverfront representing the local shipping container market', heroPosition: 'center 45%', featured: true }),
  createLocation({ slug: 'vancouver-delta-bc', city: 'Vancouver', displayName: 'Vancouver / Delta, BC', stateCode: 'BC', stateName: 'British Columbia', country: 'Canada', regionLabel: 'PACIFIC COAST CONTAINER DEPOT', heroImage: '/images/locations/canada/vancouver-delta-bc-hero.webp', heroAlt: 'Vancouver skyline and harbour representing the local shipping container market', heroPosition: 'center 46%', featured: true, directoryNames: ['Vancouver, BC / Delta, BC', 'Vancouver / Delta'], marketAliases: ['Delta'] }),
  createLocation({ slug: 'los-angeles-long-beach-ca', city: 'Los Angeles / Long Beach', displayName: 'Los Angeles / Long Beach, CA', stateCode: 'CA', stateName: 'California', country: 'USA', regionLabel: 'SOUTHERN CALIFORNIA CONTAINER DEPOT', heroPosition: 'center 43%', featured: true, imageReady: true, marketAliases: ['Los Angeles', 'Long Beach'] }),
  createLocation({ slug: 'calgary-ab', city: 'Calgary', displayName: 'Calgary, AB', stateCode: 'AB', stateName: 'Alberta', country: 'Canada', regionLabel: 'ALBERTA CONTAINER DEPOT', heroImage: '/images/locations/canada/calgary-ab-hero.webp', heroAlt: 'Calgary skyline representing the local shipping container market', heroPosition: 'center 45%', featured: true }),
  createLocation({ slug: 'halifax-dartmouth-ns', city: 'Halifax / Dartmouth', displayName: 'Halifax / Dartmouth, NS', stateCode: 'NS', stateName: 'Nova Scotia', country: 'Canada', regionLabel: 'ATLANTIC CANADA CONTAINER DEPOT', heroImage: '/images/locations/canada/halifax-dartmouth-ns-hero.webp', heroAlt: 'Halifax waterfront and skyline representing the local shipping container market', heroPosition: 'center 46%', featured: true, directoryNames: ['Halifax', 'Halifax, NS'], marketAliases: ['Halifax', 'Dartmouth'] }),
  createLocation({ slug: 'atlanta-ga', city: 'Atlanta', displayName: 'Atlanta, GA', stateCode: 'GA', stateName: 'Georgia', country: 'USA', regionLabel: 'SOUTHEAST CONTAINER DEPOT', heroImage: '/images/locations/us/atlanta-ga-hero.webp', heroAlt: 'Atlanta skyline representing the local shipping container market', heroPosition: 'center 44%' }),
  createLocation({ slug: 'charlotte-nc', city: 'Charlotte', displayName: 'Charlotte, NC', stateCode: 'NC', stateName: 'North Carolina', country: 'USA', regionLabel: 'CAROLINAS CONTAINER DEPOT', heroImage: '/images/locations/us/charlotte-nc-hero.webp', heroAlt: 'Charlotte skyline representing the local shipping container market', heroPosition: 'center 44%' }),
  createLocation({ slug: 'columbus-oh', city: 'Columbus', displayName: 'Columbus, OH', stateCode: 'OH', stateName: 'Ohio', country: 'USA', regionLabel: 'OHIO VALLEY CONTAINER DEPOT', heroImage: '/images/locations/us/columbus-oh-hero.webp', heroAlt: 'Columbus skyline and Scioto River representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'el-paso-tx', city: 'El Paso', displayName: 'El Paso, TX', stateCode: 'TX', stateName: 'Texas', country: 'USA', regionLabel: 'WEST TEXAS CONTAINER DEPOT', heroImage: '/images/locations/us/el-paso-tx-hero.webp', heroAlt: 'El Paso skyline with the Franklin Mountains representing the local shipping container market', heroPosition: 'center 46%' }),
  createLocation({ slug: 'kansas-city-ks', city: 'Kansas City', displayName: 'Kansas City, KS', stateCode: 'KS', stateName: 'Kansas', country: 'USA', regionLabel: 'CENTRAL PLAINS CONTAINER DEPOT', heroImage: '/images/locations/us/kansas-city-ks-hero.webp', heroAlt: 'Kansas City skyline and Missouri River representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'louisville-ky', city: 'Louisville', displayName: 'Louisville, KY', stateCode: 'KY', stateName: 'Kentucky', country: 'USA', regionLabel: 'KENTUCKY CONTAINER DEPOT', heroImage: '/images/locations/us/louisville-ky-hero.webp', heroAlt: 'Louisville skyline and Ohio River representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'mobile-al', city: 'Mobile', displayName: 'Mobile, AL', stateCode: 'AL', stateName: 'Alabama', country: 'USA', regionLabel: 'GULF SOUTH CONTAINER DEPOT', heroImage: '/images/locations/us/mobile-al-hero.webp', heroAlt: 'Mobile skyline and waterfront representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'norfolk-va', city: 'Norfolk', displayName: 'Norfolk, VA', stateCode: 'VA', stateName: 'Virginia', country: 'USA', regionLabel: 'HAMPTON ROADS CONTAINER DEPOT', heroImage: '/images/locations/us/norfolk-va-hero.webp', heroAlt: 'Norfolk skyline and Elizabeth River waterfront representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'raleigh-nc', city: 'Raleigh', displayName: 'Raleigh, NC', stateCode: 'NC', stateName: 'North Carolina', country: 'USA', regionLabel: 'TRIANGLE CONTAINER DEPOT', heroImage: '/images/locations/us/raleigh-nc-hero.webp', heroAlt: 'Raleigh downtown skyline representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'tampa-fl', city: 'Tampa', displayName: 'Tampa, FL', stateCode: 'FL', stateName: 'Florida', country: 'USA', regionLabel: 'WEST FLORIDA CONTAINER DEPOT', heroImage: '/images/locations/us/tampa-fl-hero.webp', heroAlt: 'Tampa waterfront skyline representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'saskatoon-sk', city: 'Saskatoon', displayName: 'Saskatoon, SK', stateCode: 'SK', stateName: 'Saskatchewan', country: 'Canada', regionLabel: 'SASKATCHEWAN CONTAINER DEPOT', heroImage: '/images/locations/canada/saskatoon-sk-hero.webp', heroAlt: 'Saskatoon skyline and South Saskatchewan River representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'bakersfield-ca', city: 'Bakersfield', displayName: 'Bakersfield, CA', stateCode: 'CA', stateName: 'California', country: 'USA', regionLabel: 'CENTRAL CALIFORNIA CONTAINER DEPOT', heroImage: '/images/locations/us/bakersfield-ca-hero.webp', heroAlt: 'Bakersfield skyline and southern San Joaquin Valley representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'laredo-tx', city: 'Laredo', displayName: 'Laredo, TX', stateCode: 'TX', stateName: 'Texas', country: 'USA', regionLabel: 'SOUTH TEXAS CONTAINER DEPOT', heroImage: '/images/locations/us/laredo-tx-hero.webp', heroAlt: 'Laredo skyline and Rio Grande riverfront representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'memphis-tn', city: 'Memphis', displayName: 'Memphis, TN', stateCode: 'TN', stateName: 'Tennessee', country: 'USA', regionLabel: 'MID-SOUTH CONTAINER DEPOT', heroImage: '/images/locations/us/memphis-tn-hero.webp', heroAlt: 'Memphis skyline and Mississippi River representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'nashville-tn', city: 'Nashville', displayName: 'Nashville, TN', stateCode: 'TN', stateName: 'Tennessee', country: 'USA', regionLabel: 'TENNESSEE CONTAINER DEPOT', heroImage: '/images/locations/us/nashville-tn-hero.webp', heroAlt: 'Nashville skyline representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'omaha-ne', city: 'Omaha', displayName: 'Omaha, NE', stateCode: 'NE', stateName: 'Nebraska', country: 'USA', regionLabel: 'NEBRASKA CONTAINER DEPOT', heroImage: '/images/locations/us/omaha-ne-hero.webp', heroAlt: 'Omaha skyline and Missouri River representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'salt-lake-city-ut', city: 'Salt Lake City', displayName: 'Salt Lake City, UT', stateCode: 'UT', stateName: 'Utah', country: 'USA', regionLabel: 'MOUNTAIN WEST CONTAINER DEPOT', heroImage: '/images/locations/us/salt-lake-city-ut-hero.webp', heroAlt: 'Salt Lake City skyline and Wasatch Mountains representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'seattle-wa', city: 'Seattle', displayName: 'Seattle, WA', stateCode: 'WA', stateName: 'Washington', country: 'USA', regionLabel: 'PUGET SOUND CONTAINER DEPOT', heroImage: '/images/locations/us/seattle-wa-hero.webp', heroAlt: 'Seattle skyline, Elliott Bay, Space Needle, and Mount Rainier representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'temecula-ca', city: 'Temecula', displayName: 'Temecula, CA', stateCode: 'CA', stateName: 'California', country: 'USA', regionLabel: 'INLAND SOUTHERN CALIFORNIA CONTAINER DEPOT', heroImage: '/images/locations/us/temecula-ca-hero.webp', heroAlt: 'Temecula Valley vineyards and hills representing the local shipping container market', heroPosition: 'center 47%' }),
  createLocation({ slug: 'baltimore-md', city: 'Baltimore', displayName: 'Baltimore, MD', stateCode: 'MD', stateName: 'Maryland', country: 'USA', regionLabel: 'CHESAPEAKE CONTAINER DEPOT', heroImage: '/images/locations/us/baltimore-md-hero.webp', heroAlt: 'Baltimore Inner Harbor skyline representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'cincinnati-oh', city: 'Cincinnati', displayName: 'Cincinnati, OH', stateCode: 'OH', stateName: 'Ohio', country: 'USA', regionLabel: 'OHIO RIVER CONTAINER DEPOT', heroImage: '/images/locations/us/cincinnati-oh-hero.webp', heroAlt: 'Cincinnati skyline and Ohio River representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'denver-co', city: 'Denver', displayName: 'Denver, CO', stateCode: 'CO', stateName: 'Colorado', country: 'USA', regionLabel: 'ROCKY MOUNTAIN CONTAINER DEPOT', heroImage: '/images/locations/us/denver-co-hero.webp', heroAlt: 'Denver skyline with the Rocky Mountains representing the local shipping container market', heroPosition: 'center 44%' }),
  createLocation({ slug: 'indianapolis-in', city: 'Indianapolis', displayName: 'Indianapolis, IN', stateCode: 'IN', stateName: 'Indiana', country: 'USA', regionLabel: 'INDIANA CONTAINER DEPOT', heroImage: '/images/locations/us/indianapolis-in-hero.webp', heroAlt: 'Indianapolis skyline and Soldiers and Sailors Monument representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'las-vegas-nv', city: 'Las Vegas', displayName: 'Las Vegas, NV', stateCode: 'NV', stateName: 'Nevada', country: 'USA', regionLabel: 'NEVADA CONTAINER DEPOT', heroImage: '/images/locations/us/las-vegas-nv-hero.webp', heroAlt: 'Las Vegas skyline and Strip representing the local shipping container market', heroPosition: 'center 44%' }),
  createLocation({ slug: 'miami-fl', city: 'Miami', displayName: 'Miami, FL', stateCode: 'FL', stateName: 'Florida', country: 'USA', regionLabel: 'SOUTH FLORIDA CONTAINER DEPOT', heroImage: '/images/locations/us/miami-fl-hero.webp', heroAlt: 'Miami skyline and Biscayne Bay representing the local shipping container market', heroPosition: 'center 44%' }),
  createLocation({ slug: 'new-orleans-la', city: 'New Orleans', displayName: 'New Orleans, LA', stateCode: 'LA', stateName: 'Louisiana', country: 'USA', regionLabel: 'LOUISIANA CONTAINER DEPOT', heroImage: '/images/locations/us/new-orleans-la-hero.webp', heroAlt: 'New Orleans French Quarter, Mississippi River, and skyline representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'phoenix-az', city: 'Phoenix', displayName: 'Phoenix, AZ', stateCode: 'AZ', stateName: 'Arizona', country: 'USA', regionLabel: 'ARIZONA CONTAINER DEPOT', heroImage: '/images/locations/us/phoenix-az-hero.webp', heroAlt: 'Phoenix skyline, Sonoran Desert, and Camelback Mountain representing the local shipping container market', heroPosition: 'center 46%' }),
  createLocation({ slug: 'san-antonio-tx', city: 'San Antonio', displayName: 'San Antonio, TX', stateCode: 'TX', stateName: 'Texas', country: 'USA', regionLabel: 'SOUTH CENTRAL TEXAS CONTAINER DEPOT', heroImage: '/images/locations/us/san-antonio-tx-hero.webp', heroAlt: 'San Antonio River Walk, historic architecture, and downtown skyline representing the local shipping container market', heroPosition: 'center 46%' }),
  createLocation({ slug: 'st-louis-mo', city: 'St. Louis', displayName: 'St. Louis, MO', stateCode: 'MO', stateName: 'Missouri', country: 'USA', regionLabel: 'MISSOURI CONTAINER DEPOT', heroImage: '/images/locations/us/st-louis-mo-hero.webp', heroAlt: 'St. Louis Gateway Arch and Mississippi River skyline representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'wilmington-nc', city: 'Wilmington', displayName: 'Wilmington, NC', stateCode: 'NC', stateName: 'North Carolina', country: 'USA', regionLabel: 'COASTAL CAROLINAS CONTAINER DEPOT', heroImage: '/images/locations/us/wilmington-nc-hero.webp', heroAlt: 'Wilmington Cape Fear River waterfront and historic downtown representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'edmonton-ab', city: 'Edmonton', displayName: 'Edmonton, AB', stateCode: 'AB', stateName: 'Alberta', country: 'Canada', regionLabel: 'NORTHERN ALBERTA CONTAINER DEPOT', heroImage: '/images/locations/canada/edmonton-ab-hero.webp', heroAlt: 'Edmonton skyline and North Saskatchewan River valley representing the local shipping container market', heroPosition: 'center 46%' }),
  createLocation({ slug: 'winnipeg-mb', city: 'Winnipeg', displayName: 'Winnipeg, MB', stateCode: 'MB', stateName: 'Manitoba', country: 'Canada', regionLabel: 'MANITOBA CONTAINER DEPOT', heroImage: '/images/locations/canada/winnipeg-mb-hero.webp', heroAlt: 'Winnipeg Forks, Esplanade Riel, and riverfront skyline representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'charleston-sc', city: 'Charleston', displayName: 'Charleston, SC', stateCode: 'SC', stateName: 'South Carolina', country: 'USA', regionLabel: 'LOWCOUNTRY CONTAINER DEPOT', heroImage: '/images/locations/us/charleston-sc-hero.webp', heroAlt: 'Charleston historic waterfront and Lowcountry architecture representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'cleveland-oh', city: 'Cleveland', displayName: 'Cleveland, OH', stateCode: 'OH', stateName: 'Ohio', country: 'USA', regionLabel: 'GREAT LAKES CONTAINER DEPOT', heroImage: '/images/locations/us/cleveland-oh-hero.webp', heroAlt: 'Cleveland skyline, Lake Erie, and Rock and Roll Hall of Fame representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'detroit-mi', city: 'Detroit', displayName: 'Detroit, MI', stateCode: 'MI', stateName: 'Michigan', country: 'USA', regionLabel: 'MICHIGAN CONTAINER DEPOT', heroImage: '/images/locations/us/detroit-mi-hero.webp', heroAlt: 'Detroit riverfront skyline and Renaissance Center representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'jacksonville-fl', city: 'Jacksonville', displayName: 'Jacksonville, FL', stateCode: 'FL', stateName: 'Florida', country: 'USA', regionLabel: 'NORTHEAST FLORIDA CONTAINER DEPOT', heroImage: '/images/locations/us/jacksonville-fl-hero.webp', heroAlt: 'Jacksonville skyline and St. Johns River bridge representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'minneapolis-mn', city: 'Minneapolis', displayName: 'Minneapolis, MN', stateCode: 'MN', stateName: 'Minnesota', country: 'USA', regionLabel: 'UPPER MIDWEST CONTAINER DEPOT', heroImage: '/images/locations/us/minneapolis-mn-hero.webp', heroAlt: 'Minneapolis skyline and Stone Arch Bridge over the Mississippi River representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'new-york-newark-ny-nj', city: 'New York / Newark', displayName: 'New York, NY / Newark, NJ', stateCode: 'NY / NJ', stateName: 'New York / New Jersey', country: 'USA', regionLabel: 'NORTHEAST CONTAINER DEPOT', directoryNames: ['New York / Newark'], marketAliases: ['New York', 'Newark'], heroImage: '/images/locations/us/new-york-newark-ny-nj-hero.webp', heroAlt: 'New York City skyline, One World Trade Center, and the Statue of Liberty representing the local shipping container market', heroPosition: 'center 45%' }),
  createLocation({ slug: 'portland-or', city: 'Portland', displayName: 'Portland, OR', stateCode: 'OR', stateName: 'Oregon', country: 'USA', regionLabel: 'OREGON CONTAINER DEPOT', heroImage: '/images/locations/us/portland-or-hero.webp', heroAlt: 'Portland skyline, Willamette River, and Tilikum Crossing representing the local shipping container market', heroPosition: 'center 47%' }),
  createLocation({ slug: 'san-francisco-oakland-ca', city: 'San Francisco / Oakland', displayName: 'San Francisco / Oakland, CA', stateCode: 'CA', stateName: 'California', country: 'USA', regionLabel: 'BAY AREA CONTAINER DEPOT', marketAliases: ['San Francisco', 'Oakland'], heroImage: '/images/locations/us/san-francisco-oakland-ca-hero.webp', heroAlt: 'San Francisco skyline and Bay Bridge representing the local shipping container market', heroPosition: 'center 46%' }),
  createLocation({ slug: 'tacoma-wa', city: 'Tacoma', displayName: 'Tacoma, WA', stateCode: 'WA', stateName: 'Washington', country: 'USA', regionLabel: 'SOUTH PUGET SOUND CONTAINER DEPOT', heroImage: '/images/locations/us/tacoma-wa-hero.webp', heroAlt: 'Tacoma waterfront, skyline, and Mount Rainier representing the local shipping container market', heroPosition: 'center 46%' }),
  createLocation({ slug: 'worcester-boston-ma', city: 'Worcester / Boston', displayName: 'Worcester / Boston, MA', stateCode: 'MA', stateName: 'Massachusetts', country: 'USA', regionLabel: 'NEW ENGLAND CONTAINER DEPOT', marketAliases: ['Worcester', 'Boston'], heroImage: '/images/locations/us/worcester-boston-ma-hero.webp', heroAlt: 'Boston skyline, Zakim Bridge, and Charles River representing the local shipping container market', heroPosition: 'center 47%' }),
  createLocation({ slug: 'regina-sk', city: 'Regina', displayName: 'Regina, SK', stateCode: 'SK', stateName: 'Saskatchewan', country: 'Canada', regionLabel: 'SOUTHERN SASKATCHEWAN CONTAINER DEPOT', heroImage: '/images/locations/canada/regina-sk-hero.webp', heroAlt: 'Regina Wascana Lake and Saskatchewan Legislative Building representing the local shipping container market', heroPosition: 'center 46%' }),
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
