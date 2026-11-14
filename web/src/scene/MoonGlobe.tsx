import { useEffect, useMemo, useState } from "react";
import type { ReactElement } from "react";
import { SphereGeometry, SRGBColorSpace, TextureLoader, type Texture } from "three";

// shortcut: the global sphere sits below the local DEM until whole-Moon terrain arrives.
const GLOBE_RADIUS = 0.998;
const GLOBE_WIDTH_SEGMENTS = 128;
const GLOBE_HEIGHT_SEGMENTS = 96;
// NASA SVS CGI Moon Kit LROC colour, the same map the landing page uses.
const GLOBE_TEXTURE = "/textures/moon_color.jpg";

export function MoonGlobe(): ReactElement {
  const geometry = useMemo(
    () => new SphereGeometry(GLOBE_RADIUS, GLOBE_WIDTH_SEGMENTS, GLOBE_HEIGHT_SEGMENTS),
    [],
  );
  const [map, setMap] = useState<Texture | null>(null);

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => {
    let disposed = false;
    let loaded: Texture | null = null;
    new TextureLoader().load(GLOBE_TEXTURE, texture => {
      texture.colorSpace = SRGBColorSpace;
      loaded = texture;
      if (disposed) texture.dispose();
      else setMap(texture);
    });
    return () => { disposed = true; loaded?.dispose(); };
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial key={map ? "textured" : "plain"} map={map} color={map ? "#ffffff" : "#7d7c77"} roughness={1} metalness={0} />
    </mesh>
  );
}
