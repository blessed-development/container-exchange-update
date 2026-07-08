// ZIP code to approximate region mapping for delivery fee calculation
// Maps first 3 digits of ZIP to region info
const ZIP_REGIONS = {
  // Northeast
  '100': { region: 'Northeast', city: 'New York, NY', baseFee: 350 },
  '101': { region: 'Northeast', city: 'New York, NY', baseFee: 350 },
  '102': { region: 'Northeast', city: 'New York, NY', baseFee: 350 },
  '103': { region: 'Northeast', city: 'Staten Island, NY', baseFee: 350 },
  '070': { region: 'Northeast', city: 'Newark, NJ', baseFee: 350 },
  '071': { region: 'Northeast', city: 'Newark, NJ', baseFee: 350 },
  '072': { region: 'Northeast', city: 'Newark, NJ', baseFee: 350 },
  '021': { region: 'Northeast', city: 'Boston, MA', baseFee: 375 },
  '022': { region: 'Northeast', city: 'Boston, MA', baseFee: 375 },
  '191': { region: 'Northeast', city: 'Philadelphia, PA', baseFee: 325 },
  '152': { region: 'Northeast', city: 'Pittsburgh, PA', baseFee: 350 },
  // Southeast
  '300': { region: 'Southeast', city: 'Atlanta, GA', baseFee: 275 },
  '301': { region: 'Southeast', city: 'Atlanta, GA', baseFee: 275 },
  '303': { region: 'Southeast', city: 'Atlanta, GA', baseFee: 275 },
  '331': { region: 'Southeast', city: 'Miami, FL', baseFee: 325 },
  '332': { region: 'Southeast', city: 'Tampa, FL', baseFee: 300 },
  '322': { region: 'Southeast', city: 'Jacksonville, FL', baseFee: 275 },
  '282': { region: 'Southeast', city: 'Charlotte, NC', baseFee: 300 },
  '294': { region: 'Southeast', city: 'Charleston, SC', baseFee: 300 },
  '372': { region: 'Southeast', city: 'Nashville, TN', baseFee: 275 },
  '366': { region: 'Southeast', city: 'Mobile, AL', baseFee: 250 },
  // Midwest
  '606': { region: 'Midwest', city: 'Chicago, IL', baseFee: 300 },
  '432': { region: 'Midwest', city: 'Columbus, OH', baseFee: 300 },
  '441': { region: 'Midwest', city: 'Cleveland, OH', baseFee: 325 },
  '462': { region: 'Midwest', city: 'Indianapolis, IN', baseFee: 300 },
  '481': { region: 'Midwest', city: 'Detroit, MI', baseFee: 325 },
  '554': { region: 'Midwest', city: 'Minneapolis, MN', baseFee: 350 },
  '631': { region: 'Midwest', city: 'St. Louis, MO', baseFee: 300 },
  '660': { region: 'Midwest', city: 'Kansas City, KS', baseFee: 300 },
  '681': { region: 'Midwest', city: 'Omaha, NE', baseFee: 325 },
  '402': { region: 'Midwest', city: 'Louisville, KY', baseFee: 300 },
  // South / Texas
  '770': { region: 'South', city: 'Houston, TX', baseFee: 200 },
  '771': { region: 'South', city: 'Houston, TX', baseFee: 200 },
  '772': { region: 'South', city: 'Houston, TX', baseFee: 200 },
  '750': { region: 'South', city: 'Dallas, TX', baseFee: 225 },
  '751': { region: 'South', city: 'Dallas, TX', baseFee: 225 },
  '752': { region: 'South', city: 'Dallas, TX', baseFee: 225 },
  '782': { region: 'South', city: 'San Antonio, TX', baseFee: 250 },
  '787': { region: 'South', city: 'Austin, TX', baseFee: 250 },
  '760': { region: 'South', city: 'Fort Worth, TX', baseFee: 225 },
  '799': { region: 'South', city: 'El Paso, TX', baseFee: 325 },
  '701': { region: 'South', city: 'New Orleans, LA', baseFee: 250 },
  '381': { region: 'South', city: 'Memphis, TN', baseFee: 275 },
  // West
  '900': { region: 'West', city: 'Los Angeles, CA', baseFee: 250 },
  '901': { region: 'West', city: 'Los Angeles, CA', baseFee: 250 },
  '902': { region: 'West', city: 'Los Angeles, CA', baseFee: 250 },
  '906': { region: 'West', city: 'Long Beach, CA', baseFee: 225 },
  '917': { region: 'West', city: 'Los Angeles, CA', baseFee: 250 },
  '921': { region: 'West', city: 'San Diego, CA', baseFee: 275 },
  '941': { region: 'West', city: 'San Francisco, CA', baseFee: 300 },
  '945': { region: 'West', city: 'Oakland, CA', baseFee: 275 },
  '950': { region: 'West', city: 'San Jose, CA', baseFee: 300 },
  '926': { region: 'West', city: 'Santa Ana, CA', baseFee: 250 },
  '928': { region: 'West', city: 'Anaheim, CA', baseFee: 250 },
  '937': { region: 'West', city: 'Sacramento, CA', baseFee: 300 },
  '933': { region: 'West', city: 'Bakersfield, CA', baseFee: 275 },
  '935': { region: 'West', city: 'Fresno, CA', baseFee: 300 },
  '925': { region: 'West', city: 'Riverside, CA', baseFee: 250 },
  // Pacific Northwest
  '981': { region: 'Pacific NW', city: 'Seattle, WA', baseFee: 300 },
  '984': { region: 'Pacific NW', city: 'Tacoma, WA', baseFee: 275 },
  '972': { region: 'Pacific NW', city: 'Portland, OR', baseFee: 300 },
  // Mountain
  '850': { region: 'Mountain', city: 'Phoenix, AZ', baseFee: 300 },
  '891': { region: 'Mountain', city: 'Las Vegas, NV', baseFee: 300 },
  '841': { region: 'Mountain', city: 'Salt Lake City, UT', baseFee: 350 },
  '802': { region: 'Mountain', city: 'Denver, CO', baseFee: 325 },
  // Mid-Atlantic
  '212': { region: 'Mid-Atlantic', city: 'Baltimore, MD', baseFee: 300 },
  '209': { region: 'Mid-Atlantic', city: 'Silver Spring, MD', baseFee: 325 },
  '235': { region: 'Mid-Atlantic', city: 'Norfolk, VA', baseFee: 275 },
  '276': { region: 'Southeast', city: 'Raleigh, NC', baseFee: 300 },
};

export function getLocationFromZip(zipCode) {
  if (!zipCode || zipCode.length < 3) return null;
  
  const prefix = zipCode.substring(0, 3);
  const match = ZIP_REGIONS[prefix];
  
  if (match) {
    return match;
  }
  
  // Fallback: estimate based on first digit
  const firstDigit = zipCode[0];
  const fallbacks = {
    '0': { region: 'Northeast', city: 'Northeast Region', baseFee: 375 },
    '1': { region: 'Northeast', city: 'Northeast Region', baseFee: 350 },
    '2': { region: 'Mid-Atlantic', city: 'Mid-Atlantic Region', baseFee: 325 },
    '3': { region: 'Southeast', city: 'Southeast Region', baseFee: 300 },
    '4': { region: 'Midwest', city: 'Midwest Region', baseFee: 325 },
    '5': { region: 'Midwest', city: 'Midwest Region', baseFee: 350 },
    '6': { region: 'Midwest', city: 'Central Region', baseFee: 325 },
    '7': { region: 'South', city: 'Southern Region', baseFee: 250 },
    '8': { region: 'Mountain', city: 'Mountain Region', baseFee: 350 },
    '9': { region: 'West', city: 'Western Region', baseFee: 275 },
  };
  
  return fallbacks[firstDigit] || { region: 'United States', city: 'Your Region', baseFee: 350 };
}

export function calculateDeliveryFee(zipCode, containerSize) {
  const location = getLocationFromZip(zipCode);
  if (!location) return null;
  
  // Size multiplier
  const sizeMultiplier = {
    '10': 0.85,
    '20': 1.0,
    '40': 1.35,
  };
  
  const multiplier = sizeMultiplier[containerSize] || 1.0;
  const fee = Math.round(location.baseFee * multiplier);
  
  return {
    fee,
    city: location.city,
    region: location.region,
    estimatedDays: location.baseFee > 300 ? '5-7' : '3-5',
  };
}

export function isValidZipCode(zip) {
  return /^\d{5}$/.test(zip);
}