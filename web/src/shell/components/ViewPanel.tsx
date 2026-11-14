import { useState } from 'react';
import { LunarScene, type CameraMode } from '../../scene';
import { TerrainShadingControls } from '../../scene/shaders';
import type { Scenario, View } from '../scenario';
import type { DemoData } from '../data';
import { Badge, Button } from '../ui';
import { polarPoint } from '../viewGeometry';
import { parseCustomSite } from '../../features/sites/sites';
const labels: Record<View, string> = { '3d': '3D terrain', panorama: 'Horizon panorama', map: 'Polar map' };
export function ViewPanel({ scenario, data, change }: { scenario: Scenario; data: DemoData; change: (patch: Partial<Scenario>) => void }) {
  const [cameraMode, setCameraMode] = useState<CameraMode>('orbit');
  const [contoursEnabled, setContoursEnabled] = useState(false);
  const isThreeD = scenario.view === '3d';
  const markers = scenario.sites.flatMap((id, index) => {
    const site = data.sites.find(item => item.id === id);
    const coords = site ?? parseCustomSite(id);
    return coords ? [{ ...polarPoint(coords.lat, coords.lon), name: site?.name ?? 'Custom point', index }] : [];
  });
  return <section className="view-panel" aria-labelledby="view-heading">
    <div className="view-toolbar"><div><span className="eyebrow">02 / OBSERVE</span><h2 id="view-heading">South pole environment</h2></div><Badge>Illustrative layer</Badge></div>
    <div className="view-switch" role="group" aria-label="Environment view">
      {(Object.keys(labels) as View[]).map(view => <Button key={view} variant={view === scenario.view ? 'secondary' : 'ghost'} aria-pressed={view === scenario.view} onClick={() => change({ view })}>{labels[view]}</Button>)}
    </div>
    {isThreeD ? <>
      <div className="terrain-scene-toolbar">
        <p className="hint">Drag to orbit. Double-click the canvas or use the button to fly to the south pole.</p>
        <TerrainShadingControls contoursEnabled={contoursEnabled} onContoursEnabledChange={setContoursEnabled} />
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
          contoursEnabled={contoursEnabled}
          aria-label="Interactive lunar south-pole terrain scene"
        />
      </div>
      <p className="scene-caption"><span className="eyebrow">SOUTH POLAR REGION</span> Synthetic terrain preview for SCN-1. Elevation and lighting are illustrative until pipeline and ephemeris data are connected.</p>
    </> : <div className={`terrain-empty terrain-${scenario.view}`} key={scenario.view}>
      <div className="viewport-meta"><span>MOON_ME · 80–90°S</span><span>UTC {scenario.date.slice(0, 16).replace('T', ' ')}</span></div>
      <svg className="lunar-outline" viewBox="0 0 480 380" fill="none" role="img" aria-label={`Illustrative ${labels[scenario.view]} with ${markers.length} selected site markers`}>
        <defs><radialGradient id="surface" cx="48%" cy="44%"><stop offset="0" stopColor="#343941"/><stop offset=".6" stopColor="#1c2026"/><stop offset="1" stopColor="#0a0c10"/></radialGradient><filter id="soft"><feGaussianBlur stdDeviation="12"/></filter></defs>
        <ellipse className="earth-cast" cx="370" cy="78" rx="62" ry="22" filter="url(#soft)"/>
        <circle className="polar-disc" cx="240" cy="190" r="136" fill="url(#surface)"/>
        <g className="grid-lines"><circle cx="240" cy="190" r="102"/><circle cx="240" cy="190" r="68"/><circle cx="240" cy="190" r="34"/><path d="M104 190h272M240 54v272M144 94l192 192M336 94L144 286"/></g>
        <g className="terrain-contours"><path d="M119 222c42-31 55-13 79-42 24-28 25-69 74-72 42-2 59 38 85 56"/><path d="M128 250c35-23 58-14 87-34 39-27 38-76 84-77 29-1 46 20 61 40"/><path d="M157 276c40-13 73-8 97-34 25-26 28-62 64-63 21-1 35 11 47 24"/><path d="M153 137c24 5 37 23 55 24 24 2 28-27 53-31 31-5 49 24 77 16"/></g>
        <path className="sun-vector" d="M85 76l83 65"/><circle className="sun-node" cx="76" cy="69" r="6"/><text x="54" y="50">SUN</text>
        <path className="earth-vector" d="M397 87l-78 64"/><circle className="earth-node" cx="404" cy="80" r="6"/><text x="397" y="55">EARTH</text>
        {markers.map(marker => <g className="site-node" key={`${marker.x}-${marker.y}`} transform={`translate(${marker.x} ${marker.y})`}><circle r="10"/><circle r="3"/><text x="14" y="4">{String(marker.index + 1).padStart(2, '0')}</text><title>{marker.name}</title></g>)}
        <text className="pole-label" x="240" y="194" textAnchor="middle">SOUTH POLE</text>
      </svg>
      <div className="viewport-readout"><div><span>Selected</span><strong>{markers.length.toString().padStart(2, '0')}</strong></div><div><span>Window</span><strong>{scenario.hours} h</strong></div><div><span>Layer</span><strong>{labels[scenario.view]}</strong></div></div>
      <div className="empty-caption"><p>Visual orientation only. Real LOLA terrain, horizon masks, and ephemeris vectors are not connected in this preview.</p></div>
    </div>}
    <div className="view-footer"><span><i className="legend-dot sun"/> Sun / power</span><span><i className="legend-dot earth"/> Earth / communications</span></div>
    <div className="method-note"><h3>Read the horizon, then the window.</h3><p>At the lunar south pole, nearby terrain can block the Sun or Earth. Compare sites over the same time window before drawing conclusions.</p></div>
  </section>;
}
