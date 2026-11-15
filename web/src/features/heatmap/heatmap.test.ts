import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { distanceToPsr, gridFactors, scoreCells, topAreas, type PreviewWeights } from './score';
import { parseGrid, xyToLatLon, type Grid } from './grid';
import { displayRange, dockLayers, isHeatLayer, layerSpec, layerValues, percentile } from './layers';
import { weightShares } from '../mission/PrioritiesPanel';

// Fixtures copied from engine/src/score.rs tests (parity: the preview must match the engine).
const W: PreviewWeights = { sun: 0.35, earth: 0.25, slope: 0.2, crater: 0.1, rock: 0, thermal: 0.1, ice: 0 };
const one = (sun: number, slope: number, rock: number, w = W) => scoreCells({ sun_frac: [sun], earth_frac: [0.5], slope_deg: [slope], crater_depth_m: [25], rock: [rock], cold_frac: [0.2] }, w, 10)[0];

describe('score preview = engine/src/score.rs', () => {
  it('hand computed cell', () => {
    expect(one(1, 5, NaN)).toBeCloseTo(0.35 + 0.25 * 0.5 + 0.2 * 0.5 + 0.1 * 0.5 + 0.1 * 0.8, 6);
  });
  it('slope is a hard limit', () => {
    expect(Number.isFinite(one(1, 10, 0))).toBe(true);
    expect(one(1, 10.1, 0)).toBeNaN();
    expect(one(1, NaN, 0)).toBeNaN();
  });
  it('NaN layer excludes only when weighted', () => {
    expect(Number.isFinite(one(1, 5, NaN))).toBe(true);
    expect(one(1, 5, NaN, { ...W, rock: 0.1 })).toBeNaN();
  });
  it('scaling weights keeps scores', () => {
    const doubled = { sun: 0.7, earth: 0.5, slope: 0.4, crater: 0.2, rock: 0, thermal: 0.2, ice: 0 };
    expect(one(0.7, 3, 0, doubled)).toBeCloseTo(one(0.7, 3, 0), 6);
  });
  it('bad inputs are errors', () => {
    expect(() => one(1, 5, 0, { sun: 0, earth: 0, slope: 0, crater: 0, rock: 0, thermal: 0, ice: 0 })).toThrow();
    expect(() => one(1, 5, 0, { ...W, sun: -1 })).toThrow();
    expect(() => scoreCells({ sun_frac: [1, 1], earth_frac: [0.5], slope_deg: [5], crater_depth_m: [0], rock: [0], cold_frac: [0] }, W, 10)).toThrow();
  });
});

function flatGrid(nx: number, ny: number, cell = 160): Grid {
  const n = nx * ny;
  return { header: { schema_version: 1, generated_at: '2026-11-14T00:00:00Z', source_urls: ['x'], region: 't', crs: 'polar-stereo-south', crs_params: { lat_0: -90, lon_0: 0, radius_m: 1737400 }, x0: 0, y0: 50_000, cell_m: cell, nx, ny, bins: 64, layers: ['slope_deg'], layer_info: {} } as Grid['header'],
    layers: { slope_deg: new Float32Array(n), sun_avg: new Float32Array(n).fill(0.2), earth_avg: new Float32Array(n).fill(0.5), crater_depth_m: new Float32Array(n), rock: new Float32Array(n), psr: new Float32Array(n) } };
}

describe('greedy top-N (GREEDY.md tests 1–3)', () => {
  const w = { ...W, thermal: 0 };
  it('a single bright cell ranks #1 and its neighbours inside the exclusion never appear', () => {
    const g = flatGrid(40, 40); g.layers.sun_avg![20 * 40 + 20] = 1;
    const f = gridFactors(g); const s = scoreCells(f, w, 10);
    const areas = topAreas(g, s, f, 10, 3);
    // the 9 windows covering the bright cell tie; the lowest index wins (deterministic tie-break)
    expect(Math.abs(areas[0].col - 20)).toBeLessThanOrEqual(1); expect(Math.abs(areas[0].row - 20)).toBeLessThanOrEqual(1);
    expect(areas[0].index).toBe(19 * 40 + 19);
    for (const a of areas.slice(1)) expect(Math.hypot(a.x_m - areas[0].x_m, a.y_m - areas[0].y_m)).toBeGreaterThanOrEqual(2000);
  });
  it('a window touching one over-slope cell is invalid', () => {
    const g = flatGrid(40, 40); g.layers.sun_avg![20 * 40 + 20] = 1; g.layers.slope_deg![20 * 40 + 21] = 30;
    const f = gridFactors(g); const areas = topAreas(g, scoreCells(f, w, 10), f, 10, 1);
    expect(areas[0].index).not.toBe(20 * 40 + 20);
    expect(Math.abs(areas[0].col - 21)).toBeGreaterThan(1);
  });
  it('everything too steep → no landable area', () => {
    const g = flatGrid(10, 10); g.layers.slope_deg!.fill(20);
    const f = gridFactors(g); expect(topAreas(g, scoreCells(f, w, 10), f, 10)).toEqual([]);
  });
  it('ice access rewards cells near permanent shadow', () => {
    const psr = new Float32Array(100); psr[0] = 1;
    const d = distanceToPsr(psr, 10, 10, 1000);
    expect(d[0]).toBe(0); expect(d[1]).toBeCloseTo(1); expect(d[11]).toBeCloseTo(Math.SQRT2);
    expect(distanceToPsr(new Float32Array(4), 2, 2, 160)[0]).toBe(Infinity);
  });
});

describe('real grids', () => {
  it.each(['connecting-ridge', 'haworth', 'malapert-massif'])('%s parses with science layers and finite values', region => {
    const header = JSON.parse(readFileSync(new URL(`../../../public/data/grid/${region}.json`, import.meta.url), 'utf8'));
    const bytes = readFileSync(new URL(`../../../public/data/grid/${region}.bin`, import.meta.url));
    const grid = parseGrid(header, bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), region);
    for (const name of ['elev_m', 'slope_deg', 'sun_avg', 'earth_avg', 'psr'] as const) {
      expect(grid.layers[name]?.length).toBe(header.nx * header.ny);
      expect(grid.layers[name]!.every(Number.isFinite)).toBe(true);
    }
    const f = gridFactors(grid); const areas = topAreas(grid, scoreCells(f, { ...W, thermal: 0 }, 10), f, 10, 3);
    expect(areas.length).toBeGreaterThan(0);
    expect(areas[0].lat).toBeLessThan(-85); // south pole region
  });
  it('rejects a grid for another region', () => {
    const header = JSON.parse(readFileSync(new URL('../../../public/data/grid/haworth.json', import.meta.url), 'utf8'));
    expect(() => parseGrid(header, new ArrayBuffer(10), 'malapert-massif')).toThrow();
  });
});

describe('helpers', () => {
  it('xy → lat/lon inverts the pipeline projection', () => {
    expect(xyToLatLon(0, 0).lat).toBeCloseTo(-90);
    const { lat, lon } = xyToLatLon(-47920 + 62 * 160, 80560 + 62 * 160);
    expect(lat).toBeCloseTo(-86.76, 1); expect(lon).toBeCloseTo(-22.8, 0);
  });
  it('display range and percentile ignore NaN', () => {
    const v = Float32Array.from([NaN, 0, 1, 2, 3, 100]);
    expect(displayRange(v)[0]).toBe(0);
    expect(percentile(v, 3)).toBe(60);
  });
});

describe('window vs long-term layers', () => {
  const g = flatGrid(4, 4); const n = 16;
  const window = { sun_frac: new Float32Array(n).fill(0.7), earth_frac: new Float32Array(n).fill(0.4), cold_frac: new Float32Array(n), dark_h: new Float32Array(n) };
  it('sun/earth read the engine window; sun_lt/earth_lt read the 18.6-yr grid layers', () => {
    expect(layerValues(g, 'sun', undefined, window)?.[0]).toBeCloseTo(0.7);
    expect(layerValues(g, 'earth', undefined, window)?.[0]).toBeCloseTo(0.4);
    expect(layerValues(g, 'sun')).toBeUndefined();
    expect(layerValues(g, 'sun_lt', undefined, window)?.[0]).toBeCloseTo(0.2);
    expect(layerValues(g, 'earth_lt')?.[0]).toBeCloseTo(0.5);
    expect(isHeatLayer('sun')).toBe(true); expect(isHeatLayer('sun_lt')).toBe(true);
    expect(layerSpec('sun_lt', 'baked').label).toContain('18.6 yr');
    expect(layerSpec('sun', 'baked').caveat).toContain('Precomputed');
    expect(layerSpec('score', 'live').status).toBe('real');
  });
  it('weight shares count only the factors the shown score uses', () => {
    const w = { sun: 35, earth: 25, slope: 20, crater: 10, rock: 0, thermal: 10 };
    expect(weightShares(w, 40, true)).toMatchObject({ sun: 35, thermal: 10, ice: null });
    expect(weightShares(w, 0, false)).toMatchObject({ sun: 39, thermal: null, ice: 0 });
  });
});

describe('dock order follows the priority weights', () => {
  const w = (sun: number, earth: number, slope: number, crater: number, rock = 0) => ({ sun, earth, slope, crater, rock, thermal: 0 });
  it('defaults: score, sun, earth, terrain, crater, then the unweighted ties in base order, photo last', () => {
    expect(dockLayers(w(35, 25, 20, 10), 0)).toEqual(['score', 'sun', 'sun_lt', 'earth', 'earth_lt', 'terrain', 'crater', 'ice', 'favorability', 'roughness', 'imagery']);
  });
  it('power preset keeps sun first and ties (crater = rock = ice = 0) stable', () => {
    expect(dockLayers(w(80, 10, 10, 0), 0)).toEqual(['score', 'sun', 'sun_lt', 'earth', 'earth_lt', 'terrain', 'crater', 'ice', 'favorability', 'roughness', 'imagery']);
  });
  it('ice preset lifts the ice layers above Earth; heavy rock and slope reorder', () => {
    expect(dockLayers(w(35, 15, 10, 0), 40)).toEqual(['score', 'ice', 'favorability', 'sun', 'sun_lt', 'earth', 'earth_lt', 'terrain', 'crater', 'roughness', 'imagery']);
    expect(dockLayers(w(10, 10, 50, 0, 60), 0).slice(0, 3)).toEqual(['score', 'roughness', 'terrain']);
  });
});
