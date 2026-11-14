import { useEffect, useMemo } from "react";
import type { ReactElement } from "react";
import { SphereGeometry } from "three";

// shortcut: the global sphere sits below the local DEM until whole-Moon terrain arrives.
const GLOBE_RADIUS = 0.998;
const GLOBE_WIDTH_SEGMENTS = 96;
const GLOBE_HEIGHT_SEGMENTS = 64;

export function MoonGlobe(): ReactElement {
  const geometry = useMemo(
    () => new SphereGeometry(GLOBE_RADIUS, GLOBE_WIDTH_SEGMENTS, GLOBE_HEIGHT_SEGMENTS),
    [],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color="#7d7c77" roughness={1} metalness={0} />
    </mesh>
  );
}
