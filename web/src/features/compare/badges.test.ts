// Demo story on the real WASM engine: default scenario thresholds + real site params give 2 green / 1 red on time,
// and a one-week slip turns every card red (Earth contact collapses).
import { readFileSync } from 'node:fs';
import { beforeAll, expect, it } from 'vitest';
import { initEngine, metricsHash, site_metrics, siteParams } from '../../engine';
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
  console.info(`delay ${delay} d`, DEFAULT_SCENARIO.sites.map((id, i) => {
    const m = metrics[i];
    return `${id}: lit ${m.pct_lit.toFixed(1)}% earth ${m.pct_earth_visible.toFixed(1)}% dark ${m.longest_dark_h} h blackout ${m.longest_blackout_h} h`;
  }));
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
