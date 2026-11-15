import { describe, expect, it } from 'vitest';
import type { Metrics } from '../../contracts/engine-api';
import { DEFAULT_THRESHOLDS, bestValues, countdown, metricValue, siteStatus, type MetricKey } from './metrics';

function makeMetrics(overrides: Partial<Metrics> = {}): Metrics {
  return {
    pct_lit: 80, longest_dark_h: 24, pct_earth_visible: 70, longest_blackout_h: 12,
    h_to_first_sunset: 100, h_to_first_earthset: 200,
    mean_sun_el_deg: 0.8, max_sun_el_deg: 1.4,
    mean_power_vertical: 0.6, mean_power_horizontal: 0.3,
    t_min_k: 120, t_max_k: 280, h_below_survival: 0,
    ...overrides,
  };
}

describe('mission-planning use cases', () => {
  it('a planner comparing two candidate sites sees the lit and contact winners', () => {
    // Use case: ridge site is sunny but loses Earth contact; shelf site is dimmer but talkative.
    const ridge = makeMetrics({ pct_lit: 88, longest_dark_h: 30, pct_earth_visible: 55, longest_blackout_h: 30 });
    const shelf = makeMetrics({ pct_lit: 74, longest_dark_h: 40, pct_earth_visible: 82, longest_blackout_h: 8 });
    const sites = [ridge, shelf];

    const best = bestValues(sites);
    expect(best.litPercent).toBe(88);
    expect(best.earthContactPercent).toBe(82);
    expect(best.longestDarknessHours).toBe(30);
    expect(best.longestBlackoutHours).toBe(8);

    // The comparison table highlights each column independently — no single "winner" is forced.
    expect(metricValue(ridge, 'litPercent')).toBe(best.litPercent);
    expect(metricValue(shelf, 'earthContactPercent')).toBe(best.earthContactPercent);
  });

  it('flags a site that fails multiple thresholds as red with every reason', () => {
    const bad = makeMetrics({ pct_lit: 30, pct_earth_visible: 30, longest_dark_h: 196, longest_blackout_h: 192 });
    const status = siteStatus(bad, DEFAULT_THRESHOLDS);
    expect(status.status).toBe('red');
    expect(status.reason).toContain('Sunlit time');
    expect(status.reason).toContain('Earth contact');
    expect(status.reason).toContain('Darkness');
    expect(status.reason).toContain('Blackout');
  });

  it('passes a comfortable site green and a borderline site yellow', () => {
    expect(siteStatus(makeMetrics(), DEFAULT_THRESHOLDS).status).toBe('green');
    const borderline = makeMetrics({ pct_earth_visible: 42 }); // above 40% and longest_blackout 12 < 180
    expect(siteStatus(borderline, DEFAULT_THRESHOLDS).status).toBe('green');
    const marginal = makeMetrics({ pct_lit: 71, longest_dark_h: 30 });
    expect(siteStatus(marginal, { ...DEFAULT_THRESHOLDS, minLitPercent: 75 }).status).toBe('yellow');
  });

  it('ignores non-finite metric values when picking bests', () => {
    const broken = makeMetrics({ pct_lit: Number.NaN, longest_blackout_h: Number.POSITIVE_INFINITY });
    const healthy = makeMetrics({ pct_lit: 66 });
    const best = bestValues([broken, healthy]);
    expect(best.litPercent).toBe(66);
    // Infinity is finite? No — POSITIVE_INFINITY is not finite, so blackout falls back to healthy's 12.
    expect(best.longestBlackoutHours).toBe(12);
  });

  it('formats countdowns for mission planning', () => {
    expect(countdown(null)).toBe('No event in window');
    expect(countdown(0)).toBe('Event passed');
    expect(countdown(-5)).toBe('Event passed');
    expect(countdown(5.5)).toBe('5h 30m');
    expect(countdown(30)).toBe('1d 6h 00m');
    expect(countdown(999)).toBe('41d 15h 00m');
  });

  it('exposes every metric key used by the comparison table', () => {
    const keys: MetricKey[] = ['litPercent', 'longestDarknessHours', 'earthContactPercent', 'longestBlackoutHours'];
    const m = makeMetrics();
    for (const key of keys) expect(Number.isFinite(metricValue(m, key))).toBe(true);
  });
});
