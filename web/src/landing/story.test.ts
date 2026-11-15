import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { copyOpacity, DIVE, KEYS, lonLatToVec, polarStereo, sampleStage, SITES, STAGE_EPOCH_MS, stageDate } from './story';
import { DEFAULT_SCENARIO } from '../shell/scenario';

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

  it('starts the stage date at the navigator default and advances one synodic month per Sun turn', () => {
    expect(new Date(STAGE_EPOCH_MS).toISOString()).toBe(DEFAULT_SCENARIO.date);
    expect(stageDate(KEYS[0].sunLon).getTime()).toBe(STAGE_EPOCH_MS);
    const a = stageDate(KEYS[1].sunLon).getTime();
    const b = stageDate(KEYS[1].sunLon + 360).getTime();
    expect(a).toBe(STAGE_EPOCH_MS);
    expect((b - a) / 86_400_000).toBeCloseTo(29.53);
  });

  it('uses sites.json names and the rounded mask elevations', () => {
    const sites = JSON.parse(readFileSync(new URL('../../public/data/sites.json', import.meta.url), 'utf8')) as { id: string; name: string; lat: number; lon: number }[];
    for (const site of SITES) {
      const real = sites.find(s => s.id === site.id)!;
      expect([real.name, real.lat, real.lon]).toEqual([site.name, site.lat, site.lon]);
      const mask = JSON.parse(readFileSync(new URL(`../../public/data/masks/${site.id}.json`, import.meta.url), 'utf8')) as { elev_m: number };
      expect(Math.round(mask.elev_m)).toBe(site.elevation_m);
    }
  });
});

describe('landing copy', () => {
  const source = readFileSync(new URL('./LandingPage.tsx', import.meta.url), 'utf8');
  it('keeps banned marketing words and unverified claims out', () => {
    for (const word of ['seamless', 'revolutionize', 'unlock', 'cutting-edge', 'harness', 'leverage', 'empower', 'game-changer', 'delve']) {
      expect(source.toLowerCase()).not.toContain(word);
    }
    expect(source).not.toContain('In progress');
    expect(source).toContain('not a mission recommendation');
    expect(source).toContain('Astronomy Engine');
  });
});
