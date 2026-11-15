import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { loadAnalysis, parseReference, parseTerrain, referenceWindow, wireframe } from './data';
import type { TileHeader } from '../../contracts/tile';
import type { ValidationSet } from '../../contracts/validation';
const root = new URL('../../../public/data/', import.meta.url);
const header = JSON.parse(readFileSync(new URL('tiles/malapert-massif_80m.json', root), 'utf8')) as TileHeader;
const reference = JSON.parse(readFileSync(new URL('validation/malapert-massif.json', root), 'utf8')) as ValidationSet;
const binary = readFileSync(new URL('tiles/malapert-massif_80m.bin', root));
const bytes = binary.buffer.slice(binary.byteOffset, binary.byteOffset + binary.byteLength) as ArrayBuffer;

describe('terrain boundary attacks', () => {
  it('rejects another region even when dimensions and bytes are valid', () => {
    expect(() => parseTerrain(header, bytes, 'haworth')).toThrow(/region/);
  });
  it('rejects truncated binaries and non-finite heights instead of showing a plausible surface', () => {
    expect(() => parseTerrain(header, bytes.slice(4), header.region)).toThrow();
    const corrupt = bytes.slice(0); new DataView(corrupt).setFloat32(0, NaN, true);
    expect(() => parseTerrain(header, corrupt, header.region)).toThrow(/non-finite/);
  });
  it('retains the far edge and peak on a display grid rather than sampling the first rows', () => {
    const tile = parseTerrain({ ...header, nx: 2, ny: 2 }, new Float32Array([0, 0, 0, 100]).buffer, header.region);
    expect(wireframe(tile).some(path => path.includes('405.0,20.0'))).toBe(true);
    expect(tile.max).toBe(100);
  });
});
describe('reference coverage attacks', () => {
  it('does not use January samples for November or bridge a multi-year gap', () => {
    const data = parseReference(reference, 'malapert-massif');
    expect(referenceWindow(data, '2026-11-14T12:00:00Z')).toEqual([]);
    const window = referenceWindow(data, '2026-01-30T23:30:00Z');
    expect(window).toHaveLength(1);
    expect(window[0].t_iso).toContain('2026-01-30');
  });
  it('rejects duplicate or reversed timestamps and mismatched site identity', () => {
    expect(() => parseReference({ ...reference, samples: [reference.samples[0], reference.samples[0]] }, reference.site_id)).toThrow(/increasing/);
    expect(() => parseReference({ ...reference, samples: [reference.samples[1], reference.samples[0]] }, reference.site_id)).toThrow(/increasing/);
    expect(() => parseReference(reference, 'haworth')).toThrow(/another site/);
  });
  it('shows the actual first Malapert sample rather than fabricated geometry', () => {
    const window = referenceWindow(reference, '2026-01-01T00:00:00Z');
    expect(window[0].sun_az).toBeCloseTo(32.87, 2);
    expect(window[0].sun_el).toBeCloseTo(4.71, 2);
  });
});
// Gap analysis: a parser can reject NaN yet render nodata, trust enormous allocations,
// or use a broad min/max timestamp check that treats the absent years as coverage.
describe('gap-closing tests', () => {
  it('rejects finite nodata and oversized header allocations', () => {
    const copy = bytes.slice(0); new DataView(copy).setFloat32(0, -9999, true);
    expect(() => parseTerrain({ ...header, nodata: -9999 }, copy, header.region)).toThrow(/missing/);
    expect(() => parseTerrain({ ...header, nx: 100000, ny: 100000 }, bytes, header.region)).toThrow();
  });
  it('does not request arbitrary paths for custom coordinates', async () => {
    const fetcher = vi.fn();
    await expect(loadAnalysis('../malapert-massif', new AbortController().signal, fetcher)).rejects.toThrow(/coverage/);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('forwards cancellation to every source request', async () => {
    const controller = new AbortController();
    const fetcher = vi.fn(async () => new Response('', { status: 503 }));
    await expect(loadAnalysis('haworth', controller.signal, fetcher)).rejects.toThrow(/503/);
    expect(fetcher).toHaveBeenCalledTimes(3);
    for (const call of fetcher.mock.calls as unknown[][]) expect(call[1]).toEqual({ signal: controller.signal });
  });
  it('does not clamp before coverage or after the final sample interval', () => {
    expect(referenceWindow(reference, '2025-12-31T23:59:59Z')).toEqual([]);
    const end = Date.parse(reference.samples.at(-1)!.t_iso);
    expect(referenceWindow(reference, new Date(end + 3600000).toISOString())).toEqual([]);
    expect(referenceWindow(reference, 'invalid')).toEqual([]);
  });
});
