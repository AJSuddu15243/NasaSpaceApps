export const MAX_SELECTED_SITES = 4;
export const SOUTH_POLE_MIN_LAT = -90;
export const SOUTH_POLE_MAX_LAT = -80;

export type SiteCategory = 'artemis3' | 'clps' | 'intl' | 'apollo';
export interface CuratedSite {
  id: string;
  name: string;
  lat: number;
  lon: number;
  category: SiteCategory;
  note: string;
  source_url: string;
}
export interface CustomSite {
  kind: 'custom';
  id: string;
  name: string;
  lat: number;
  lon: number;
}
export interface CuratedSelection { kind: 'curated'; id: string; site: CuratedSite }
export type SelectedSite = CuratedSelection | CustomSite;

export const categories: { id: SiteCategory; label: string }[] = [
  { id: 'artemis3', label: 'Artemis III candidates' },
  { id: 'clps', label: 'Commercial Lunar Payload Services' },
  { id: 'intl', label: 'International missions' },
  { id: 'apollo', label: 'Apollo reference sites' },
];

export function searchSites(sites: readonly CuratedSite[], query: string): CuratedSite[] {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return [...sites];
  return sites.filter(site => `${site.name} ${site.note} ${site.category}`.toLocaleLowerCase().includes(normalized));
}

export function validateCustomSite(name: string, latText: string, lonText: string): { name: string; lat: number; lon: number } | string {
  const trimmed = name.trim();
  if (!trimmed) return 'Enter a site name.';
  if (trimmed.length > 80) return 'Site name must be 80 characters or fewer.';
  const decimal = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
  if (!decimal.test(latText.trim()) || !decimal.test(lonText.trim())) return 'Enter decimal latitude and longitude.';
  const lat = Number(latText);
  const lon = Number(lonText);
  if (!Number.isFinite(lat) || lat < SOUTH_POLE_MIN_LAT || lat > SOUTH_POLE_MAX_LAT) return 'Latitude must be from 90°S to 80°S.';
  if (!Number.isFinite(lon) || lon < -180 || lon > 180) return 'Longitude must be from 180°W to 180°E.';
  return { name: trimmed, lat, lon };
}

export function addSelection(current: readonly SelectedSite[], site: SelectedSite): SelectedSite[] | string {
  if (current.some(item => item.id === site.id || (item.kind === 'curated' && site.kind === 'curated' && item.site.id === site.site.id))) return [...current];
  if (current.length >= MAX_SELECTED_SITES) return `Compare up to ${MAX_SELECTED_SITES} sites. Remove one to add another.`;
  return [...current, site];
}

export function customSiteId(lat: number, lon: number): string {
  return `custom:${lat.toFixed(6)}:${lon.toFixed(6)}`;
}

export const SITE_MAP_CLICK_EVENT = 'lunar:site-map-click';
export interface SiteMapClickDetail { lat: number; lon: number; name?: string }

export function emitSiteMapClick(target: EventTarget, detail: SiteMapClickDetail): void {
  target.dispatchEvent(new CustomEvent<SiteMapClickDetail>(SITE_MAP_CLICK_EVENT, { detail }));
}
