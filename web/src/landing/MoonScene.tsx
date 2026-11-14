import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group } from 'three';
import { sampleFlight } from './flight';

function Approach() {
  const moon = useRef<Group>(null);
  useFrame(({ camera, clock, invalidate }) => {
    const sample = sampleFlight(clock.elapsedTime * 1000);
    camera.position.set(...sample.camera);
    camera.lookAt(...sample.target);
    if (moon.current) moon.current.rotation.y = -0.22 + sample.progress * 0.16;
    if (sample.progress < 1) invalidate();
  });
  return <group ref={moon} rotation={[0.08, -0.22, -0.08]}>
    <mesh>
      <icosahedronGeometry args={[1.45, 5]} />
      <meshStandardMaterial color="#a6a9ae" roughness={1} flatShading />
    </mesh>
    <mesh position={[0, -1.43, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.105, 0.125, 48]} />
      <meshBasicMaterial color="#f7c45c" />
    </mesh>
  </group>;
}

export default function MoonScene({ onReady }: { onReady: () => void }) {
  return <Canvas
    aria-label="Stylised Moon approaching the lunar south pole"
    camera={{ fov: 34, near: 0.1, far: 30, position: [0.35, 0.45, 5.2] }}
    dpr={[1, 1.5]}
    frameloop="demand"
    gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
    onCreated={onReady}
  >
    <ambientLight intensity={0.18} />
    <directionalLight color="#fff4d9" intensity={3.8} position={[-4, 3, 5]} />
    <Approach />
  </Canvas>;
}
