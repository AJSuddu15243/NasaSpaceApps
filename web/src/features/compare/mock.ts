import type { SiteMetrics } from './metrics';

// shortcut: illustrative metrics only, replace with WEB-3 site state and WEB-4 scenario results when those land.
export const mockSites: SiteMetrics[] = [
  { id: 'haworth', name: 'Haworth', solarElevationDeg: 2.8, litPercent: 67, longestDarknessHours: 39.5, earthContactPercent: 91, longestBlackoutHours: 4.2, temperatureMinK: 88, temperatureMaxK: 233, nextSunsetIso: '2026-11-16T04:00:00Z', nextEarthsetIso: '2026-11-15T18:00:00Z' },
  { id: 'connecting-ridge', name: 'Connecting Ridge', solarElevationDeg: 5.6, litPercent: 86, longestDarknessHours: 13.2, earthContactPercent: 79, longestBlackoutHours: 11.7, temperatureMinK: 104, temperatureMaxK: 251, nextSunsetIso: '2026-11-17T10:00:00Z', nextEarthsetIso: '2026-11-15T21:00:00Z' },
  { id: 'nobile-rim-1', name: 'Nobile Rim 1', solarElevationDeg: 4.1, litPercent: 78, longestDarknessHours: 18.4, earthContactPercent: 86, longestBlackoutHours: 7.1, temperatureMinK: 96, temperatureMaxK: 247, nextSunsetIso: '2026-11-16T17:00:00Z', nextEarthsetIso: '2026-11-16T01:00:00Z' },
];
