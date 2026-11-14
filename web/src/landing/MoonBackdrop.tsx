import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Suspense, useRef, type MutableRefObject } from 'react';
import * as THREE from 'three';
import { sampleFlight, smoothstep } from './flight';

const TEXTURE_COLOR = '/textures/moon_color.jpg';
const TEXTURE_BUMP = '/textures/moon_elevation.jpg';

const HERO_POS: readonly [number, number, number] = [0.35, 0.5, 5.1];
const HERO_TARGET: readonly [number, number, number] = [-0.55, -0.05, 0];
const POLE_POS: readonly [number, number, number] = [0.5, -1.15, 3.1];
const POLE_TARGET: readonly [number, number, number] = [0, -1.42, 0.1];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: readonly number[], b: readonly number[], t: number) =>
  [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)] as const;

function Moon({ diveRef }: { diveRef: MutableRefObject<number> }) {
  const [map, bump] = useLoader(THREE.TextureLoader, [TEXTURE_COLOR, TEXTURE_BUMP]);
  const moon = useRef<THREE.Group>(null);
  useFrame(({ camera, clock }) => {
    const elapsed = clock.elapsedTime * 1000;
    const intro = sampleFlight(elapsed).progress;
    const dive = smoothstep(diveRef.current);
    const drift = Math.sin(elapsed / 4200) * 0.025 * (1 - dive);

    const pos = lerp3(HERO_POS, POLE_POS, dive);
    const target = lerp3(HERO_TARGET, POLE_TARGET, dive);
    camera.position.set(pos[0], pos[1] + drift, pos[2]);
    camera.lookAt(target[0], target[1], target[2]);

    if (moon.current) {
      moon.current.rotation.y = -0.22 + intro * 0.5 + elapsed * 0.00004;
      moon.current.rotation.x = 0.08 + dive * 0.5;
    }
  });
  return <group ref={moon} rotation={[0.08, -0.22, -0.08]}>
    <mesh>
      <sphereGeometry args={[1.45, 64, 48]} />
      <meshStandardMaterial map={map} bumpMap={bump} bumpScale={0.05} roughness={0.96} metalness={0} />
    </mesh>
    <mesh position={[0, -1.43, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.105, 0.125, 48]} />
      <meshBasicMaterial color="#f7c45c" transparent opacity={0.9} />
    </mesh>
  </group>;
}

export default function MoonBackdrop({ diveRef }: { diveRef: MutableRefObject<number> }) {
  return <Canvas
    aria-label="Photorealistic lunar surface approaching the south pole"
    camera={{ fov: 34, near: 0.1, far: 40, position: [...HERO_POS] }}
    dpr={[1, 1.5]}
    frameloop="always"
    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
  >
    <ambientLight intensity={0.1} color="#8fa3c7" />
    <directionalLight color="#fff1d6" intensity={3.4} position={[-4, 3.2, 5]} />
    <directionalLight color="#5f7fb8" intensity={0.35} position={[4, -1, -3]} />
    <Suspense fallback={null}><Moon diveRef={diveRef} /></Suspense>
  </Canvas>;
}
