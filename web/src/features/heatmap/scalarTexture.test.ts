import { describe, expect, it } from 'vitest';
import { scalarTexture } from './scalarTexture';
import type { Grid } from './grid';
import type { SouthPoleTile } from '../../scene/types';

describe('opaque science layers', () => {
  it('keeps cell order, no-data visible, and aligns the grid to the LOLA tile', () => {
    const grid = { header: { nx: 2, ny: 2, x0: 40, y0: 40, cell_m: 160 } } as Grid;
    const tile = { columns: 4, rows: 4, x0M: 0, y0M: 0, cellM: 80 } as SouthPoleTile;
    const texture = scalarTexture(grid, tile, Float32Array.from([0, 0.5, 1, NaN]), [0, 1], ['#000000', '#808080', '#ffffff']);
    const bytes = texture.image.data as Uint8Array;
    expect(Array.from(bytes)).toEqual([0, 0, 0, 255, 128, 128, 128, 255, 255, 255, 255, 255, 55, 55, 55, 255]);
    expect(texture.offset.x).toBeCloseTo(-0.25);
    expect(texture.offset.y).toBeCloseTo(-0.25);
    expect(texture.repeat.x).toBeCloseTo(1.5);
    expect(texture.repeat.y).toBeCloseTo(1.5);
    expect(texture.flipY).toBe(false);
    texture.dispose();
  });
});
