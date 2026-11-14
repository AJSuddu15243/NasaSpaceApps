import test from 'node:test';
import assert from 'node:assert/strict';
import { bestValues, countdown, siteStatus, type SiteMetrics } from './metrics.ts';

const site: SiteMetrics = {
  id: 'a', name: 'A', solarElevationDeg: 4.2, litPercent: 82,
  longestDarknessHours: 12, earthContactPercent: 90, longestBlackoutHours: 4,
  temperatureMinK: 100, temperatureMaxK: 240,
  nextSunsetIso: '2026-11-15T01:00:00Z', nextEarthsetIso: '2026-11-14T13:00:00Z',
};
const thresholds = { minLitPercent: 75, minEarthContactPercent: 80, maxDarknessHours: 16, maxBlackoutHours: 8 };

test('best values use the correct direction and ignore missing values', () => {
  assert.deepEqual(bestValues([site, { ...site, id: 'b', litPercent: 91, longestDarknessHours: null, earthContactPercent: 72, longestBlackoutHours: 2 }]), {
    litPercent: 91, longestDarknessHours: 12, earthContactPercent: 90, longestBlackoutHours: 2,
  });
  assert.deepEqual(bestValues([]), {});
});

test('countdown reacts to the scrubber time and handles missing or past events', () => {
  assert.equal(countdown('2026-11-15T01:00:00Z', '2026-11-14T12:30:00Z'), '12h 30m');
  assert.equal(countdown('2026-11-15T01:00:00Z', '2026-11-15T01:00:00Z'), 'Event passed');
  assert.equal(countdown(null, '2026-11-14T12:30:00Z'), 'No event in window');
});

test('badges explain threshold failures', () => {
  assert.deepEqual(siteStatus(site, thresholds), { status: 'green', reason: 'All four mission thresholds met' });
  assert.equal(siteStatus({ ...site, litPercent: 70 }, thresholds).status, 'yellow');
  assert.equal(siteStatus({ ...site, litPercent: 70, earthContactPercent: 70 }, thresholds).status, 'red');
  assert.equal(siteStatus({ ...site, litPercent: null }, thresholds).reason, 'Some metrics are unavailable');
});
