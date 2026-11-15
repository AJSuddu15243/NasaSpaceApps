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
  const rounded = Math.round(lon * 1e6) / 1e6;
  const wrapped = rounded === 180 ? -180 : rounded;
  return `custom-${encode(lat)}-${encode(wrapped)}`;
}

export function parseCustomSite(id: string): { lat: number; lon: number } | null {
  const match = /^custom-([mp])(\d{1,2}d\d{6})-([mp])(\d{1,3}d\d{6})$/.exec(id);
  if (!match) return null;
  const decode = (sign: string, value: string) => (sign === 'm' ? -1 : 1) * Number(value.replace('d', '.'));
  const lat = decode(match[1], match[2]);
  const lon = decode(match[3], match[4]);
  // 180 is the same meridian as -180; canonical form is -180.
  const canonicalLon = lon === 180 ? -180 : lon;
  return lat >= -90 && lat <= 90 && canonicalLon >= -180 && canonicalLon < 180 ? { lat, lon: canonicalLon } : null;
}

export function validateCoordinates(latText: string, lonText: string): { lat: number; lon: number } | string {
  const decimal = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
  if (!decimal.test(latText.trim()) || !decimal.test(lonText.trim())) return 'Enter decimal latitude and longitude.';
  const lat = Number(latText);
  const lon = Number(lonText);
  if (lat < -90 || lat > 90) return 'Latitude must be from 90°S to 90°N.';
  if (lon < -180 || lon > 180) return 'Longitude must be from 180°W to 180°E.';
  // Contract lon_deg is [-180, 180): 180 is written as -180 so one place has one id.
  return { lat, lon: lon === 180 ? -180 : lon };
}

export const formatCoordinates = (lat: number, lon: number) => `${Math.abs(lat).toFixed(2)}°${lat < 0 ? 'S' : 'N'} · ${Math.abs(lon).toFixed(2)}°${lon < 0 ? 'W' : 'E'}`;
