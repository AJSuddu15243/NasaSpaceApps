import test from 'node:test';
import assert from 'node:assert/strict';
import { coordinateLabel, gridLines } from './geometry.ts';

test('distance grid uses the source metre frame and stable global spacing', () => {
  assert.deepEqual(Array.from(gridLines({ centerX: 500, centerZ: 0, extentKm: 2, spacingKm: 1 })), [
    0, -1000, 0, 1000, 1000, -1000, 1000, 1000,
    -500, -1000, 1500, -1000, -500, 0, 1500, 0,
    -500, 1000, 1500, 1000,
  ]);
  assert.throws(() => gridLines({ centerX: 0, centerZ: 0, extentKm: 2, spacingKm: 0 }), RangeError);
});

test('coordinate labels show hemisphere and normalize longitude', () => {
  assert.equal(coordinateLabel(-89.25, 181), '89.25°S  179.00°W');
  assert.equal(coordinateLabel(0, 45), '0.00°N  45.00°E');
  assert.throws(() => coordinateLabel(-91, 0), RangeError);
});
