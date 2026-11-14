import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import type { ReactElement } from "react";
import type { ShaderMaterial } from "three";

import {
  createTerrainShaderUniforms,
  DEFAULT_TERRAIN_SHADER_CONFIG,
  terrainFragmentShader,
  terrainVertexShader,
} from "./terrainShader";
import type { TerrainShaderConfig } from "./terrainShader";

export interface TerrainShaderMaterialProps {
  readonly config?: TerrainShaderConfig;
}

const worldLightDirection = new Vector3();

/** Elevation, view-correct hillshade, and optional height contours for the local terrain mesh. */
export function TerrainShaderMaterial({
  config = DEFAULT_TERRAIN_SHADER_CONFIG,
}: TerrainShaderMaterialProps): ReactElement {
  const materialRef = useRef<ShaderMaterial | null>(null);
  const uniforms = useMemo(() => createTerrainShaderUniforms(config), [config]);

  useFrame(({ camera }) => {
    const material = materialRef.current;
    if (!material) return;
    const light = material.uniforms.uLightDirectionView.value as Vector3;
    light.copy(worldLightDirection.set(...config.lightDirectionView))
      .transformDirection(camera.matrixWorldInverse);
  });

  return (
    <shaderMaterial
      ref={materialRef}
      uniforms={uniforms}
      vertexShader={terrainVertexShader}
      fragmentShader={terrainFragmentShader}
      toneMapped={false}
    />
  );
}
