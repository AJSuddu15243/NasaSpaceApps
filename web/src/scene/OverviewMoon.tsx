import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ShaderMaterial, SRGBColorSpace, Texture, Vector2, Vector3 } from 'three';
import { loadMoonTextures, type MoonTextures } from '../landing/textures';
import { moonVertex, moonFragment } from './moonShader';
import { SceneLabel } from './SceneLabel';
import { bodyDirection } from './coordinates';
import type { SceneSiteMarker, SceneSimulationRef } from './types';
function OverviewCamera({ timeKey }: { timeKey: string }) {
  const { camera, gl, size, invalidate } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.minDistance = 1.25; controls.maxDistance = 10;
    const aspect = size.width / Math.max(size.height, 1);
    const halfFov = Math.atan(Math.tan(25 * Math.PI / 180) * Math.min(1, aspect) * 0.7);
    camera.position.set(0.25, -0.85, 0.65).normalize().multiplyScalar(1 / Math.sin(halfFov));
    camera.up.set(0, 1, 0); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix();
    const redraw = () => invalidate();
    controls.addEventListener('change', redraw); controls.update(); invalidate();
    return () => { controls.removeEventListener('change', redraw); controls.dispose(); };
  }, [camera, gl, size, invalidate]);
  useEffect(() => { invalidate(); }, [invalidate, timeKey]);
  return null;
}
function Globe({ textures, simulationRef }: { textures: MoonTextures; simulationRef: SceneSimulationRef }) {
  const shader = useRef<ShaderMaterial>(null);
  const maps = useMemo(() => {
    const make = (bitmap: ImageBitmap, color: boolean) => {
      const texture = new Texture(bitmap); texture.needsUpdate = true;
      if (color) texture.colorSpace = SRGBColorSpace;
      return texture;
    };
    return { color: make(textures.color, true), height: textures.height ? make(textures.height, false) : null,
      cap: textures.cap ? make(textures.cap, false) : null };
  }, [textures]);
  useEffect(() => () => { maps.color.dispose(); maps.height?.dispose(); maps.cap?.dispose(); }, [maps]);
  const uniforms = useMemo(() => ({ map: { value: maps.color }, heightMap: { value: maps.height ?? maps.color }, useHeight: { value: maps.height ? 1 : 0 },
    heightTexel: { value: new Vector2(1 / (textures.height ?? textures.color).width, 1 / (textures.height ?? textures.color).height) },
    texel: { value: new Vector2(1 / textures.color.width, 1 / textures.color.height) }, sunDir: { value: new Vector3(1, 0, 0) },
    bumpScale: { value: maps.height ? 0.03 : 0.004 }, exposure: { value: 1.15 }, capNormal: { value: maps.cap ?? maps.color }, capOn: { value: maps.cap ? 1 : 0 }, capHalf: { value: textures.capHalf } }), [maps, textures]);
  useFrame(() => {
    const sun = simulationRef.current.sunDirection;
    if (shader.current) {
      shader.current.uniforms.exposure.value = sun ? 1.15 : 0;
      if (sun) shader.current.uniforms.sunDir.value.set(...sun).normalize();
    }
  });
  return <mesh rotation={[0, -Math.PI / 2, 0]}>
    <sphereGeometry args={[1, 128, 96]} />
    <shaderMaterial ref={shader} uniforms={uniforms} vertexShader={moonVertex} fragmentShader={moonFragment} />
  </mesh>;
}
export function OverviewMoon({ sites, simulationRef, onSiteSelect, timeKey, active }: { active: boolean; sites: readonly SceneSiteMarker[]; simulationRef: SceneSimulationRef; onSiteSelect: (id: string) => void; timeKey: string }) {
  const [textures, setTextures] = useState<MoonTextures | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController(); let loaded: MoonTextures | null = null;
    loadMoonTextures(() => {}, controller.signal).then(value => {
      loaded = value;
      if (!controller.signal.aborted) setTextures(value);
      else { value.color.close(); value.height?.close(); value.cap?.close(); }
    }).catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => { controller.abort(); loaded?.color.close(); loaded?.height?.close(); loaded?.cap?.close(); };
  }, []);
  if (failed) return <p role="alert">Moon textures could not load. Choose local terrain to continue.</p>;
  if (!textures) return <p role="status">Loading lunar overview…</p>;
  return <Canvas dpr={[1, 1.5]} frameloop={active ? "demand" : "never"} camera={{ fov: 50 }} aria-label="Interactive Moon overview" fallback={<p>WebGL is unavailable.</p>}>
    <color attach="background" args={['#080c12']} />
    <Globe textures={textures} simulationRef={simulationRef} />
    <OverviewCamera timeKey={`${timeKey}-${active}`} />
    {sites.map(site => <SceneLabel globe key={site.id} position={new Vector3(...bodyDirection(site.lat, site.lon)).multiplyScalar(1.015)}>
      <button type="button" className="scene-site" aria-label={`Explore ${site.name}`} onClick={() => onSiteSelect(site.id)}>{site.index + 1}<span>{site.name}</span></button>
    </SceneLabel>)}
  </Canvas>;
}
