import { describe, expect, it } from 'vitest';
import { customSiteId, MAX_SELECTED_SITES, parseCustomSite, searchSites, validateCoordinates } from './sites';
import type { Site } from '../../contracts/sites';

const sites: Site[] = [
  { id: 'haworth', name: 'Haworth', lat: -87, lon: 14, category: 'artemis3', note: 'South pole rim', source_url: 'https://example.com' },
  { id: 'apollo-11', name: 'Apollo 11', lat: 0.67, lon: 23.47, category: 'apollo', note: 'Equatorial contrast', source_url: 'https://example.com' },
];

it('cannot give the antimeridian two IDs after coordinate rounding', () => {
  expect(customSiteId(-85, 180)).toBe(customSiteId(-85, -180));
  expect(customSiteId(-85, 179.9999999)).toBe(customSiteId(-85, -180));
  expect(parseCustomSite(customSiteId(-85, 540))).toBeNull();
});

describe('searchSites', () => {
  it('returns all sites for an empty query and filters by name, note or category', () => {
    expect(searchSites(sites, '  ')).toHaveLength(2);
    expect(searchSites(sites, 'apollo')).toEqual([sites[1]]);
    expect(searchSites(sites, 'contrast')).toEqual([sites[1]]);
    expect(searchSites(sites, 'artemis3')).toEqual([sites[0]]);
    expect(searchSites(sites, 'nothing')).toEqual([]);
  });
});

describe('validateCoordinates', () => {
  it('accepts south-pole decimal coordinates', () => {
    expect(validateCoordinates('-85.5', '45.25')).toEqual({ lat: -85.5, lon: 45.25 });
  });

  it('rejects non-decimal input and out-of-range latitude', () => {
    expect(validateCoordinates('abc', '45')).toBe('Enter decimal latitude and longitude.');
    expect(validateCoordinates('-70', '45')).toEqual({ lat: -70, lon: 45 });
    expect(validateCoordinates('91', '45')).toBe('Latitude must be from 90°S to 90°N.');
    expect(validateCoordinates('-85', '200')).toBe('Longitude must be from 180°W to 180°E.');
  });

  it('normalizes longitude 180 to -180 so one place has one id', () => {
    const east = validateCoordinates('-85', '180');
    const west = validateCoordinates('-85', '-180');
    expect(east).toEqual({ lat: -85, lon: -180 });
    expect(west).toEqual({ lat: -85, lon: -180 });
    expect(customSiteId(-85, (east as { lon: number }).lon)).toBe(customSiteId(-85, -180));
  });
});

describe('custom site ids', () => {
  it('round-trips through parseCustomSite', () => {
    const id = customSiteId(-85.123456, -179.5);
    expect(parseCustomSite(id)).toEqual({ lat: -85.123456, lon: -179.5 });
  });

  it('rejects malformed ids and out-of-range coordinates', () => {
    expect(parseCustomSite('demo-ridge-a')).toBeNull();
    expect(parseCustomSite(customSiteId(-85, 200))).toBeNull();
  });
});

it('keeps the comparison limit at four sites', () => {
  expect(MAX_SELECTED_SITES).toBe(4);
});
