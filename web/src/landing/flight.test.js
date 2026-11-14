import test from 'node:test';
import assert from 'node:assert/strict';
import { FLIGHT_DURATION_MS, flightProgress, flightCameraZ } from './flight.js';

test('intro flight clamps, eases, and approaches the pole', () => {
  assert.equal(flightProgress(-100), 0);
  assert.equal(flightProgress(0), 0);
  assert.equal(flightProgress(FLIGHT_DURATION_MS / 2), 0.5);
  assert.equal(flightProgress(FLIGHT_DURATION_MS), 1);
  assert.equal(flightProgress(FLIGHT_DURATION_MS + 100), 1);
  assert.ok(flightCameraZ(1) < flightCameraZ(0));
  assert.throws(() => flightProgress(1, 0), RangeError);
});
