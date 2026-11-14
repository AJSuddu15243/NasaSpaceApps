import fragmentShader from "./terrain.frag.glsl?raw";
import { Vector2 } from "three";
export const terrainFragmentShader = fragmentShader;
export const DEFAULT_TERRAIN_SHADER_CONFIG = {
  elevationRangeM: [-250, 750] as readonly [number, number],
  showContours: false,
  contourIntervalM: 100,
};
export interface TerrainShaderConfig {
  readonly elevationRangeM: readonly [number, number];
  readonly showContours: boolean;
  readonly contourIntervalM: number;
}
export function validateTerrainShaderConfig(config: TerrainShaderConfig): void {
  const [min, max] = config.elevationRangeM;
  if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max)
    throw new Error("Terrain needs an increasing finite range.");
  if (!Number.isFinite(config.contourIntervalM) || config.contourIntervalM <= 0)
    throw new Error("contourIntervalM must be positive");
}
export function createTerrainShaderUniforms(config = DEFAULT_TERRAIN_SHADER_CONFIG) {
  validateTerrainShaderConfig(config);
  return {
    uElevationRangeM: { value: new Vector2(...config.elevationRangeM) },
    uShowContours: { value: config.showContours },
    uContourIntervalM: { value: config.contourIntervalM },
  };
}
