import fragmentShader from "./terrain.frag.glsl?raw";
import vertexShader from "./terrain.vert.glsl?raw";
import { Vector2, Vector3 } from "three";

export const terrainVertexShader = vertexShader;
export const terrainFragmentShader = fragmentShader;

export const DEFAULT_TERRAIN_SHADER_CONFIG = {
  elevationRangeM: [-250, 750] as readonly [number, number],
  moonRadiusM: 1_737_400,
  baseRadius: 1,
  verticalExaggeration: 8,
  lightDirectionView: [0.5, 0.75, 0.35] as readonly [number, number, number],
  hillshadeStrength: 0.82,
  showContours: false,
  contourIntervalM: 100,
  contourWidthM: 2,
  contourOpacity: 0.72,
  contourColor: [0.04, 0.05, 0.06] as readonly [number, number, number],
} as const;

export interface TerrainShaderConfig {
  readonly elevationRangeM: readonly [number, number];
  readonly moonRadiusM: number;
  readonly baseRadius: number;
  readonly verticalExaggeration: number;
  readonly lightDirectionView: readonly [number, number, number];
  readonly hillshadeStrength: number;
  readonly showContours: boolean;
  readonly contourIntervalM: number;
  readonly contourWidthM: number;
  readonly contourOpacity: number;
  readonly contourColor: readonly [number, number, number];
}

export function validateTerrainShaderConfig(config: TerrainShaderConfig): void {
  const [minimum, maximum] = config.elevationRangeM;
  if (!Number.isFinite(minimum) || !Number.isFinite(maximum) || minimum >= maximum) {
    throw new Error("Terrain shader elevationRangeM must contain an increasing finite range.");
  }
  if (!Number.isFinite(config.moonRadiusM) || config.moonRadiusM <= 0) {
    throw new Error("Terrain shader moonRadiusM must be positive.");
  }
  if (!Number.isFinite(config.baseRadius) || config.baseRadius <= 0) {
    throw new Error("Terrain shader baseRadius must be positive.");
  }
  if (!Number.isFinite(config.verticalExaggeration) || config.verticalExaggeration <= 0) {
    throw new Error("Terrain shader verticalExaggeration must be positive.");
  }
  if (!Number.isFinite(config.contourIntervalM) || config.contourIntervalM <= 0) {
    throw new Error("Terrain shader contourIntervalM must be positive.");
  }
  if (!Number.isFinite(config.contourWidthM) || config.contourWidthM <= 0) {
    throw new Error("Terrain shader contourWidthM must be positive.");
  }
  if (!Number.isFinite(config.hillshadeStrength) || config.hillshadeStrength < 0 || config.hillshadeStrength > 1) {
    throw new Error("Terrain shader hillshadeStrength must be between zero and one.");
  }
  if (!Number.isFinite(config.contourOpacity) || config.contourOpacity < 0 || config.contourOpacity > 1) {
    throw new Error("Terrain shader contourOpacity must be between zero and one.");
  }
  if (!config.lightDirectionView.every(Number.isFinite) || Math.hypot(...config.lightDirectionView) === 0) {
    throw new Error("Terrain shader lightDirectionView must be a finite, nonzero vector.");
  }
  if (!config.contourColor.every((channel) => Number.isFinite(channel) && channel >= 0 && channel <= 1)) {
    throw new Error("Terrain shader contourColor channels must be between zero and one.");
  }
}

type TerrainUniformValue = number | boolean | Vector2 | Vector3;

export function createTerrainShaderUniforms(
  config: TerrainShaderConfig = DEFAULT_TERRAIN_SHADER_CONFIG,
): Record<string, { value: TerrainUniformValue }> {
  validateTerrainShaderConfig(config);
  return {
    uElevationRangeM: { value: new Vector2(...config.elevationRangeM) },
    uMoonRadiusM: { value: config.moonRadiusM },
    uBaseRadius: { value: config.baseRadius },
    uVerticalExaggeration: { value: config.verticalExaggeration },
    uLightDirectionView: { value: new Vector3(...config.lightDirectionView).normalize() },
    uHillshadeStrength: { value: config.hillshadeStrength },
    uShowContours: { value: config.showContours },
    uContourIntervalM: { value: config.contourIntervalM },
    uContourWidthM: { value: config.contourWidthM },
    uContourOpacity: { value: config.contourOpacity },
    uContourColor: { value: new Vector3(...config.contourColor) },
  };
}
