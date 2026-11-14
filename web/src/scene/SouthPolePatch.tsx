import { useEffect, useMemo } from "react";
import type { ReactElement } from "react";

import { createSouthPoleTerrainGeometry } from "./terrain";
import {
  DEFAULT_TERRAIN_SHADER_CONFIG,
  TerrainShaderMaterial,
} from "./shaders";
import type { SouthPoleTile } from "./types";

interface SouthPolePatchProps {
  readonly tile: SouthPoleTile;
  readonly contoursEnabled?: boolean;
}

export function SouthPolePatch({ tile, contoursEnabled = false }: SouthPolePatchProps): ReactElement {
  const geometry = useMemo(
    () => createSouthPoleTerrainGeometry(tile),
    [tile],
  );
  const shaderConfig = useMemo(
    () => ({ ...DEFAULT_TERRAIN_SHADER_CONFIG, showContours: contoursEnabled }),
    [contoursEnabled],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow renderOrder={1}>
      <TerrainShaderMaterial config={shaderConfig} />
    </mesh>
  );
}
