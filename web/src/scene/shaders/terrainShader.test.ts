import { expect, test } from "vitest";
import { Vector2 } from "three";

import {
  createTerrainShaderUniforms,
  DEFAULT_TERRAIN_SHADER_CONFIG,
  validateTerrainShaderConfig,
} from "./terrainShader";
import { createMockSouthPoleTile } from "../mockTerrain";

test("uses the Cividis defaults with 100 m contours disabled", () => {
  const uniforms = createTerrainShaderUniforms();

  expect(uniforms.uElevationRangeM.value).toEqual(new Vector2(-250, 750));
  expect(uniforms.uContourIntervalM.value).toBe(100);
  expect(uniforms.uShowContours.value).toBe(false);

});

test("rejects invalid elevation and contour settings at the shader boundary", () => {
  expect(() => validateTerrainShaderConfig({
    ...DEFAULT_TERRAIN_SHADER_CONFIG,
    elevationRangeM: [10, 10],
  })).toThrow("increasing finite range");

  expect(() => validateTerrainShaderConfig({
    ...DEFAULT_TERRAIN_SHADER_CONFIG,
    contourIntervalM: 0,
  })).toThrow("contourIntervalM must be positive");
});

test("default elevation range contains the deterministic mock terrain", () => {
  const tile = createMockSouthPoleTile();
  let minimum = Number.POSITIVE_INFINITY;
  let maximum = Number.NEGATIVE_INFINITY;
  for (let index = 0; index < tile.elevationM.length; index += 1) {
    const elevation = tile.elevationM[index];
    minimum = Math.min(minimum, elevation);
    maximum = Math.max(maximum, elevation);
  }

  expect(minimum).toBeGreaterThanOrEqual(DEFAULT_TERRAIN_SHADER_CONFIG.elevationRangeM[0]);
  expect(maximum).toBeLessThanOrEqual(DEFAULT_TERRAIN_SHADER_CONFIG.elevationRangeM[1]);
});
