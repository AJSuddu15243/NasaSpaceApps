import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { DirectionalLight, Object3D } from 'three';
import type { SceneSimulationRef } from './types';
export function SunLight({ simulationRef, span }: { simulationRef?: SceneSimulationRef; span: number }) {
  const light = useRef<DirectionalLight>(null);
  const target = useMemo(() => new Object3D(), []);
  useFrame(() => {
    const sun = simulationRef?.current.sunDirection;
    if (!light.current) return;
    const valid = sun?.every(Number.isFinite) && Math.hypot(...sun) > 0;
    light.current.intensity = valid ? 3 : 0;
    if (sun && valid) light.current.position.set(...sun).normalize().multiplyScalar(span * 3);
  });
  return <>
    <primitive object={target} />
    <directionalLight ref={light} target={target} castShadow intensity={0}
      shadow-mapSize={[2048, 2048]} shadow-bias={-0.00005} shadow-normalBias={0.008}
      shadow-camera-left={-span * 0.8} shadow-camera-right={span * 0.8}
      shadow-camera-top={span * 0.8} shadow-camera-bottom={-span * 0.8}
      shadow-camera-near={span} shadow-camera-far={span * 5} />
  </>;
}
