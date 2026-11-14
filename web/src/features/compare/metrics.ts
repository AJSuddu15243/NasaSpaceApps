export type Status = 'green' | 'yellow' | 'red';
export type MetricKey = 'litPercent' | 'longestDarknessHours' | 'earthContactPercent' | 'longestBlackoutHours';

export interface SiteMetrics {
  id: string;
  name: string;
  solarElevationDeg: number | null;
  litPercent: number | null;
  longestDarknessHours: number | null;
  earthContactPercent: number | null;
  longestBlackoutHours: number | null;
  temperatureMinK: number | null;
  temperatureMaxK: number | null;
  nextSunsetIso: string | null;
  nextEarthsetIso: string | null;
}

export interface CompareThresholds {
  minLitPercent: number;
  minEarthContactPercent: number;
  maxDarknessHours: number;
  maxBlackoutHours: number;
}

const directions: Record<MetricKey, 'max' | 'min'> = {
  litPercent: 'max', longestDarknessHours: 'min',
  earthContactPercent: 'max', longestBlackoutHours: 'min',
};

export function bestValues(sites: readonly SiteMetrics[]): Partial<Record<MetricKey, number>> {
  const result: Partial<Record<MetricKey, number>> = {};
  for (const key of Object.keys(directions) as MetricKey[]) {
    const values = sites.map(site => site[key]).filter((value): value is number => value !== null && Number.isFinite(value));
    if (values.length) result[key] = directions[key] === 'max' ? Math.max(...values) : Math.min(...values);
  }
  return result;
}

export function countdown(targetIso: string | null, timelineIso: string): string {
  if (!targetIso) return 'No event in window';
  const remaining = Date.parse(targetIso) - Date.parse(timelineIso);
  if (!Number.isFinite(remaining)) return 'Time unavailable';
  if (remaining <= 0) return 'Event passed';
  const minutes = Math.ceil(remaining / 60_000);
  const days = Math.floor(minutes / 1_440);
  const hours = Math.floor((minutes % 1_440) / 60);
  const mins = minutes % 60;
  return `${days ? `${days}d ` : ''}${hours}h ${String(mins).padStart(2, '0')}m`;
}

export function siteStatus(site: SiteMetrics, thresholds: CompareThresholds): { status: Status; reason: string } {
  const checks: { value: number | null; limit: number; bad: (value: number, limit: number) => boolean; reason: string }[] = [
    { value: site.litPercent, limit: thresholds.minLitPercent, bad: (v, l) => v < l, reason: `Sunlit time below ${thresholds.minLitPercent}%` },
    { value: site.earthContactPercent, limit: thresholds.minEarthContactPercent, bad: (v, l) => v < l, reason: `Earth contact below ${thresholds.minEarthContactPercent}%` },
    { value: site.longestDarknessHours, limit: thresholds.maxDarknessHours, bad: (v, l) => v > l, reason: `Darkness exceeds ${thresholds.maxDarknessHours} h` },
    { value: site.longestBlackoutHours, limit: thresholds.maxBlackoutHours, bad: (v, l) => v > l, reason: `Blackout exceeds ${thresholds.maxBlackoutHours} h` },
  ];
  const missing = checks.filter(check => check.value === null || !Number.isFinite(check.value));
  const failed = checks.filter(check => check.value !== null && Number.isFinite(check.value) && check.bad(check.value, check.limit));
  if (failed.length > 1) return { status: 'red', reason: failed.map(check => check.reason).join('; ') };
  if (failed.length === 1) return { status: 'yellow', reason: failed[0].reason };
  if (missing.length) return { status: 'yellow', reason: 'Some metrics are unavailable' };
  return { status: 'green', reason: 'All four mission thresholds met' };
}
