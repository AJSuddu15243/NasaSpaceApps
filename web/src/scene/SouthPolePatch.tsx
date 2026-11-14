import { useEffect, useMemo } from "react";
import type { ReactElement } from "react";

import { createSouthPoleTerrainGeometry } from "./terrain";
import type { SouthPoleTile } from "./types";

interface SouthPolePatchProps {
  readonly tile: SouthPoleTile;
}

export function SouthPolePatch({ tile }: SouthPolePatchProps): ReactElement {
  const geometry = useMemo(
    () => createSouthPoleTerrainGeometry(tile),
    [tile],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow renderOrder={1}>
      <meshStandardMaterial
        color="#aaa69a"
        roughness={0.96}
        metalness={0}
        polygonOffset
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-1}
      />
    </mesh>
  );
}
