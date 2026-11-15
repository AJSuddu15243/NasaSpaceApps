import { describe, expect, it } from 'vitest';
import { ephemAt } from './ephem';
import type { EphemHeader } from '../../contracts/ephem';

const header: EphemHeader = {
  schema_version: 1,
  generated_at: '2026-11-14T12:00:00Z',
  source_urls: ['https://example.test'],
  t0_iso: '2026-11-14T12:00:00.000Z',
  step_hours: 1,
  n: 3,
  fields: ['sun_lat', 'sun_lon', 'sun_dist_km', 'earth_lat', 'earth_lon', 'earth_dist_km'],
  dtype: 'float32',
};

// rows: [sun_lat, sun_lon, sun_dist, earth_lat, earth_lon, earth_dist]; lons stay in [-180, 180)
const rows = new Float32Array([
  0, 10, 149e6, 1, 20, 384e3,
  2, -160, 149e6, 3, -170, 384e3, // both longitudes cross the antimeridian
  4, -10, 149e6, 5, 150, 384e3,
]);

const table = { header, rows };

describe('ephemAt', () => {
  it('returns the exact row at t0', () => {
    const s = ephemAt(table, '2026-11-14T12:00:00.000Z');
    expect(s).toMatchObject({ sunLat: 0, sunLon: 10, earthLat: 1, earthLon: 20 });
  });

  it('interpolates halfway between rows', () => {
    const s = ephemAt(table, '2026-11-14T12:30:00.000Z');
    expect(s?.sunLat).toBeCloseTo(1);
    expect(s?.earthLat).toBeCloseTo(2);
    expect(s?.sunDistKm).toBeCloseTo(149e6);
  });

  it('interpolates longitude across the antimeridian the short way', () => {
    const s = ephemAt(table, '2026-11-14T12:30:00.000Z');
    // 10 -> -160 short way passes through 0/-90, not the long way through 180
    expect(s!.sunLon).toBeCloseTo(-75);
    // 20 -> -170 short way goes east through 180, landing near 105
    expect(s!.earthLon).toBeCloseTo(105);
  });

  it('returns null outside the table range instead of clamping', () => {
    expect(ephemAt(table, '2026-11-14T11:59:00.000Z')).toBeNull();
    expect(ephemAt(table, '2026-11-14T14:01:00.000Z')).toBeNull();
    expect(ephemAt(table, '2026-11-14T14:00:00.000Z')?.sunLat).toBe(4);
  });

  it('returns null for unparseable input', () => {
    expect(ephemAt(table, 'not-a-date')).toBeNull();
  });
});
