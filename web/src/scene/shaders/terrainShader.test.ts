import { expect, test } from "vitest";
import { Vector2, Vector3 } from "three";

import {
  createTerrainShaderUniforms,
  DEFAULT_TERRAIN_SHADER_CONFIG,
  validateTerrainShaderConfig,
} from "./terrainShader";

test("uses the Cividis defaults with 100 m contours disabled", () => {
  const uniforms = createTerrainShaderUniforms();

  expect(uniforms.uElevationRangeM.value).toEqual(new Vector2(-250, 750));
  expect(uniforms.uContourIntervalM.value).toBe(100);
  expect(uniforms.uShowContours.value).toBe(false);
  expect(uniforms.uLightDirectionView.value).toEqual(
    new Vector3(...DEFAULT_TERRAIN_SHADER_CONFIG.lightDirectionView).normalize(),
  );
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
