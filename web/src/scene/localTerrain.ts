import { BufferAttribute, BufferGeometry } from 'three';
import { surfacePoint, tileFrame } from './coordinates';
import { validateSouthPoleTile } from './terrain';
import type { SouthPoleTile } from './types';

/** Full 80 m near-field grid, translated into local kilometres to retain float precision. */
export function createLocalTerrain(tile: SouthPoleTile, exaggeration = 1): BufferGeometry {
  validateSouthPoleTile(tile);
  if (![1, 2].includes(exaggeration)) throw new Error("Terrain exaggeration must be 1 or 2.");
  const { origin } = tileFrame(tile);
  const count = tile.columns * tile.rows;
  const positions = new Float32Array(count * 3);
  const uv = new Float32Array(count * 2);
  const heights = new Float32Array(count);
  const indices = new Uint32Array((tile.columns - 1) * (tile.rows - 1) * 6);
  for (let row = 0; row < tile.rows; row++) {
    for (let col = 0; col < tile.columns; col++) {
      const i = row * tile.columns + col;
      heights[i] = tile.elevationM[i];
      uv[i * 2] = col / (tile.columns - 1); uv[i * 2 + 1] = row / (tile.rows - 1);
      surfacePoint(tile.x0M + col * tile.cellM, tile.y0M + row * tile.cellM, heights[i] * exaggeration)
        .sub(origin).toArray(positions, i * 3);
    }
  }
  let k = 0;
  for (let row = 0; row < tile.rows - 1; row++) {
    for (let col = 0; col < tile.columns - 1; col++) {
      const a = row * tile.columns + col, b = a + tile.columns;
      indices.set([a, a + 1, b, a + 1, b + 1, b], k);
      k += 6;
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new BufferAttribute(uv, 2));
  geometry.setAttribute('elevationM', new BufferAttribute(heights, 1));
  geometry.setIndex(new BufferAttribute(indices, 1));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

export function elevationRange(tile: SouthPoleTile): [number, number] {
  let min = Infinity, max = -Infinity;
  for (let i = 0; i < tile.elevationM.length; i++) {
    min = Math.min(min, tile.elevationM[i]); max = Math.max(max, tile.elevationM[i]);
  }
  return [min, Math.max(max, min + 1)];
}
