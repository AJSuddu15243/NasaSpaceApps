import { BufferAttribute, BufferGeometry } from "three";

import type { SouthPoleTile } from "./types";

export const MOON_RADIUS_M = 1_737_400;
export const PATCH_MAX_SEGMENTS = 128;

export interface TerrainGeometryOptions {
  readonly maxSegments?: number;
  readonly verticalExaggeration?: number;
  readonly radius?: number;
}

export function validateSouthPoleTile(tile: SouthPoleTile): void {
  if (!Number.isFinite(tile.x0M) || !Number.isFinite(tile.y0M)) {
    throw new Error("South-pole tile origin must contain finite metre coordinates.");
  }
  if (!Number.isFinite(tile.cellM) || tile.cellM <= 0) {
    throw new Error("South-pole tile cellM must be a positive number of metres.");
  }
  if (!Number.isInteger(tile.columns) || !Number.isInteger(tile.rows)) {
    throw new Error("South-pole tile dimensions must be integers.");
  }
  if (tile.columns < 2 || tile.rows < 2) {
    throw new Error("South-pole tile needs at least two rows and columns.");
  }
  if (tile.elevationM.length !== tile.columns * tile.rows) {
    throw new Error("South-pole tile elevation values do not match its dimensions.");
  }

  for (let index = 0; index < tile.elevationM.length; index += 1) {
    if (!Number.isFinite(tile.elevationM[index])) {
      throw new Error(`South-pole tile elevation ${index} is not finite.`);
    }
  }
}

/**
 * Builds a curved local terrain mesh from a south-polar stereographic grid.
 * The local patch follows the Moon's curvature, rather than being a flat plane
 * placed over the sphere.
 */
export function createSouthPoleTerrainGeometry(
  tile: SouthPoleTile,
  options: TerrainGeometryOptions = {},
): BufferGeometry {
  validateSouthPoleTile(tile);

  const maxSegments = options.maxSegments ?? PATCH_MAX_SEGMENTS;
  const radius = options.radius ?? 1;
  const verticalExaggeration = options.verticalExaggeration ?? 8;
  const columns = Math.min(tile.columns, maxSegments + 1);
  const rows = Math.min(tile.rows, maxSegments + 1);
  const positions = new Float32Array(columns * rows * 3);
  const indices = new Uint32Array((columns - 1) * (rows - 1) * 6);

  for (let row = 0; row < rows; row += 1) {
    const sourceRow = Math.round((row / (rows - 1)) * (tile.rows - 1));

    for (let column = 0; column < columns; column += 1) {
      const sourceColumn = Math.round((column / (columns - 1)) * (tile.columns - 1));
      const sourceIndex = sourceRow * tile.columns + sourceColumn;
      const xM = tile.x0M + sourceColumn * tile.cellM;
      const zM = tile.y0M + sourceRow * tile.cellM;
      const elevationM = tile.elevationM[sourceIndex] * verticalExaggeration;
      const nx = xM / MOON_RADIUS_M;
      const ny = -1;
      const nz = zM / MOON_RADIUS_M;
      const length = Math.hypot(nx, ny, nz);
      const distance = radius + elevationM / MOON_RADIUS_M;
      const outputIndex = (row * columns + column) * 3;

      positions[outputIndex] = (nx / length) * distance;
      positions[outputIndex + 1] = (ny / length) * distance;
      positions[outputIndex + 2] = (nz / length) * distance;
    }
  }

  let indexOffset = 0;
  for (let row = 0; row < rows - 1; row += 1) {
    for (let column = 0; column < columns - 1; column += 1) {
      const topLeft = row * columns + column;
      const topRight = topLeft + 1;
      const bottomLeft = topLeft + columns;
      const bottomRight = bottomLeft + 1;

      indices[indexOffset] = topLeft;
      indices[indexOffset + 1] = bottomLeft;
      indices[indexOffset + 2] = topRight;
      indices[indexOffset + 3] = topRight;
      indices[indexOffset + 4] = bottomLeft;
      indices[indexOffset + 5] = bottomRight;
      indexOffset += 6;
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setIndex(new BufferAttribute(indices, 1));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}
