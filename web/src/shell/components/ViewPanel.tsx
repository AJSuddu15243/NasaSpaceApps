import { useState } from 'react';
import { LunarScene, type CameraMode } from '../../scene';
import type { Scenario, View } from '../scenario';
import { Badge, Button } from '../ui';
const labels: Record<View, string> = { '3d': '3D terrain', panorama: 'Horizon panorama', map: 'Polar map' };
export function ViewPanel({ scenario, change }: { scenario: Scenario; change: (patch: Partial<Scenario>) => void }) {
  const [cameraMode, setCameraMode] = useState<CameraMode>('orbit');
  const isThreeD = scenario.view === '3d';

  return <section className="view-panel" aria-labelledby="view-heading">
    <div className="view-toolbar"><h2 id="view-heading">Site environment</h2><Badge>Demo workspace</Badge></div>
    <div className="view-switch" role="group" aria-label="Environment view">
      {(Object.keys(labels) as View[]).map(view => <Button key={view} variant={view === scenario.view ? 'secondary' : 'ghost'} aria-pressed={view === scenario.view} onClick={() => change({ view })}>{labels[view]}</Button>)}
    </div>
    {isThreeD ? <>
      <div className="terrain-scene-toolbar">
        <p className="hint">Drag to orbit. Double-click the canvas or use the button to fly to the south pole.</p>
        <Button
          variant="outline"
          onClick={() => setCameraMode(mode => mode === 'orbit' ? 'south-pole' : 'orbit')}
        >
          {cameraMode === 'orbit' ? 'Fly to south pole' : 'Return to globe'}
        </Button>
      </div>
      <div className="terrain-scene">
        <LunarScene
          cameraMode={cameraMode}
          onCameraModeChange={setCameraMode}
          aria-label="Interactive lunar south-pole terrain scene"
        />
      </div>
      <p className="scene-caption"><span className="eyebrow">SOUTH POLAR REGION</span> Synthetic terrain preview for SCN-1. Elevation and lighting are illustrative until pipeline and ephemeris data are connected.</p>
    </> : <div className="terrain-empty" key={scenario.view}>
      <svg className="lunar-outline" viewBox="0 0 440 360" fill="none" aria-hidden="true"><circle cx="220" cy="180" r="132"/><ellipse cx="220" cy="180" rx="56" ry="132"/><ellipse cx="220" cy="180" rx="132" ry="48"/><path d="M88 180h264M220 48v264"/><circle cx="220" cy="296" r="5" className="pole-dot"/></svg>
      <div className="empty-caption"><span className="eyebrow">SOUTH POLAR REGION</span><h3>{labels[scenario.view]} not loaded</h3><p>Terrain and horizon data are not connected yet. The diagram is illustrative; it is not a map or a simulation.</p></div>
    </div>}
    <div className="view-footer"><span><i className="legend-dot sun"/> Sun / power</span><span><i className="legend-dot earth"/> Earth / communications</span></div>
    <div className="method-note"><h3>Read the horizon, then the window.</h3><p>At the lunar south pole, nearby terrain can block the Sun or Earth. Compare sites over the same time window before drawing conclusions.</p></div>
  </section>;
}
