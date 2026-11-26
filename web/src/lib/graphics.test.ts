import { expect, it } from 'vitest';
import { lowPowerDevice } from './graphics';
it('chooses a lighter presentation for constrained or data-saving devices', () => {
  expect(lowPowerDevice({ connection: { saveData: true }, hardwareConcurrency: 16 })).toBe(true);
  expect(lowPowerDevice({ deviceMemory: 2, hardwareConcurrency: 8 })).toBe(true);
  expect(lowPowerDevice({ hardwareConcurrency: 2 })).toBe(true);
});
it('does not assume unknown hardware is incapable of interactive terrain', () => {
  expect(lowPowerDevice({})).toBe(false);
  expect(lowPowerDevice({ deviceMemory: 8, hardwareConcurrency: 8 })).toBe(false);
});
