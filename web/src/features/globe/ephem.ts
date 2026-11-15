import type { EphemHeader } from '../../contracts/ephem';

export interface EphemSample {
  sunLat: number;
  sunLon: number;
  sunDistKm: number;
  earthLat: number;
  earthLon: number;
  earthDistKm: number;
}

interface EphemTable {
  header: EphemHeader;
  rows: Float32Array;
}

const wrapDelta = (from: number, to: number) => ((to - from + 540) % 360) - 180;

/** Interpolates the hourly sub-solar / sub-Earth table at an ISO instant; null outside the table range. */
export function ephemAt(table: EphemTable, iso: string): EphemSample | null {
  const { header, rows } = table;
  const t0 = Date.parse(header.t0_iso);
  const t = Date.parse(iso);
  if (!Number.isFinite(t0) || !Number.isFinite(t) || header.n < 1 || rows.length < 6) return null;

  const stepMs = header.step_hours * 3_600_000;
  const pos = (t - t0) / stepMs;
  if (pos < 0 || pos > header.n - 1) return null;
  const i0 = Math.floor(pos);
  const i1 = Math.min(i0 + 1, header.n - 1);
  const f = pos - i0;
  const a = i0 * 6;
  const b = i1 * 6;

  const lerp = (col: number) => rows[a + col] + (rows[b + col] - rows[a + col]) * f;
  const lerpLon = (col: number) => {
    const from = rows[a + col];
    const to = rows[a + col] + wrapDelta(rows[a + col], rows[b + col]);
    return from + (to - from) * f;
  };

  return {
    sunLat: lerp(0),
    sunLon: lerpLon(1),
    sunDistKm: lerp(2),
    earthLat: lerp(3),
    earthLon: lerpLon(4),
    earthDistKm: lerp(5),
  };
}
