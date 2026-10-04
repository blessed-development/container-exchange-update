// Search-only North American service areas. Each geographic entry routes to an
// existing Container Exchange market; no separate landing pages are created.
// This is intentionally data-driven so more communities can be added without
// changing the search interface or routing system.
export const serviceAreas = [
  {
    name: 'Orlando', displayName: 'Orlando, FL', stateOrProvince: 'Florida', abbreviation: 'FL', country: 'USA', parentLocationId: 'tampa-fl',
    aliases: ['Orlando', 'Orlando FL', 'Orlando Florida', 'Orlando USA', 'Orlando FL USA'],
  },
  {
    name: 'Philadelphia', displayName: 'Philadelphia, PA', stateOrProvince: 'Pennsylvania', abbreviation: 'PA', country: 'USA', parentLocationId: 'baltimore-md',
    aliases: ['Philadelphia', 'Philadelphia PA', 'Philadelphia Pennsylvania', 'Philadelphia USA', 'Philadelphia PA USA'],
  },
  {
    name: 'Ambrose', displayName: 'Ambrose, ND', stateOrProvince: 'North Dakota', abbreviation: 'ND', country: 'USA', parentLocationId: 'regina-sk',
    aliases: ['Ambrose', 'Ambrose ND', 'Ambrose North Dakota', 'Ambrose USA', 'Ambrose ND USA'],
  },
  {
    name: 'Beltsville', displayName: 'Beltsville, MD', stateOrProvince: 'Maryland', abbreviation: 'MD', country: 'USA', parentLocationId: 'baltimore-md',
    aliases: ['Beltsville', 'Beltsville MD', 'Beltsville Maryland', 'Beltsville USA', 'Beltsville MD USA'],
  },
  {
    name: 'Gays', displayName: 'Gays, IL', stateOrProvince: 'Illinois', abbreviation: 'IL', country: 'USA', parentLocationId: 'chicago-il',
    aliases: ['Gays', 'Gays IL', 'Gays Illinois', 'Gays USA', 'Gays IL USA'],
  },
  {
    name: 'Brampton', displayName: 'Brampton, ON', stateOrProvince: 'Ontario', abbreviation: 'ON', country: 'Canada', parentLocationId: 'toronto-on',
    aliases: ['Brampton', 'Brampton ON', 'Brampton Ontario', 'Brampton Canada', 'Brampton ON Canada'],
  },
  {
    name: 'Quebec City', displayName: 'Quebec City, QC', stateOrProvince: 'Quebec', abbreviation: 'QC', country: 'Canada', parentLocationId: 'montreal-qc',
    aliases: ['Quebec City', 'Quebec QC', 'Quebec, QC', 'Quebec Canada', 'Quebec City Canada', 'Ville de Quebec'],
  },
  {
    name: 'Ottawa', displayName: 'Ottawa, ON', stateOrProvince: 'Ontario', abbreviation: 'ON', country: 'Canada', parentLocationId: 'toronto-on',
    aliases: ['Ottawa', 'Ottawa ON', 'Ottawa Ontario', 'Ottawa Canada', 'Ottawa ON Canada'],
  },
  {
    name: 'Hopewell', displayName: 'Hopewell, NS', stateOrProvince: 'Nova Scotia', abbreviation: 'NS', country: 'Canada', parentLocationId: 'halifax-dartmouth-ns',
    aliases: ['Hopewell', 'Hopewell NS', 'Hopewell Nova Scotia', 'Hopewell Canada', 'Hopewell NS Canada'],
  },
  {
    name: 'Worsley', displayName: 'Worsley, AB', stateOrProvince: 'Alberta', abbreviation: 'AB', country: 'Canada', parentLocationId: 'edmonton-ab',
    aliases: ['Worsley', 'Worsley AB', 'Worsley Alberta', 'Worsley Canada', 'Worsley AB Canada'],
  },
  {
    name: 'Springfield', displayName: 'Springfield, IL', stateOrProvince: 'Illinois', abbreviation: 'IL', country: 'USA', parentLocationId: 'chicago-il',
    aliases: ['Springfield', 'Springfield IL', 'Springfield Illinois', 'Springfield USA'],
  },
  {
    name: 'Springfield', displayName: 'Springfield, MO', stateOrProvince: 'Missouri', abbreviation: 'MO', country: 'USA', parentLocationId: 'kansas-city-ks',
    aliases: ['Springfield', 'Springfield MO', 'Springfield Missouri', 'Springfield USA'],
  },
  {
    name: 'Springfield', displayName: 'Springfield, MA', stateOrProvince: 'Massachusetts', abbreviation: 'MA', country: 'USA', parentLocationId: 'worcester-boston-ma',
    aliases: ['Springfield', 'Springfield MA', 'Springfield Massachusetts', 'Springfield USA'],
  },
  {
    name: 'Santa Clara', displayName: 'Santa Clara, CA', stateOrProvince: 'California', abbreviation: 'CA', country: 'USA', parentLocationId: 'san-francisco-oakland-ca',
    aliases: ['Santa Clara', 'Santa Clara CA', 'Santa Clara California', 'Santa Clara USA'],
  },
  {
    name: 'Santa Rosa', displayName: 'Santa Rosa, CA', stateOrProvince: 'California', abbreviation: 'CA', country: 'USA', parentLocationId: 'san-francisco-oakland-ca',
    aliases: ['Santa Rosa', 'Santa Rosa CA', 'Santa Rosa California', 'Santa Rosa USA'],
  },
  {
    name: 'San Jose', displayName: 'San Jose, CA', stateOrProvince: 'California', abbreviation: 'CA', country: 'USA', parentLocationId: 'san-francisco-oakland-ca',
    aliases: ['San Jose', 'San Jose CA', 'San Jose California', 'San Jose USA'],
  },
  {
    name: 'Palo Alto', displayName: 'Palo Alto, CA', stateOrProvince: 'California', abbreviation: 'CA', country: 'USA', parentLocationId: 'san-francisco-oakland-ca',
    aliases: ['Palo Alto', 'Palo Alto CA', 'Palo Alto California', 'Palo Alto USA'],
  },
  {
    name: 'Sunnyvale', displayName: 'Sunnyvale, CA', stateOrProvince: 'California', abbreviation: 'CA', country: 'USA', parentLocationId: 'san-francisco-oakland-ca',
    aliases: ['Sunnyvale', 'Sunnyvale CA', 'Sunnyvale California', 'Sunnyvale USA'],
  },
  {
    name: 'Anaheim', displayName: 'Anaheim, CA', stateOrProvince: 'California', abbreviation: 'CA', country: 'USA', parentLocationId: 'los-angeles-long-beach-ca',
    aliases: ['Anaheim', 'Anaheim CA', 'Anaheim California', 'Anaheim USA'],
  },
  {
    name: 'San Diego', displayName: 'San Diego, CA', stateOrProvince: 'California', abbreviation: 'CA', country: 'USA', parentLocationId: 'los-angeles-long-beach-ca',
    aliases: ['San Diego', 'San Diego CA', 'San Diego California', 'San Diego USA'],
  },
  {
    name: 'Santa Ana', displayName: 'Santa Ana, CA', stateOrProvince: 'California', abbreviation: 'CA', country: 'USA', parentLocationId: 'los-angeles-long-beach-ca',
    aliases: ['Santa Ana', 'Santa Ana CA', 'Santa Ana California', 'Santa Ana USA'],
  },
  {
    name: 'Irvine', displayName: 'Irvine, CA', stateOrProvince: 'California', abbreviation: 'CA', country: 'USA', parentLocationId: 'los-angeles-long-beach-ca',
    aliases: ['Irvine', 'Irvine CA', 'Irvine California', 'Irvine USA'],
  },
  {
    name: 'Riverside', displayName: 'Riverside, CA', stateOrProvince: 'California', abbreviation: 'CA', country: 'USA', parentLocationId: 'los-angeles-long-beach-ca',
    aliases: ['Riverside', 'Riverside CA', 'Riverside California', 'Riverside USA'],
  },
  {
    name: 'Murrieta', displayName: 'Murrieta, CA', stateOrProvince: 'California', abbreviation: 'CA', country: 'USA', parentLocationId: 'temecula-ca',
    aliases: ['Murrieta', 'Murrieta CA', 'Murrieta California', 'Murrieta USA'],
  },
  {
    name: 'Menifee', displayName: 'Menifee, CA', stateOrProvince: 'California', abbreviation: 'CA', country: 'USA', parentLocationId: 'temecula-ca',
    aliases: ['Menifee', 'Menifee CA', 'Menifee California', 'Menifee USA'],
  },
  {
    name: 'Delano', displayName: 'Delano, CA', stateOrProvince: 'California', abbreviation: 'CA', country: 'USA', parentLocationId: 'bakersfield-ca',
    aliases: ['Delano', 'Delano CA', 'Delano California', 'Delano USA'],
  },
  {
    name: 'Visalia', displayName: 'Visalia, CA', stateOrProvince: 'California', abbreviation: 'CA', country: 'USA', parentLocationId: 'bakersfield-ca',
    aliases: ['Visalia', 'Visalia CA', 'Visalia California', 'Visalia USA'],
  },
  {
    name: 'Austin', displayName: 'Austin, TX', stateOrProvince: 'Texas', abbreviation: 'TX', country: 'USA', parentLocationId: 'san-antonio-tx',
    aliases: ['Austin', 'Austin TX', 'Austin Texas', 'Austin USA'],
  },
  {
    name: 'Fort Worth', displayName: 'Fort Worth, TX', stateOrProvince: 'Texas', abbreviation: 'TX', country: 'USA', parentLocationId: 'dallas-tx',
    aliases: ['Fort Worth', 'Fort Worth TX', 'Fort Worth Texas', 'Fort Worth USA'],
  },
  {
    name: 'Arlington', displayName: 'Arlington, TX', stateOrProvince: 'Texas', abbreviation: 'TX', country: 'USA', parentLocationId: 'dallas-tx',
    aliases: ['Arlington', 'Arlington TX', 'Arlington Texas', 'Arlington USA'],
  },
  {
    name: 'Plano', displayName: 'Plano, TX', stateOrProvince: 'Texas', abbreviation: 'TX', country: 'USA', parentLocationId: 'dallas-tx',
    aliases: ['Plano', 'Plano TX', 'Plano Texas', 'Plano USA'],
  },
  {
    name: 'Sugar Land', displayName: 'Sugar Land, TX', stateOrProvince: 'Texas', abbreviation: 'TX', country: 'USA', parentLocationId: 'houston-tx',
    aliases: ['Sugar Land', 'Sugar Land TX', 'Sugar Land Texas', 'Sugar Land USA'],
  },
  {
    name: 'Pasadena', displayName: 'Pasadena, TX', stateOrProvince: 'Texas', abbreviation: 'TX', country: 'USA', parentLocationId: 'houston-tx',
    aliases: ['Pasadena', 'Pasadena TX', 'Pasadena Texas', 'Pasadena USA'],
  },
  {
    name: 'Mississauga', displayName: 'Mississauga, ON', stateOrProvince: 'Ontario', abbreviation: 'ON', country: 'Canada', parentLocationId: 'toronto-on',
    aliases: ['Mississauga', 'Mississauga ON', 'Mississauga Ontario', 'Mississauga Canada'],
  },
  {
    name: 'Hamilton', displayName: 'Hamilton, ON', stateOrProvince: 'Ontario', abbreviation: 'ON', country: 'Canada', parentLocationId: 'toronto-on',
    aliases: ['Hamilton', 'Hamilton ON', 'Hamilton Ontario', 'Hamilton Canada'],
  },
  {
    name: 'Laval', displayName: 'Laval, QC', stateOrProvince: 'Quebec', abbreviation: 'QC', country: 'Canada', parentLocationId: 'montreal-qc',
    aliases: ['Laval', 'Laval QC', 'Laval Quebec', 'Laval Canada'],
  },
  {
    name: 'Dartmouth', displayName: 'Dartmouth, NS', stateOrProvince: 'Nova Scotia', abbreviation: 'NS', country: 'Canada', parentLocationId: 'halifax-dartmouth-ns',
    aliases: ['Dartmouth', 'Dartmouth NS', 'Dartmouth Nova Scotia', 'Dartmouth Canada'],
  },
  {
    name: 'Grande Prairie', displayName: 'Grande Prairie, AB', stateOrProvince: 'Alberta', abbreviation: 'AB', country: 'Canada', parentLocationId: 'edmonton-ab',
    aliases: ['Grande Prairie', 'Grande Prairie AB', 'Grande Prairie Alberta', 'Grande Prairie Canada'],
  },
];

export const normalizeLocationSearch = (value = '') => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ');
