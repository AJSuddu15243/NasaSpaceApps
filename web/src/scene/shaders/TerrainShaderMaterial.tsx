import { useMemo, useEffect, useState } from 'react';
import { DataTexture, MeshStandardMaterial, SRGBColorSpace, TextureLoader, Vector4, type Texture } from 'three';
import { createTerrainShaderUniforms, DEFAULT_TERRAIN_SHADER_CONFIG, terrainFragmentShader } from './terrainShader';
import type { TerrainShaderConfig } from './terrainShader';
import { slopeTexture, slopeUv } from '../heatmap/slope';
import type { LunarSceneProps, SouthPoleTile } from '../types';
export interface TerrainShaderMaterialProps {
  readonly config?: TerrainShaderConfig;
  readonly elevationEnabled?: boolean;
  readonly tile?: SouthPoleTile;
  readonly assets?: LunarSceneProps['assets'];
  readonly layer?: LunarSceneProps['layer'];
  readonly scalarMap?: Texture;
  readonly overlayOpacity?: number;
  readonly onImageryError?: () => void;
}
/** Keep Three's shadow pipeline; draw only supplied elevation/slope data. */
export function TerrainShaderMaterial({ config = DEFAULT_TERRAIN_SHADER_CONFIG, elevationEnabled = false,
  tile, assets, onImageryError, layer = 'relief', scalarMap, overlayOpacity = 0.85 }: TerrainShaderMaterialProps) {
  const [image, setImage] = useState<Texture | null>(null);
  useEffect(() => {
    if (!assets?.imagery) { setImage(null); return; }
    let disposed = false;
    const texture = new TextureLoader().load(`/data/imagery/${assets.imagery.region}.webp`, loaded => {
      if (!disposed) setImage(loaded);
    }, undefined, () => { if (!disposed) { setImage(null); onImageryError?.(); } });
    // PIPE-10 row 0 is y_min, matching positive V; do not invert the image.
    texture.flipY = false; texture.colorSpace = SRGBColorSpace;
    return () => { disposed = true; texture.dispose(); };
  }, [assets?.imagery, onImageryError]);
  const slope = useMemo(() => assets?.slope ? slopeTexture(assets.slope) : new DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1), [assets?.slope]);
  useEffect(() => () => slope.dispose(), [slope]);
  const material = useMemo(() => {
    const result = new MeshStandardMaterial({ roughness: 1, metalness: 0 });
    const h = assets?.imagery;
    const imageUv = tile && h ? [(tile.x0M - h.x_min) / (h.x_max - h.x_min), (tile.y0M - h.y_min) / (h.y_max - h.y_min),
      (tile.columns - 1) * tile.cellM / (h.x_max - h.x_min), (tile.rows - 1) * tile.cellM / (h.y_max - h.y_min)] : [0, 0, 1, 1];
    const uniforms = { ...createTerrainShaderUniforms(config), uElevationEnabled: { value: elevationEnabled || layer === 'elevation' },
      uSlopeMap: { value: slope }, uImage: { value: image ?? slope }, uScalarMap: { value: scalarMap ?? slope },
      uSlopeUv: { value: new Vector4(...(tile && assets?.slope ? slopeUv(tile, assets.slope) : [0, 0, 1, 1] as const)) },
      uImageUv: { value: new Vector4(...imageUv as [number, number, number, number]) },
      uScalarUv: { value: new Vector4(scalarMap?.offset.x ?? 0, scalarMap?.offset.y ?? 0, scalarMap?.repeat.x ?? 1, scalarMap?.repeat.y ?? 1) },
      uLayer: { value: scalarMap ? 4 : layer === 'slope' && assets?.slope ? 3 : layer === 'imagery' && image ? 1 : 0 },
      uOverlayOpacity: { value: overlayOpacity } };
    result.onBeforeCompile = shader => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = 'attribute float elevationM; varying float vElevationM; varying vec2 vTerrainUv;\n' + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvElevationM = elevationM; vTerrainUv = uv;');
      shader.fragmentShader = terrainFragmentShader + '\n' + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb *= terrainColor();');
    };
    result.customProgramCacheKey = () => 'lunar-terrain-v4';
    return result;
  }, [config, elevationEnabled, tile, assets, layer, scalarMap, overlayOpacity, slope, image]);
  useEffect(() => () => material.dispose(), [material]);
  return <primitive object={material} attach="material" />;
}
