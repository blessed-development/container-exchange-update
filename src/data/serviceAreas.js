// Search-only service areas. Each entry routes to an existing primary market;
// no separate landing pages or routes are created for these communities.
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
];

export const normalizeLocationSearch = (value = '') => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ');
