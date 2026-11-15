import { describe, expect, it } from 'vitest';
import type { Metrics } from '../../contracts/engine-api';
import { bestValues, countdown, DEFAULT_THRESHOLDS, metricValue, siteStatus, slipDeltas, thresholdText } from './metrics';

const metrics: Metrics = {
  pct_lit: 82, longest_dark_h: 32, pct_earth_visible: 64, longest_blackout_h: 18,
  h_to_first_sunset: 96, h_to_first_earthset: 48, mean_sun_el_deg: 1.8, max_sun_el_deg: 4,
  mean_power_vertical: 0.8, mean_power_horizontal: 0.03, t_min_k: 70, t_max_k: 220, h_below_survival: 32,
};

describe('bestValues', () => {
  it('uses the correct direction per metric', () => {
    const other = { ...metrics, pct_lit: 91, longest_dark_h: 20, pct_earth_visible: 72, longest_blackout_h: 10 };
    expect(bestValues([metrics, other])).toEqual({
      litPercent: 91, longestDarknessHours: 20, earthContactPercent: 72, longestBlackoutHours: 10,
    });
    expect(bestValues([])).toEqual({});
  });
});

describe('countdown', () => {
  it('formats hours remaining and edge cases', () => {
    expect(countdown(12.5)).toBe('12h 30m');
    expect(countdown(30)).toBe('1d 6h 00m');
    expect(countdown(0)).toBe('Event passed');
    expect(countdown(null)).toBe('No event in window');
  });
});

describe('siteStatus', () => {
  it('passes when all thresholds are met and explains failures', () => {
    expect(siteStatus(metrics, DEFAULT_THRESHOLDS)).toEqual({ status: 'green', reason: 'All four mission thresholds met' });
    expect(siteStatus({ ...metrics, pct_lit: 30 }, DEFAULT_THRESHOLDS).status).toBe('yellow');
    expect(siteStatus({ ...metrics, pct_lit: 30, pct_earth_visible: 30 }, DEFAULT_THRESHOLDS).status).toBe('red');
    expect(siteStatus({ ...metrics, pct_lit: 30, pct_earth_visible: 30 }, DEFAULT_THRESHOLDS).reason).toContain('Sunlit');
  });
});

describe('metricValue', () => {
  it('maps contract fields to comparison keys', () => {
    expect(metricValue(metrics, 'litPercent')).toBe(82);
    expect(metricValue(metrics, 'longestBlackoutHours')).toBe(18);
  });
});

describe('slipDeltas', () => {
  it('lists only the status metrics that changed', () => {
    expect(slipDeltas(metrics, { ...metrics, pct_earth_visible: 0, longest_blackout_h: 336 })).toBe('Earth contact 64% → 0% · Blackout 18 h → 336 h');
    expect(slipDeltas(metrics, metrics)).toBe('no change in the status metrics');
  });
});

it('thresholdText states the badge rules from the thresholds', () => {
  expect(thresholdText(DEFAULT_THRESHOLDS)).toBe('≥40% sunlit, ≥40% Earth contact, ≤180 h darkness, ≤180 h blackout');
});
