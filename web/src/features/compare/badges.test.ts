// Demo story on the real WASM engine: default scenario thresholds + real site params give 2 green / 1 red on time,
// and a one-week slip turns every card red (Earth contact collapses).
import { readFileSync } from 'node:fs';
import { beforeAll, expect, it } from 'vitest';
import { initEngine, metricsHash, site_metrics, siteParams } from '../../engine';
import { siteResults } from '../../shell/components/ResultsPanel';
import type { DemoData } from '../../shell/data';
import { DEFAULT_SCENARIO } from '../../shell/scenario';
import { scenarioInstant } from '../timeline/MissionTimeline';
import { DEFAULT_THRESHOLDS, siteStatus } from './metrics';
import type { EphemHeader } from '../../contracts/ephem';
import type { SiteMask } from '../../contracts/site-mask';

const data = (p: string) => new URL(`../../../public/data/${p}`, import.meta.url);
const header = JSON.parse(readFileSync(data('ephem.json'), 'utf8')) as EphemHeader;
const bin = readFileSync(data('ephem.bin'));
const table = { header, rows: new Float32Array(bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength)) };
const mask = (id: string) => JSON.parse(readFileSync(data(`masks/${id}.json`), 'utf8')) as SiteMask;

beforeAll(() => initEngine(readFileSync(new URL('../../engine/pkg/lunar_engine_bg.wasm', import.meta.url))));

function badges(delay: number) {
  const start = scenarioInstant({ date: DEFAULT_SCENARIO.date, delay });
  const metrics = DEFAULT_SCENARIO.sites.map(id => site_metrics(mask(id), table, start, DEFAULT_SCENARIO.hours, siteParams(DEFAULT_SCENARIO)));
  return { status: Object.fromEntries(DEFAULT_SCENARIO.sites.map((id, i) => [id, siteStatus(metrics[i], DEFAULT_THRESHOLDS).status])), hash: metricsHash(metrics) };
}

it('default scenario: connecting-ridge and malapert green, haworth red; +7 d all red', () => {
  expect(DEFAULT_SCENARIO.date).toBe('2027-01-15T00:00:00.000Z');
  expect(DEFAULT_SCENARIO.hours).toBe(336);
  const onTime = badges(0);
  expect(onTime.status).toEqual({ 'connecting-ridge': 'green', haworth: 'red', 'malapert-massif': 'green' });
  expect(onTime.hash).toMatch(/^[0-9a-f]{16}$/);
  const slipped = badges(7);
  expect(slipped.status).toEqual({ 'connecting-ridge': 'red', haworth: 'red', 'malapert-massif': 'red' });
  expect(slipped.hash).not.toBe(onTime.hash);
});

it('ResultsPanel applies the slip once: cards score date + delay, the baseline is the on-time date', () => {
  const masks = new Map(DEFAULT_SCENARIO.sites.map(id => [id, mask(id)]));
  const sites = [...masks.values()].map(m => ({ id: m.id, name: m.id, lat: m.lat, lon: m.lon }));
  const data = { sites, masks, table } as unknown as DemoData;
  const onTime = siteResults(data, DEFAULT_SCENARIO);
  expect(onTime.start).toBe(DEFAULT_SCENARIO.date);
  expect(onTime.results.every(r => r.baseline === null)).toBe(true);
  const slipped = siteResults(data, { ...DEFAULT_SCENARIO, delay: 7 });
  expect(slipped.start).toBe('2027-01-22T00:00:00.000Z');
  expect(slipped.results.map(r => r.baseline)).toEqual(onTime.results.map(r => r.metrics));
  expect(slipped.results.map(r => siteStatus(r.metrics!, DEFAULT_THRESHOLDS).status)).toEqual(['red', 'red', 'red']);
  // Navigator must hand ResultsPanel the on-time scenario; a pre-slipped date would score +14 d.
  const nav = readFileSync(new URL('../../shell/Navigator.tsx', import.meta.url), 'utf8');
  expect(nav).toMatch(/<ResultsPanel data=\{engineData\} scenario=\{scenario\} regions=\{results\} \/>/);
});
