import { describe, expect, it } from 'vitest';
import { polarPoint } from '../viewGeometry';

describe('south-pole projection', () => {
  it('places the pole at centre and 80°S on the outer ring', () => {
    expect(polarPoint(-90, 0)).toEqual({ x: 240, y: 190 });
    expect(polarPoint(-80, 90)).toEqual({ x: 366, y: 190 });
  });
});
