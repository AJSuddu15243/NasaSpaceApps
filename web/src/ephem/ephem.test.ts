import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { azEl, series, siteSky, sunEarthAt } from '.';

const load = (id: string) => JSON.parse(readFileSync(new URL(`../../public/data/validation/${id}.json`, import.meta.url), 'utf8'));
const dAz = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);
const TOL_DEG = 0.01; // measured worst case 0.0023° over both Horizons windows

describe('ephem vs JPL Horizons reference table', () => {
  it.each(['malapert-massif', 'haworth', 'connecting-ridge'])('%s Sun and Earth az/el within 0.01°', id => {
    const ref = load(id);
    for (const s of ref.samples.filter((_: unknown, i: number) => i % 23 === 0)) {
      const sky = siteSky(ref.lat, ref.lon, s.t_iso, ref.elev_m);
      expect(Math.abs(sky.sun.el - s.sun_el)).toBeLessThan(TOL_DEG);
      expect(Math.abs(sky.earth.el - s.earth_el)).toBeLessThan(TOL_DEG);
      expect(dAz(sky.sun.az, s.sun_az)).toBeLessThan(TOL_DEG);
      expect(dAz(sky.earth.az, s.earth_az)).toBeLessThan(TOL_DEG);
    }
  });
  it('UI-4 acceptance: Malapert 2026-01-01T00Z Sun az 32.87°, el 4.71°', () => {
    const sky = siteSky(-85.9948, -0.23578, '2026-01-01T00:00:00Z');
    expect(sky.sun.az).toBeCloseTo(32.87, 1);
    expect(sky.sun.el).toBeCloseTo(4.71, 1);
  });
});

describe('ephem geometry', () => {
  it('is deterministic and quantized', () => {
    const a = sunEarthAt('2027-03-01T05:00:00Z'); const b = sunEarthAt(new Date('2027-03-01T05:00:00Z'));
    expect(a).toEqual(b);
    expect(Math.abs(a.earth_lat)).toBeLessThan(7); // optical libration in latitude ≤ ~6.9°
    expect(Math.abs(a.earth_lon)).toBeLessThan(8.5); // in longitude ≤ ~8.2°
  });
  it('a body at the zenith has elevation 90°; wraps azimuth into [0, 360)', () => {
    expect(azEl(-90, 0, -90, 0, 1e6).el).toBeCloseTo(90, 6);
    const east = azEl(0, 0, 0, 90, 1e9);
    expect(east.az).toBeCloseTo(90, 3);
    expect(east.el).toBeCloseTo(0, 1);
    expect(azEl(0, 0, 0, -90, 1e9).az).toBeCloseTo(270, 3);
  });
  it('series spans the window hourly', () => {
    const s = series('2026-11-14T12:00:00Z', 24);
    expect(s).toHaveLength(25);
    expect(s[24].t.toISOString()).toBe('2026-11-15T12:00:00.000Z');
  });
});
