import { lazy, Suspense, useMemo } from 'react';
import { Box, Globe, Map, Mountain } from 'lucide-react';
import type { Scenario, View } from '../scenario';
import type { DemoData } from '../data';
import { polarPoint } from '../viewGeometry';
import { parseCustomSite } from '../../features/sites/sites';
import { ephemAt } from '../../features/globe/ephem';
import { ephemCoverage } from '../../features/compare/timeline';
import type { GlobeMarker } from '../../features/globe/MoonGlobeView';

const MoonGlobeView = lazy(() => import('../../features/globe/MoonGlobeView').then(m => ({ default: m.MoonGlobeView })));
const SceneViewport = lazy(() => import('../../scene/SceneViewport').then(m => ({ default: m.SceneViewport })));

export interface ScrubState { hour: number | null; set: (hour: number | null) => void }

const views: { id: View; label: string; icon: typeof Globe }[] = [
  { id: 'globe', label: 'Globe', icon: Globe },
  { id: '3d', label: 'Terrain 3D', icon: Box },
  { id: 'map', label: 'Polar map', icon: Map },
  { id: 'panorama', label: 'Panorama', icon: Mountain },
];

export function ViewPanel({ scenario, data, change, scrub }: { scenario: Scenario; data: DemoData; change: (patch: Partial<Scenario>) => void; scrub?: ScrubState }) {
  const markers = scenario.sites.flatMap((id, index) => {
    const site = data.sites.find(item => item.id === id);
    const coords = site ?? parseCustomSite(id);
    return coords ? [{ ...polarPoint(coords.lat, coords.lon), name: site?.name ?? 'Custom point', index }] : [];
  });
  const coverage = ephemCoverage(data.table);
  const scrubIso = scrub?.hour != null ? new Date(Date.parse(scenario.date) + scrub.hour * 3_600_000).toISOString() : scenario.date;
  const scrubInRange = !coverage || (Date.parse(scrubIso) >= Date.parse(coverage.start) && Date.parse(scrubIso) <= Date.parse(coverage.end));
  const ephemTime = scrubInRange ? scrubIso : scenario.date;
  const ephem = useMemo(() => ephemAt(data.table, ephemTime), [data.table, ephemTime]);
  const scrubActive = scrub?.hour != null;
  // Memoized so weight-slider ticks don't rebuild every globe marker.
  const globeMarkers = useMemo((): GlobeMarker[] => [
    ...scenario.sites.flatMap((id, index) => {
      const site = data.sites.find(item => item.id === id);
      const coords = site ?? parseCustomSite(id);
      if (!coords) return [];
      return [{ lat: coords.lat, lng: coords.lon, name: site?.name ?? 'Custom point', index, kind: 'site' as const, note: site?.note }];
    }),
    ...(ephem ? [
      { lat: ephem.sunLat, lng: ephem.sunLon, name: 'Sub-solar point', index: -1, kind: 'sun' as const, distanceKm: ephem.sunDistKm },
      { lat: ephem.earthLat, lng: ephem.earthLon, name: 'Sub-Earth point', index: -1, kind: 'earth' as const, distanceKm: ephem.earthDistKm },
    ] : []),
  ], [scenario.sites, data.sites, ephem]);
  const isGlobe = scenario.view === 'globe';
  const isTerrain = scenario.view === '3d' || scenario.view === 'map';
  const active = views.find(v => v.id === scenario.view)!;

  return <section className="vw" aria-labelledby="view-heading">
    <div className="vw-head">
      <h2 id="view-heading">{active.label}</h2>
      <div className="vw-tabs" role="group" aria-label="Environment view">
        {views.map(({ id, label, icon: Icon }) => <button key={id} aria-pressed={id === scenario.view} aria-label={label} title={label} onClick={() => change({ view: id })}><Icon size={13} aria-hidden="true" /><span>{label}</span></button>)}
      </div>
    </div>
    <div className="vw-stage">
      {isGlobe ? <Suspense fallback={<div className="terrain-empty"><div className="viewport-meta"><span>LOADING</span></div><div className="empty-caption"><h3>Loading the Moon…</h3></div></div>}>
        <MoonGlobeView markers={globeMarkers} timeLabel={ephemTime.slice(0, 16).replace('T', ' ') + ' UTC'} />
      </Suspense> : isTerrain ? <Suspense fallback={<div className="terrain-empty" role="status"><div className="viewport-meta"><span>LOADING</span></div><div className="empty-caption"><h3>Loading terrain…</h3></div></div>}>
        <SceneViewport
          view={scenario.view === 'map' ? 'map' : '3d'}
          date={ephemTime}
          table={data.table}
          onSiteSelect={id => change({ sites: [id, ...scenario.sites.filter(s => s !== id)].slice(0, 4) })}
          sites={scenario.sites.flatMap((id, index) => {
            const site = data.sites.find(item => item.id === id);
            const coords = site ?? parseCustomSite(id);
            return coords ? [{ id, name: site?.name ?? 'Custom point', lat: coords.lat, lon: coords.lon, index }] : [];
          })} />
      </Suspense> : <div className={`terrain-empty terrain-${scenario.view}`} key={scenario.view}>
        <div className="viewport-meta"><span>MOON_ME · 80–90°S</span><span>UTC {ephemTime.slice(0, 16).replace('T', ' ')}</span></div>
        <svg className="lunar-outline" viewBox="0 0 480 380" fill="none" role="img" aria-label={`Illustrative ${active.label.toLowerCase()} with ${markers.length} selected site markers`}>
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
        <div className="viewport-readout"><div><span>Selected</span><strong>{markers.length.toString().padStart(2, '0')}</strong></div><div><span>Window</span><strong>{scenario.hours} h</strong></div><div><span>Layer</span><strong>{active.label}</strong></div></div>
        <div className="empty-caption"><p>Visual orientation only. Terrain metrics come from horizon masks, not this illustration.</p></div>
      </div>}
    </div>
    {scrub && (isGlobe || isTerrain) && <div className="vw-scrub">
      <div className="vw-scrub-row">
        <span className="vw-scrub-time">{scrubActive ? `T+${scrub.hour} h · ${ephemTime.slice(0, 16).replace('T', ' ')} UTC` : 'Mission start'}</span>
        <button type="button" className="vw-scrub-live" onClick={() => scrub.set(null)} disabled={!scrubActive}>Live</button>
      </div>
      <input type="range" min={0} max={scenario.hours} step={1} value={scrub.hour ?? 0}
        aria-label="Scrub mission timeline" aria-valuetext={scrubActive ? `Hour ${scrub.hour} of ${scenario.hours}` : `Hour 0 of ${scenario.hours}`}
        onChange={event => scrub.set(Number(event.target.value))} />
      <div className="vw-scrub-scale"><span>0 h</span><span>{scenario.hours} h</span></div>
      {!scrubInRange && <p className="vw-scrub-note" role="status">Scrubbed time is outside the ephemeris table — markers hold the scenario start.</p>}
    </div>}
    <div className="vw-footer"><span><i className="legend-dot sun"/> Sun / power</span><span><i className="legend-dot earth"/> Earth / communications</span></div>
    <details className="method-note"><summary>How to read this</summary><p>At the lunar south pole, nearby terrain can block the Sun or Earth. Compare sites over the same time window before drawing conclusions.</p></details>
    {isGlobe && <p className="vw-caption"><span className="eyebrow">LUNAR SURFACE</span>LROC colour mosaic and LOLA elevation, NASA SVS. Numbered pins are scenario sites; S/E mark sub-solar and sub-Earth points at the scenario time.</p>}
    {isTerrain && <p className="vw-caption"><span className="eyebrow">REAL TERRAIN</span>LOLA elevation tiles and JPL Horizons lighting for the south-polar regions. Sites without shipped tiles show a synthetic preview.</p>}
  </section>;
}
