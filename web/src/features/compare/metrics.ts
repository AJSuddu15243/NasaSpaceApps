import type { Metrics } from '../../contracts/engine-api';

export type Status = 'green' | 'yellow' | 'red';
export type MetricKey = 'litPercent' | 'longestDarknessHours' | 'earthContactPercent' | 'longestBlackoutHours';

export interface CompareThresholds {
  minLitPercent: number;
  minEarthContactPercent: number;
  maxDarknessHours: number;
  maxBlackoutHours: number;
}

// shortcut: fixed demo thresholds (Ananth, 2026-11-15) until WEB-4 exposes them as scenario params.
export const DEFAULT_THRESHOLDS: CompareThresholds = {
  minLitPercent: 40,
  minEarthContactPercent: 40,
  maxDarknessHours: 180,
  maxBlackoutHours: 180,
};

/** "≥40% sunlit, ≥40% Earth contact, ≤180 h darkness, ≤180 h blackout": the badge rules, from the thresholds siteStatus uses. */
export function thresholdText(t: CompareThresholds): string {
  return `≥${t.minLitPercent}% sunlit, ≥${t.minEarthContactPercent}% Earth contact, ≤${t.maxDarknessHours} h darkness, ≤${t.maxBlackoutHours} h blackout`;
}

const directions: Record<MetricKey, 'max' | 'min'> = {
  litPercent: 'max', longestDarknessHours: 'min',
  earthContactPercent: 'max', longestBlackoutHours: 'min',
};

export function metricValue(metrics: Metrics, key: MetricKey): number {
  switch (key) {
    case 'litPercent': return metrics.pct_lit;
    case 'longestDarknessHours': return metrics.longest_dark_h;
    case 'earthContactPercent': return metrics.pct_earth_visible;
    case 'longestBlackoutHours': return metrics.longest_blackout_h;
  }
}

export function bestValues(sites: readonly Metrics[]): Partial<Record<MetricKey, number>> {
  const result: Partial<Record<MetricKey, number>> = {};
  for (const key of Object.keys(directions) as MetricKey[]) {
    const values = sites.map(site => metricValue(site, key)).filter(value => Number.isFinite(value));
    if (values.length) result[key] = directions[key] === 'max' ? Math.max(...values) : Math.min(...values);
  }
  return result;
}

export function countdown(hours: number | null): string {
  if (hours === null || !Number.isFinite(hours)) return 'No event in window';
  if (hours <= 0) return 'Event passed';
  const totalMinutes = Math.ceil(hours * 60);
  const days = Math.floor(totalMinutes / 1440);
  const clock = `${Math.floor((totalMinutes % 1440) / 60)}h ${String(totalMinutes % 60).padStart(2, '0')}m`;
  return days ? `${days}d ${clock}` : clock;
}

export function siteStatus(metrics: Metrics, thresholds: CompareThresholds): { status: Status; reason: string } {
  const checks: { value: number; limit: number; bad: (value: number, limit: number) => boolean; reason: string }[] = [
    { value: metrics.pct_lit, limit: thresholds.minLitPercent, bad: (v, l) => v < l, reason: `Sunlit time below ${thresholds.minLitPercent}%` },
    { value: metrics.pct_earth_visible, limit: thresholds.minEarthContactPercent, bad: (v, l) => v < l, reason: `Earth contact below ${thresholds.minEarthContactPercent}%` },
    { value: metrics.longest_dark_h, limit: thresholds.maxDarknessHours, bad: (v, l) => v > l, reason: `Darkness exceeds ${thresholds.maxDarknessHours} h` },
    { value: metrics.longest_blackout_h, limit: thresholds.maxBlackoutHours, bad: (v, l) => v > l, reason: `Blackout exceeds ${thresholds.maxBlackoutHours} h` },
  ];
  const failed = checks.filter(check => check.bad(check.value, check.limit));
  if (failed.length > 1) return { status: 'red', reason: failed.map(check => check.reason).join('; ') };
  if (failed.length === 1) return { status: 'yellow', reason: failed[0].reason };
  return { status: 'green', reason: 'All four mission thresholds met' };
}

const shortLabel: Record<MetricKey, string> = {
  litPercent: 'Sunlit', longestDarknessHours: 'Darkness', earthContactPercent: 'Earth contact', longestBlackoutHours: 'Blackout',
};

/** "Sunlit 62% → 48% · Earth contact 44% → 0%": the status metrics that changed between two windows. */
export function slipDeltas(before: Metrics, after: Metrics): string {
  const parts = (Object.keys(shortLabel) as MetricKey[]).flatMap(key => {
    const unit = key.endsWith('Percent') ? '%' : ' h';
    const [a, b] = [before, after].map(m => `${Math.round(metricValue(m, key) * 10) / 10}${unit}`);
    return a === b ? [] : [`${shortLabel[key]} ${a} → ${b}`];
  });
  return parts.length ? parts.join(' · ') : 'no change in the status metrics';
}
