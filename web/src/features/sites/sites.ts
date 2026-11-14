import type { Site } from '../../contracts/sites';

export const MAX_SELECTED_SITES = 4;

export function searchSites(sites: readonly Site[], query: string): Site[] {
  const term = query.trim().toLocaleLowerCase();
  return term
    ? sites.filter(site => `${site.name} ${site.note} ${site.category}`.toLocaleLowerCase().includes(term))
    : [...sites];
}

export function customSiteId(lat: number, lon: number): string {
  const encode = (value: number) => `${value < 0 ? 'm' : 'p'}${Math.abs(value).toFixed(6).replace('.', 'd')}`;
  return `custom-${encode(lat)}-${encode(lon)}`;
}

export function parseCustomSite(id: string): { lat: number; lon: number } | null {
  const match = /^custom-([mp])(\d{1,2}d\d{6})-([mp])(\d{1,3}d\d{6})$/.exec(id);
  if (!match) return null;
  const decode = (sign: string, value: string) => (sign === 'm' ? -1 : 1) * Number(value.replace('d', '.'));
  const lat = decode(match[1], match[2]);
  const lon = decode(match[3], match[4]);
  return lat >= -90 && lat <= -80 && lon >= -180 && lon <= 180 ? { lat, lon } : null;
}

export function validateCoordinates(latText: string, lonText: string): { lat: number; lon: number } | string {
  const decimal = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
  if (!decimal.test(latText.trim()) || !decimal.test(lonText.trim())) return 'Enter decimal latitude and longitude.';
  const lat = Number(latText);
  const lon = Number(lonText);
  if (lat < -90 || lat > -80) return 'Latitude must be from 90°S to 80°S.';
  if (lon < -180 || lon > 180) return 'Longitude must be from 180°W to 180°E.';
  return { lat, lon };
}
