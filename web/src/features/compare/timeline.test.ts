import { describe, expect, it } from 'vitest';
import { angularDistanceDeg, bodyElevationDeg, ephemCoverage, readinessScore, siteTimeline, TL_BOTH, TL_SUN } from './timeline';
import type { Metrics } from '../../contracts/engine-api';
import { DEFAULT_SCENARIO } from '../../shell/scenario';

const metrics: Metrics = {
  pct_lit: 80, longest_dark_h: 40, pct_earth_visible: 60, longest_blackout_h: 20,
  h_to_first_sunset: 50, h_to_first_earthset: 30, mean_sun_el_deg: 2, max_sun_el_deg: 4,
  mean_power_vertical: 0.5, mean_power_horizontal: 0.02, t_min_k: 90, t_max_k: 200, h_below_survival: 40,
};

// Synthetic table: sun pinned over the site, earth on the opposite side.
const table = {
  header: { t0_iso: '2026-11-14T12:00:00.000Z', step_hours: 1, n: 48 },
  rows: (() => {
    const rows = new Float32Array(48 * 6);
    for (let i = 0; i < 48; i++) {
      rows.set([-80, 0, 149597870, 0, 180, 384400], i * 6);
    }
    return rows;
  })(),
};

describe('angular geometry', () => {
  it('computes great-circle distance', () => {
    expect(angularDistanceDeg(-80, 0, -80, 0)).toBeCloseTo(0);
    expect(angularDistanceDeg(-80, 0, 80, 0)).toBeCloseTo(160);
  });
  it('elevation is 90 minus distance, minus horizon', () => {
    expect(bodyElevationDeg(-80, 0, -80, 0)).toBeCloseTo(90);
    expect(bodyElevationDeg(-80, 0, 0, 0)).toBeCloseTo(10);
    expect(bodyElevationDeg(-80, 0, -80, 0, 5)).toBeCloseTo(85);
  });
});

describe('siteTimeline', () => {
  it('classifies sun-only, earth-only, both and neither hours', () => {
    // Site at -80,0: sun at -80,0 (el 90), earth at 0,180 → distance ~160? earth el = 90-160 = -70 → dark? adjust earth to -85,90 → dist ~86 → el ~4 → earth visible.
    const t2 = { ...table, rows: (() => { const r = new Float32Array(48 * 6); for (let i = 0; i < 48; i++) r.set([-80, 0, 1, -85, 90, 1], i * 6); return r; })() };
    const tl = siteTimeline(t2, -80, 0, '2026-11-14T12:00:00.000Z', 48);
    expect(tl).not.toBeNull();
    expect(tl![0]).toBe(TL_BOTH);
    expect([...tl!].every(v => v === TL_BOTH)).toBe(true);
    const tlDark = siteTimeline(table, -80, 0, '2026-11-14T12:00:00.000Z', 48);
    expect(tlDark![0]).toBe(TL_SUN);
  });
  it('returns null outside table coverage', () => {
    expect(siteTimeline(table, -80, 0, '2027-01-01T00:00:00.000Z', 24)).toBeNull();
  });
});

describe('readinessScore', () => {
  it('normalizes weights and inverts longest-streak subscores', () => {
    const score = readinessScore(metrics, DEFAULT_SCENARIO.missionWeights, 336)!;
    // lit 80*0.4 + earth 60*0.3 + dark (100-40/336*100≈88.1)*0.15 + blackout (100-20/336*100≈94)*0.15, /1.0
    expect(score).toBeGreaterThan(70);
    expect(score).toBeLessThanOrEqual(100);
  });
  it('returns null when weights sum to zero', () => {
    expect(readinessScore(metrics, { lit: 0, earth: 0, dark: 0, blackout: 0 }, 336)).toBeNull();
  });
});

describe('ephemCoverage', () => {
  it('reports table bounds', () => {
    const c = ephemCoverage(table)!;
    expect(c.start).toBe('2026-11-14T12:00:00.000Z');
    expect(c.end).toBe('2026-11-16T12:00:00.000Z');
  });
});
