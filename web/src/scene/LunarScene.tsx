import { Canvas, useThree } from '@react-three/fiber';
import { Component, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { PCFShadowMap } from 'three';
import { createMockSouthPoleTile } from './mockTerrain';
import { tileFrame } from './coordinates';
import { SceneCamera } from './SceneCamera';
import { SouthPolePatch } from './SouthPolePatch';
import { SunLight } from './SunLight';
import { SceneOverlays } from './SceneOverlays';
import type { LunarSceneProps } from './types';

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p role="alert">The terrain view could not start. Reload to retry, or use the site comparison.</p> : this.props.children; }
}
function Refresh({ timeKey, visible }: { timeKey?: string; visible: boolean }) {
  const invalidate = useThree(state => state.invalidate);
  useEffect(() => { invalidate(); }, [timeKey, visible, invalidate]);
  return null;
}
export function LunarScene({ active: inView = true, tile, simulationRef, contoursEnabled = false, elevationEnabled = false,
  assets, layer, overlayOpacity, onImageryError, exaggeration = 1, onSiteSelect, cameraMode = 'south-pole', view = '3d', sites = [], timeKey, resetKey = 0, className,
  'aria-label': label = 'Interactive lunar terrain' }: LunarSceneProps) {
  const fallback = useMemo(createMockSouthPoleTile, []);
  const active = tile ?? fallback;
  const frame = useMemo(() => tileFrame(active), [active]);
  const [visible, setVisible] = useState(!document.hidden);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  return <SceneBoundary><Canvas aria-label={label} className={className} dpr={[1, 1.5]}
    frameloop={visible && inView ? 'demand' : 'never'} shadows={{ type: PCFShadowMap }}
    gl={{ antialias: true }} style={{ width: '100%', height: '100%', minHeight: 420 }}
    fallback={<p role="alert">WebGL is unavailable. Site comparisons remain available.</p>}>
    <color attach="background" args={['#080c12']} />
    <ambientLight intensity={0.65} />
    <SunLight simulationRef={simulationRef} span={frame.span} />
    <SouthPolePatch tile={active} contoursEnabled={contoursEnabled} elevationEnabled={elevationEnabled} assets={assets} onImageryError={onImageryError} layer={layer} overlayOpacity={overlayOpacity} exaggeration={exaggeration} />
    <SceneOverlays tile={active} frame={frame} sites={sites} map={view === 'map'} exaggeration={exaggeration} onSiteSelect={onSiteSelect} />
    <SceneCamera frame={frame} view={view} mode={cameraMode} resetKey={resetKey} />
    <Refresh timeKey={timeKey} visible={visible && inView} />
  </Canvas></SceneBoundary>;
}
