import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { beforeAll, describe, expect, it } from 'vitest';
import { initEngine } from '../../engine';
import { decodeFracs, bakedFile } from '../heatmap/baked';
import { parseGrid } from '../heatmap/grid';
import { gridFactors } from '../heatmap/score';
import { shownLayer } from '../heatmap/HoloStage';
import { weakestFactor } from '../analysis/AnalysisPanel';
import { rankedCsv } from './PrioritiesPanel';
import { engineResult, useRegionResults, ZERO_WEIGHTS, type RegionResult } from './useMissionData';

const file = (p: string) => readFileSync(new URL(`../../../public/data/${p}`, import.meta.url));
const bin = file('grid/haworth.bin');
const grid = parseGrid(JSON.parse(file('grid/haworth.json').toString('utf8')), bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength), 'haworth');
const START = '2027-01-15T00:00:00.000Z';
const weights = { sun: 35, earth: 25, slope: 20, crater: 10, rock: 10, thermal: 10 };

beforeAll(() => initEngine(readFileSync(new URL('../../engine/pkg/lunar_engine_bg.wasm', import.meta.url))));

describe('heat layer requests', () => {
  it('a repeated pick of the same heat re-settles it; nothing new keeps the shown layer', () => {
    expect(shownLayer({ heat: 'score', pick: 0 }, { heat: 'score', pick: 0 }, null)).toBeNull();
    expect(shownLayer({ heat: 'score', pick: 0 }, { heat: 'score', pick: 1 }, null)).toBe('score');
    expect(shownLayer({ heat: 'score', pick: 3 }, { heat: 'sun', pick: 3 }, 'score')).toBe('sun');
    expect(shownLayer({ heat: 'sun', pick: 3 }, { heat: 'sun', pick: 3 }, 'slope')).toBe('slope');
  });
});

describe('area breakdown', () => {
  it('weakest check covers rock, and thermal only on engine results', () => {
    const f = { sun: 0.9, earth: 0.8, slope: 0.7, crater: 0.6, rock: 0.5, thermal: 0.1 };
    expect(weakestFactor(f, true)).toEqual(['warmth', 0.1]);
    expect(weakestFactor(f, false)).toEqual(['smooth ground', 0.5]);
    expect(weakestFactor({ ...f, rock: NaN }, false)[0]).toBe('shallow terrain');
  });

  it('CSV carries rock_factor and thermal_factor from the real engine areas', () => {
    const fracs = decodeFracs(new Uint8Array(file(`baked/${bakedFile('haworth', START)}`)), grid.header.nx * grid.header.ny);
    const r = engineResult(grid, gridFactors(grid), fracs, weights, 10, 'baked');
    const [head, first] = rankedCsv({ haworth: r }, { date: START, delay: 0, hours: 336, weights, ice: 0, slopeLimit: 10 }).split('\n').map(l => l.split(','));
    expect(first[head.indexOf('rock_factor')]).toBe(r.areas[0].factors.rock.toFixed(3));
    expect(first[head.indexOf('thermal_factor')]).toBe(r.areas[0].factors.thermal.toFixed(3));
  });
});

describe('region results', () => {
  const run = (w: typeof weights, ice: number) => {
    let out: Partial<Record<'haworth', RegionResult>> = {};
    const Probe = () => { out = useRegionResults({ haworth: grid }, { weights: w, ice, slopeLimit: 10, date: START, hours: 336, delay: 0, survivalK: 233 }); return null; };
    renderToString(createElement(Probe));
    return out.haworth!;
  };
  it('all six engine weights at 0 rank nothing, even with ice > 0 (no ice-only preview)', () => {
    const zero = run({ sun: 0, earth: 0, slope: 0, crater: 0, rock: 0, thermal: 0 }, 40);
    expect(zero.areas).toEqual([]);
    expect(zero.error).toBe(ZERO_WEIGHTS);
    expect(run(weights, 40).areas.length).toBeGreaterThan(0);
  });
});
