import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { copyOpacity, DIVE, illustrativeDate, KEYS, lonLatToVec, polarStereo, sampleStage, SITES } from './story';

describe('landing stage keys', () => {
  it('lands exactly on each chapter key and stays finite between them', () => {
    KEYS.forEach((key, i) => expect(sampleStage(i)).toEqual(key));
    for (let c = 0; c <= KEYS.length - 1; c += 0.13) {
      const s = sampleStage(c);
      for (const v of [s.tilt, ...s.camera, ...s.target, s.sunLon, s.sites, s.earth]) expect(Number.isFinite(v)).toBe(true);
    }
    expect(() => sampleStage(Number.NaN)).toThrow(RangeError);
  });

  it('never puts the camera inside the Moon', () => {
    for (let c = 0; c <= KEYS.length - 1; c += 0.01) {
      const [x, y, z] = sampleStage(c).camera;
      expect(Math.hypot(x, y, z)).toBeGreaterThan(1.05);
    }
    expect(Math.hypot(...DIVE.camera)).toBeGreaterThan(1.05);
  });

  it('reduced motion snaps to whole chapters', () => {
    expect(sampleStage(2.4, true)).toEqual(KEYS[2]);
    expect(sampleStage(2.6, true)).toEqual(KEYS[3]);
  });

  it('shows one chapter of copy at a time', () => {
    expect(copyOpacity(3, 3)).toBe(1);
    expect(copyOpacity(3, 4)).toBe(0);
    expect(copyOpacity(3, 3.6)).toBeLessThan(0.5);
  });
});

describe('Moon-fixed frame', () => {
  it('maps the south pole to -y and 0°E to +x', () => {
    const pole = lonLatToVec(-90, 0);
    expect(pole[1]).toBeCloseTo(-1);
    expect(lonLatToVec(0, 0)).toEqual([1, 0, -0]);
    expect(lonLatToVec(0, 90)[2]).toBeCloseTo(-1);
  });

  it('uses the pipeline region centres, all inside the 80° S terrain cap', () => {
    const config = readFileSync(new URL('../../../pipeline/config.yaml', import.meta.url), 'utf8');
    for (const site of SITES) {
      expect(config).toContain(`${site.id}:`);
      expect(config).toContain(`lat: ${site.lat}`);
      expect(site.lat).toBeLessThan(-80);
    }
  });

  it('matches the PIPE-3 grid coordinates the cap texture is sampled with', () => {
    // Measured through the real file's CRS in pipeline/notes/pipe-3.md.
    const expected: Record<string, [number, number]> = { 'connecting-ridge': [-10999, -11999], haworth: [-38000, 90501], 'malapert-massif': [-500, 121500] };
    for (const site of SITES) {
      const [x, y] = polarStereo(site.lat, site.lon);
      expect(Math.abs(x - expected[site.id][0])).toBeLessThan(15);
      expect(Math.abs(y - expected[site.id][1])).toBeLessThan(15);
    }
    expect(polarStereo(-80, 0)[1]).toBeCloseTo(304000, -2);
  });

  it('advances the illustrative date by one synodic month per Sun turn', () => {
    const a = illustrativeDate(KEYS[1].sunLon).getTime();
    const b = illustrativeDate(KEYS[1].sunLon + 360).getTime();
    expect((b - a) / 86_400_000).toBeCloseTo(29.53);
  });
});

describe('landing copy', () => {
  const source = readFileSync(new URL('./LandingPage.tsx', import.meta.url), 'utf8');
  it('keeps banned marketing words and unverified claims out', () => {
    for (const word of ['seamless', 'revolutionize', 'unlock', 'cutting-edge', 'harness', 'leverage', 'empower', 'game-changer', 'delve']) {
      expect(source.toLowerCase()).not.toContain(word);
    }
    expect(source).toContain('In progress');
    expect(source).toContain('not a mission recommendation');
    expect(source).toContain('Illustrative lighting');
  });
});
