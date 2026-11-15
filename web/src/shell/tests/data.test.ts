import { readFileSync, mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { expect, it } from 'vitest';
import { parseEphem, parseMask, parseMetrics, parseSites } from '../validation';
import { loadDemoData } from '../data';
import { MOCK_PARAMS, site_metrics, UnavailableScenario } from '../../engine';
import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import common from '../../../../contracts/schemas/common.schema.json';
import gridSchema from '../../../../contracts/schemas/grid.schema.json';
const root = resolve('public/data/mock');
const json = (path: string) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const bytes = (path: string) => new Uint8Array(readFileSync(join(root, path))).buffer;
const request: typeof fetch = async input => new Response(readFileSync(join(resolve('public/data'), String(input).replace('/data/', ''))));
it('loads the real ephemeris and masks plus the synthetic demo fixtures through the actual loader and adapter', async () => {
  const data = await loadDemoData(new AbortController().signal, request);
  const mask = data.masks.get('demo-ridge-a')!;
  const metrics = site_metrics(mask, data.table, '2026-11-14T12:00:00.000Z', 336, MOCK_PARAMS);
  expect(metrics.pct_lit).toBe(82); expect(data.table.rows.length).toBe(43_824 * 6);
  expect([...data.masks.keys()].filter(id => !id.startsWith('demo-')).sort()).toEqual(['connecting-ridge', 'haworth', 'malapert-massif']);
  metrics.pct_lit = 0;
  expect(site_metrics(mask, data.table, '2026-11-14T12:00:00.000Z', 336, MOCK_PARAMS).pct_lit).toBe(82);
  expect(() => site_metrics(mask, data.table, '2030-01-01T00:00:00Z', 336, MOCK_PARAMS)).toThrow(UnavailableScenario);
  expect(() => site_metrics(mask, data.table, '2026-11-14T12:00:00.000Z', 24, MOCK_PARAMS)).toThrow(UnavailableScenario);
  expect(() => parseMetrics({ ...metrics, t_min_k: 300, t_max_k: 200 }, 336)).toThrow();
  expect(() => parseMetrics({ ...metrics, longest_dark_h: 400 }, 336)).toThrow();
});
it('rejects corrupt catalogue, mask geometry, ephemeris length and NaNs', () => {
  const sites = json('sites.json');
  expect(() => parseSites([sites[0], sites[0]])).toThrow();
  expect(() => parseSites([{ ...sites[0], lon: 180 }])).toThrow();
  const mask = json('masks/demo-ridge-a.json');
  expect(() => parseMask({ ...mask, mask_deg: [0] }, mask.id)).toThrow();
  expect(() => parseMask({ ...mask, mask_deg: Array(360).fill(NaN) }, mask.id)).toThrow();
  expect(() => parseMask(mask, 'different')).toThrow();
  const header = json('ephem.json');
  expect(() => parseEphem(header, new ArrayBuffer(8))).toThrow();
  const corrupted = bytes('ephem.bin'); new DataView(corrupted).setFloat32(0, NaN, true);
  expect(() => parseEphem(header, corrupted)).toThrow();
  const angle = bytes('ephem.bin'); new DataView(angle).setFloat32(4, 180, true);
  expect(() => parseEphem(header, angle)).toThrow();
  expect(() => parseEphem({ ...header, fields: [...header.fields].reverse() }, bytes('ephem.bin'))).toThrow();
});
it('surfaces HTTP failures and mismatched site/mask coordinates', async () => {
  await expect(loadDemoData(new AbortController().signal, async () => new Response('', { status: 503 }))).rejects.toThrow('503');
  const mismatch: typeof fetch = async input => String(input).endsWith('demo-ridge-a.json') ? Response.json({ ...json('masks/demo-ridge-a.json'), lat: -80 }) : request(input);
  await expect(loadDemoData(new AbortController().signal, mismatch)).rejects.toThrow('disagree');
});
it('ships the proposed grid mask format and generates fixtures reproducibly', () => {
  const ajv = new Ajv2020({ strict: false }); addFormats(ajv); ajv.addSchema(common);
  const grid = json('grid/demo.json'); expect(ajv.validate(gridSchema, grid)).toBe(true);
  expect(bytes('grid/demo.bin').byteLength).toBe(grid.layer_info.mask.byte_length);
  const output = mkdtempSync(join(tmpdir(), 'lunar-mocks-'));
  try {
    execFileSync(process.execPath, ['--input-type=module', '-e', `import {generateMocks} from ${JSON.stringify(new URL('../../../scripts/generate-mocks.mjs', import.meta.url).href)}; generateMocks(${JSON.stringify(output)})`]);
    for (const file of readdirSync(root, { recursive: true }).filter(name => /\.(json|bin)$/.test(String(name)))) {
      const digest = (base: string) => createHash('sha256').update(readFileSync(join(base, String(file)))).digest('hex');
      expect(digest(output), String(file)).toBe(digest(root));
    }
  } finally { rmSync(output, { recursive: true, force: true }); }
});
