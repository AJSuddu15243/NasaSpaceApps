// Compare cards and drawer on the real WASM engine: hourly bar from site_track, readiness from the region's engine
// scores, 64-bin grid masks for points inside a survey.
import { readFileSync } from 'node:fs';
import { beforeAll, expect, it } from 'vitest';
import { GRID_PARAMS, gridFracs, initEngine, scoresFromFracs, site_metrics, siteExtras, siteParams } from '../../engine';
import { trackFor } from '../../engine/track';
import { batteryText, siteResults } from '../../shell/components/ResultsPanel';
import type { DemoData } from '../../shell/data';
import { DEFAULT_SCENARIO } from '../../shell/scenario';
import { cellLatLon, parseGrid } from '../heatmap/grid';
import type { RegionResult } from '../mission/useMissionData';
import { skyNow } from './ScienceCompare';
import { customSiteId } from '../sites/sites';
import { cellIndex, cellReadiness, gridSiteMask, trackTimeline, TL_EARTH, TL_SUN } from './timeline';
import type { EphemHeader } from '../../contracts/ephem';
import type { SiteMask } from '../../contracts/site-mask';

const data = (p: string) => new URL(`../../../public/data/${p}`, import.meta.url);
const bin = readFileSync(data('ephem.bin'));
const table = { header: JSON.parse(readFileSync(data('ephem.json'), 'utf8')) as EphemHeader, rows: new Float32Array(bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength)) };
const mask = (id: string) => JSON.parse(readFileSync(data(`masks/${id}.json`), 'utf8')) as SiteMask;
const gbin = readFileSync(data('grid/haworth.bin'));
const grid = parseGrid(JSON.parse(readFileSync(data('grid/haworth.json'), 'utf8')), gbin.buffer.slice(gbin.byteOffset, gbin.byteOffset + gbin.byteLength), 'haworth');
const START = DEFAULT_SCENARIO.date, HOURS = DEFAULT_SCENARIO.hours;
const params = siteParams(DEFAULT_SCENARIO);
let region: RegionResult;

beforeAll(() => {
  initEngine(readFileSync(new URL('../../engine/pkg/lunar_engine_bg.wasm', import.meta.url)));
  const fracs = gridFracs(grid.bytes!, grid.header, table, START, HOURS, GRID_PARAMS);
  const scores = scoresFromFracs(grid.bytes!, grid.header, fracs, DEFAULT_SCENARIO.weights, GRID_PARAMS);
  region = { grid, scores, areas: [], factors: {} as RegionResult['factors'], source: 'live', fracs } as RegionResult & { fracs: Float32Array };
});

it('hourly bar is the engine track: Earth hours match pct_earth_visible (not the flat-horizon geometry)', () => {
  const m = mask('connecting-ridge');
  const bar = trackTimeline(trackFor(m, table, START, HOURS, params));
  const metrics = site_metrics(m, table, START, HOURS, params);
  const share = (bit: number) => bar.reduce((a, v) => a + (v & bit ? 1 : 0), 0) / HOURS * 100;
  expect(share(TL_EARTH)).toBeCloseTo(metrics.pct_earth_visible, 6);
  expect(Math.abs(share(TL_SUN) - metrics.pct_lit)).toBeLessThan(2); // pct_lit weights partial disks
});

it('grid cell mask decodes to 64 bins and gives the same Earth fraction as grid_fracs for that cell', () => {
  const i = 62 * grid.header.nx + 62;
  const { lat, lon } = cellLatLon(grid.header, i);
  expect(cellIndex(grid, lat, lon)).toBe(i);
  const m = gridSiteMask(grid, 'custom:test', lat, lon)!;
  expect(m.mask_deg).toHaveLength(64);
  expect(m.mask_deg.every(Number.isFinite)).toBe(true);
  expect(m.elev_m).toBe(grid.layers.elev_m![i]);
  const fracs = (region as RegionResult & { fracs: Float32Array }).fracs;
  const metrics = site_metrics(m, table, START, HOURS, GRID_PARAMS);
  expect(metrics.pct_earth_visible / 100).toBeCloseTo(fracs[i * 4 + 1], 2);
  expect(gridSiteMask(grid, 'x', -80.5, 0)).toBeNull();
});

it('readiness is the engine score at the cell (x100); null outside the grid or on the preview', () => {
  const i = 62 * grid.header.nx + 62;
  const { lat, lon } = cellLatLon(grid.header, i);
  const v = cellReadiness(region, lat, lon);
  expect(Number.isFinite(region.scores[i]) ? v : null).toBe(Number.isFinite(region.scores[i]) ? Math.round(region.scores[i] * 1000) / 10 : null);
  expect(cellReadiness({ ...region, source: 'preview' }, lat, lon)).toBeNull();
  expect(cellReadiness(region, -80.5, 0)).toBeNull();
  expect(cellReadiness(undefined, lat, lon)).toBeNull();
});

it('siteResults: haworth readiness from the region, a custom point inside the grid gets engine metrics, outside stays flat', () => {
  const masks = new Map([['haworth', mask('haworth')]]);
  const h = mask('haworth');
  const inside = cellLatLon(grid.header, 40 * grid.header.nx + 70);
  const insideId = customSiteId(inside.lat, inside.lon);
  const d = { sites: [{ id: 'haworth', name: 'Haworth', lat: h.lat, lon: h.lon }], masks, table } as unknown as DemoData;
  const { results } = siteResults(d, { ...DEFAULT_SCENARIO, sites: ['haworth', insideId, customSiteId(-86, 60)] }, { haworth: region });
  const [site, point, outside] = results;
  expect(site.readiness).toBe(cellReadiness(region, h.lat, h.lon));
  expect(site.timelineNote).toBeNull();
  expect(point.metrics).not.toBeNull();
  expect(point.timelineNote).toBe('64-bin grid horizon');
  expect(outside.metrics).toBeNull();
  expect(outside.readiness).toBeNull();
  expect(outside.timelineNote).toBe('flat horizon, geometry only');
});

it('drawer "now" rows: engine track for masked places, flat geometry for demo-* and maskless points', () => {
  const masks = new Map([['haworth', mask('haworth')]]);
  const h = mask('haworth');
  const now = skyNow({ id: 'haworth', name: 'Haworth', lat: h.lat, lon: h.lon }, START, masks, table, params);
  const t = trackFor(h, table, START, 1, params);
  expect(now).toEqual({ sunEl: t.sunEl[0], earthEl: t.earthEl[0], sunLit: t.sunLit[0], earthVis: t.earthVis[0], flat: false });
  expect(skyNow({ id: 'demo-ridge-a', name: 'Demo', lat: h.lat, lon: h.lon }, START, masks, table, params).flat).toBe(true);
  expect(skyNow({ id: 'custom:-86,60', name: 'P', lat: -86, lon: 60 }, START, masks, table, params).flat).toBe(true);
});

it('battery 0 h is the engine gate off (survives_night true), so the card says "battery check off", not a pass', () => {
  const d = { sites: [], masks: new Map([['haworth', mask('haworth')]]), table } as unknown as DemoData;
  const [off] = siteResults(d, { ...DEFAULT_SCENARIO, sites: ['haworth'], batteryH: 0 }).results;
  expect(off.survivesNight).toBe(true);
  expect(batteryText(0, off.survivesNight!)).toBe('battery check off');
  const [on] = siteResults(d, { ...DEFAULT_SCENARIO, sites: ['haworth'], batteryH: 1 }).results;
  expect(batteryText(1, on.survivesNight!)).toBe('battery 1 h (does not outlast the longest darkness)');
});

it('site metrics, extras and track ignore slope_limit_deg (so the cards memo skips slope drags)', () => {
  const m = mask('haworth');
  const p3 = { ...params, slope_limit_deg: 3 }, p20 = { ...params, slope_limit_deg: 20 };
  expect(site_metrics(m, table, START, HOURS, p3)).toEqual(site_metrics(m, table, START, HOURS, p20));
  expect(siteExtras(m, table, START, HOURS, p3)).toEqual(siteExtras(m, table, START, HOURS, p20));
  expect(trackFor(m, table, START, HOURS, p3)).toEqual(trackFor(m, table, START, HOURS, p20));
});
