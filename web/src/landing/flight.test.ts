import { describe, expect, it } from 'vitest';
import { chooseHeroMode, sampleFlight, smoothstep } from './flight';

describe('intro flight', () => {
  it('clamps its easing and lands at the south-pole framing', () => {
    expect(smoothstep(-1)).toBe(0);
    expect(smoothstep(2)).toBe(1);
    expect(sampleFlight(0).camera).toEqual([0.35, 0.45, 5.2]);
    expect(sampleFlight(2200)).toEqual({
      progress: 1,
      camera: [0, -1.2, 3.35],
      target: [0, -0.85, 0],
    });
  });

  it('rejects invalid timing inputs', () => {
    expect(() => sampleFlight(Number.NaN)).toThrow(RangeError);
    expect(() => sampleFlight(10, 0)).toThrow(RangeError);
  });
});

describe('hero capability boundary', () => {
  const capable = { reducedMotion: false, saveData: false, hardwareConcurrency: 8, deviceMemory: 8, webgl: true };
  it('animates only on capable devices', () => {
    expect(chooseHeroMode(capable)).toBe('flight');
    for (const fallback of [
      { ...capable, reducedMotion: true },
      { ...capable, saveData: true },
      { ...capable, hardwareConcurrency: 4 },
      { ...capable, deviceMemory: 4 },
      { ...capable, webgl: false },
    ]) expect(chooseHeroMode(fallback)).toBe('static');
  });
});
