import { useEffect, useMemo } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { createLocalTerrain, elevationRange } from './localTerrain';
import { TerrainShaderMaterial } from './shaders';
import type { LunarSceneProps, SouthPoleTile } from './types';
export function SouthPolePatch({ tile, contoursEnabled = false, elevationEnabled = false, assets, layer, scalarMap, overlayOpacity, onImageryError, onProbe, exaggeration = 1 }: LunarSceneProps & { tile: SouthPoleTile }) {
  const geometry = useMemo(() => createLocalTerrain(tile, exaggeration), [tile, exaggeration]);
  const config = useMemo(() => ({ elevationRangeM: elevationRange(tile), showContours: contoursEnabled, contourIntervalM: 100 }), [tile, contoursEnabled]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} castShadow receiveShadow onPointerMove={onProbe ? (event: ThreeEvent<PointerEvent>) => { if (event.uv) onProbe(event.uv.x, event.uv.y); } : undefined}>
    <TerrainShaderMaterial onImageryError={onImageryError} config={config} tile={tile} assets={assets} layer={layer} scalarMap={scalarMap} overlayOpacity={overlayOpacity} elevationEnabled={elevationEnabled} />
  </mesh>;
}
