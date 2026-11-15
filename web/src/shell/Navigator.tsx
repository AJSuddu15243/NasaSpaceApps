import { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpenCheck, Columns3, MapPin, SlidersHorizontal } from 'lucide-react';
import { useShell } from './store';
import { MAX_SITES, type AnalysisLayer, type Scenario } from './scenario';
import { ScenarioPanel } from './components/ScenarioPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { MoonGlobeView, type GlobeMarker } from '../features/globe/MoonGlobeView';
import { customSiteId, formatCoordinates, parseCustomSite } from '../features/sites/sites';
import { MissionTimeline, scenarioInstant } from '../features/timeline/MissionTimeline';
import { NavigatorTour } from '../features/tour/NavigatorTour';
import { AnalysisPanel } from '../features/analysis/AnalysisPanel';
import { HoloStage } from '../features/heatmap/HoloStage';
import { HEAT_LAYERS, LAYERS, type HeatLayer } from '../features/heatmap/layers';
import { coveringRegion } from '../features/heatmap/specimen';
import { geographicPoint } from '../scene/coordinates';
import { isGridRegion } from '../features/heatmap/grid';
import { ScienceCompare } from '../features/compare/ScienceCompare';
import { BootSequence } from '../features/mission/BootSequence';
import { PrioritiesPanel } from '../features/mission/PrioritiesPanel';
import { useMissionData, useRegionResults } from '../features/mission/useMissionData';
import { sunEarthAt } from '../ephem';
import { useMediaQuery } from './useMediaQuery';
import type { Site } from '../contracts/sites';
import { syncRemoteScenarios } from '../scenarios/store';
import './workspace.css';
import './mission.css';

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
/** Tilted toward the south pole so the Artemis III regions are in view from the start. */
const POLE_VIEW = { lat: -62, lng: -20, altitude: 1.9 };

export default function Navigator() {
  const { scenario, warnings, setScenario } = useShell();
  const mission = useMissionData();
  const results = useRegionResults(mission.grids.data, scenario);
  const narrow = useMediaQuery('(max-width: 1439px)');
  const reducedMotion = useMediaQuery(reducedMotionQuery);
  const [booted, setBooted] = useState(false);
  const [globeReady, setGlobeReady] = useState(false);
  const [globeError, setGlobeError] = useState(false);
  const [globeAttempt, setGlobeAttempt] = useState(0);
  const [leftTab, setLeftTab] = useState<'sites' | 'priorities'>('sites');
  const [leftOpen, setLeftOpen] = useState(true);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [tourReplay, setTourReplay] = useState(0);
  const [feedback, setFeedback] = useState('');
  useEffect(() => { if (narrow) setLeftOpen(false); }, [narrow]);
  useEffect(() => { void syncRemoteScenarios(); }, []);

  // The bare catalogue shows first; the demo load swaps in notes carrying the mask elevation.
  const catalogue: Site[] = useMemo(() => (mission.demo.data?.sites ?? mission.sites.data).map(site => site.category === 'demo' ? { ...site, name: `${site.name} (synthetic demo)` } : site), [mission.demo.data, mission.sites.data]);
  const resolve = useCallback((id: string) => {
    const site = catalogue.find(item => item.id === id);
    if (site) return site;
    const point = parseCustomSite(id);
    return point ? { ...point, id, name: `Point ${formatCoordinates(point.lat, point.lon)}` } : undefined;
  }, [catalogue]);
  const focused = scenario.focus ? resolve(scenario.focus) : undefined;
  const covered = coveringRegion(mission.grids.data, focused);
  const region = covered ? results[covered] : undefined;
  const footprint = useMemo(() => {
    if (!region) return;
    const h = region.grid.header;
    return [[-.5, -.5], [h.nx - .5, -.5], [h.nx - .5, h.ny - .5], [-.5, h.ny - .5], [-.5, -.5]].map(([col, row]) => {
      const point = geographicPoint(h.x0 + col * h.cell_m, h.y0 + row * h.cell_m);
      return [point.lat, point.lon];
    });
  }, [region?.grid]);
  const instant = scenarioInstant(scenario);
  useEffect(() => {
    if (!scenario.focus && (scenario.view === 'map' || scenario.view === 'panorama')) {
      const id = scenario.sites.find(id => resolve(id));
      if (id) setScenario({ focus: id, layer: scenario.view === 'panorama' ? 'horizon' : 'terrain' }, true);
    }
  }, [scenario.focus, scenario.view, scenario.sites, resolve, setScenario]);

  const markers: GlobeMarker[] = useMemo(() => {
    const ids = [...new Set([...catalogue.filter(site => site.category !== 'demo').map(site => site.id), ...scenario.sites, ...(scenario.focus ? [scenario.focus] : [])])];
    return ids.flatMap((id, index) => {
      const point = resolve(id);
      return point ? [{ id, lat: point.lat, lng: point.lon, name: point.name, kind: 'site' as const, index, variant: isGridRegion(id) ? 'region' as const : id.startsWith('custom') ? 'point' as const : 'site' as const, active: id === scenario.focus }] : [];
    });
  }, [catalogue, resolve, scenario.sites, scenario.focus]);

  const inspect = useCallback((id: string, layer?: AnalysisLayer) => { setScenario({ focus: id, layer: layer ?? scenario.layer ?? 'terrain' }); setCompareOpen(false); setAnalysisOpen(false); setFeedback(''); if (narrow) setLeftOpen(false); }, [setScenario, scenario.layer, narrow]);
  const closeAnalysis = useCallback(() => setScenario({ focus: undefined, layer: undefined, view: 'globe' }), [setScenario]);
  const chooseHeat = (heat: HeatLayer) => {
    if (region) setScenario({ heat }, true);
    else if (!focused) setScenario({ heat, focus: 'connecting-ridge', layer: scenario.layer ?? 'terrain' });
    else { setFeedback('No measured heatmap covers this point. Choose a surveyed region.'); return; }
    setCompareOpen(false);
  };
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape' && booted) { closeAnalysis(); setCompareOpen(false); } };
    addEventListener('keydown', close);
    return () => removeEventListener('keydown', close);
  }, [closeAnalysis, booted]);
  const addFocused = () => {
    if (!focused || scenario.sites.includes(focused.id)) return;
    if (scenario.sites.length >= MAX_SITES) { setFeedback('Four-place limit reached. Remove one in Compare first.'); return; }
    setScenario({ sites: [...scenario.sites, focused.id] });
    setFeedback(`${focused.name} added to your comparison.`);
  };

  const telemetry = useMemo(() => sunEarthAt(instant), [instant]);
  const place = useMemo(() => {
    const p = focused ?? (scenario.sites[0] ? resolve(scenario.sites[0]) : undefined);
    return p ? { name: p.name, lat: p.lat, lon: p.lon } : undefined;
  }, [focused, scenario.sites, resolve]);
  const comparePlaces = useMemo(() => scenario.sites.flatMap(id => { const p = resolve(id); return p ? [{ id, name: p.name, lat: p.lat, lon: p.lon, region: (() => { const r = coveringRegion(mission.grids.data, p); return r ? results[r] : undefined; })() }] : []; }), [scenario.sites, resolve, results, mission.grids.data]);
  const engineInShortlist = scenario.sites.some(id => mission.demo.data?.masks.has(id));

  const bootLines = [
    { label: 'Lunar globe · LRO imagery', detail: globeReady ? 'ONLINE' : '', status: globeReady ? 'ready' as const : globeError ? 'error' as const : 'loading' as const },
    { label: 'LOLA terrain survey · 3 regions × 15,625 cells', detail: '160 m', status: mission.grids.status },
    { label: 'Sunlight · Earth visibility · permanent shadow', detail: 'PGDA 69', status: mission.grids.status },
    { label: 'Ephemeris · Astronomy Engine vs JPL Horizons', detail: 'GEOMETRIC', status: 'ready' as const },
    { label: 'Site catalogue', detail: mission.sites.status === 'ready' ? `${catalogue.length} SITES` : '', status: mission.sites.status },
  ];
  const change = useCallback((patch: Partial<Scenario>, replace?: boolean) => setScenario(patch, replace), [setScenario]);
  const tourStep = useCallback((anchor: string) => { setLeftOpen(anchor === 'sites'); if (anchor === 'sites') setLeftTab('sites'); }, []);
  const finishBoot = useCallback(() => setBooted(true), []);
  const globeOnline = useCallback(() => setGlobeReady(true), []);

  return <main id="main" className={`mission ${focused ? 'mission-focused' : ''} ${region ? 'mission-holo' : ''} ${booted ? 'mission-booted' : ''}`} tabIndex={-1}>
    <div className="mission-stars" aria-hidden="true" />
    <div className="mission-globe"><MoonGlobeView footprint={footprint} active={!region} key={globeAttempt} onError={() => setGlobeError(true)} markers={markers} overview={POLE_VIEW} focus={focused} focusAltitude={region ? 0.3 : 0.8} onReady={globeOnline} controlsHidden={!!region} onInspect={point => inspect(point.id ?? customSiteId(point.lat, point.lon))} /></div>
    <div className="mission-vignette" aria-hidden="true" />

    <header className="hud hud-top">
      <div className="hud-mode" data-tour="mode">
        <div role="group" aria-label="Experience mode">{(['explorer', 'planner'] as const).map(mode => <button type="button" key={mode} aria-pressed={scenario.mode === mode} onClick={() => { setScenario({ mode }); setLeftTab('priorities'); setLeftOpen(true); }}>{mode === 'explorer' ? 'Explorer' : 'Planner'}</button>)}</div>
        <p>{scenario.mode === 'explorer' ? 'Plain-language guide: pick a mission goal, read the story.' : 'Exact numbers: tune weights, limits, export data.'}</p>
      </div>
      <dl className="hud-telemetry" aria-label="Telemetry at the playhead">
        <div><dt>UTC</dt><dd>{instant.slice(0, 16).replace('T', ' ')}</dd></div>
        <div className="t-sun"><dt>Sub-solar</dt><dd>{telemetry.sun_lat.toFixed(2)}°, {telemetry.sun_lon.toFixed(1)}°</dd></div>
        <div className="t-earth"><dt>Earth wobble</dt><dd>{telemetry.earth_lat.toFixed(2)}°, {telemetry.earth_lon.toFixed(2)}°</dd></div>
        <div><dt>Earth range</dt><dd>{Math.round(telemetry.earth_dist_km).toLocaleString()} km</dd></div>
      </dl>
      <button type="button" className="hud-link" onClick={() => setTourReplay(n => n + 1)}>Replay briefing</button>
    </header>

    {(leftOpen || !narrow) && <aside className="hud hud-left" data-tour="sites" aria-label="Sites and priorities">
      <div className="hud-tabs" role="tablist" aria-label="Left panel">
        <button type="button" role="tab" aria-selected={leftTab === 'sites'} onClick={() => setLeftTab('sites')}>Sites <span>{scenario.sites.length}/{MAX_SITES}</span></button>
        <button type="button" role="tab" aria-selected={leftTab === 'priorities'} onClick={() => setLeftTab('priorities')}>Priorities</button>
        {narrow && <button type="button" className="hud-close" aria-label="Close panel" onClick={() => setLeftOpen(false)}>×</button>}
      </div>
      <div className="hud-scroll" role="tabpanel">
        {leftTab === 'sites' ? <ScenarioPanel scenario={scenario} data={{ sites: catalogue }} change={change} onInspect={id => inspect(id)} />
          : <PrioritiesPanel scenario={scenario} change={change} results={results} />}
      </div>
    </aside>}
    {narrow && !leftOpen && <button type="button" className="hud-fab" onClick={() => setLeftOpen(true)}><MapPin size={16} /> Sites & priorities</button>}

    {region && focused && <div className="mission-holo-wrap" key={focused.id}>
      <HoloStage name={focused.name} grid={region.grid} heat={scenario.heat} scores={region.scores} areas={region.areas} slopeLimit={scenario.slopeLimit} reducedMotion={reducedMotion} date={instant} view={scenario.view} onView={view => setScenario({ view }, true)} onHeat={heat => setScenario({ heat }, true)} onClose={closeAnalysis} />
    </div>}

    {focused && !compareOpen && (!narrow || analysisOpen) && <div className="hud hud-right mission-analysis" key={`a-${focused.id}`}>
      <AnalysisPanel location={focused} date={instant} layer={scenario.layer ?? 'terrain'} mode={scenario.mode} region={region} slopeLimit={scenario.slopeLimit}
        onLayerChange={layer => setScenario({ layer }, true)} onClose={closeAnalysis} onAdd={addFocused} canAdd={scenario.sites.length < MAX_SITES && !scenario.sites.includes(focused.id)} feedback={feedback} />
    </div>}
    {focused && narrow && <button type="button" className="hud-fab hud-inspector" aria-expanded={analysisOpen} onClick={() => setAnalysisOpen(v => !v)}>{analysisOpen ? 'Close analysis' : 'Why this place?'}</button>}
    {compareOpen && <div className="hud hud-right mission-comparison">
      <header className="analysis-heading"><div><span className="eyebrow">SHORTLIST · {scenario.sites.length}/{MAX_SITES}</span><h2>Compare places</h2></div><button type="button" onClick={() => setCompareOpen(false)} aria-label="Close comparison">×</button></header>
      <ScienceCompare places={comparePlaces} date={instant} onInspect={id => inspect(id)} onRemove={id => setScenario({ sites: scenario.sites.filter(s => s !== id) })} />
      {engineInShortlist && mission.demo.data && <details className="demo-results" open><summary>Engine results (Sun, Earth, thermal)</summary><ResultsPanel data={{ ...mission.demo.data, sites: catalogue }} scenario={{ ...scenario, date: new Date(Date.parse(scenario.date) + (scenario.delay ?? 0) * 86400000).toISOString() }} /></details>}
    </div>}
    {!focused && !compareOpen && booted && <section className="mission-intro" aria-label="Getting started">
      <p className="eyebrow">LUNAR SOUTH POLE · ARTEMIS III REGIONS</p>
      <h1>Find your<br /><em>window.</em></h1>
      <p>Where should we land, and when? Sunlight for power, a line of sight to Earth for radio, safe ground, and water ice nearby, all moving with the date.</p>
      <button type="button" onClick={() => inspect('connecting-ridge', 'terrain')}>Survey Connecting Ridge <span aria-hidden="true">↗</span></button>
      <small>or click a pulsing region on the Moon</small>
    </section>}

    <nav className="hud hud-dock" aria-label="Heatmap layers and tools" data-tour="layers">
      <div className="dock-layers" role="group" aria-label="Heatmap layer">
        {HEAT_LAYERS.map(key => <button type="button" key={key} aria-pressed={!!region && scenario.heat === key} onClick={() => chooseHeat(key)} title={LAYERS[key].label}><i style={{ background: LAYERS[key].ramp[2] }} />{LAYERS[key].short}</button>)}
      </div>
      <div className="dock-tools" data-tour="evidence">
        <button type="button" aria-expanded={compareOpen} onClick={() => setCompareOpen(v => !v)}><Columns3 size={15} /> Compare <span>{scenario.sites.length}</span></button>
        <button type="button" onClick={() => { inspect(focused?.id ?? 'connecting-ridge', 'evidence'); setAnalysisOpen(true); }}><BookOpenCheck size={15} /> Evidence</button>
        <button type="button" className="dock-priorities" onClick={() => { setLeftTab('priorities'); setLeftOpen(true); }}><SlidersHorizontal size={15} /> Priorities</button>
      </div>
    </nav>

    <div className="hud hud-bottom"><MissionTimeline scenario={scenario} change={change} place={place} /></div>

    {(warnings.length > 0 || (scenario.focus && !focused) || mission.grids.error) && <div className="notice mission-notice" role="alert">{mission.grids.error && <p>Some science grids could not load: {mission.grids.error} <button onClick={mission.retry}>Retry science grids</button></p>}{warnings.map(warning => <p key={warning}>{warning}</p>)}{scenario.focus && !focused && <p>This focused location is unavailable. Choose a region or click the Moon.</p>}</div>}
    {!booted && <BootSequence lines={bootLines} onDone={finishBoot} onRetry={() => { mission.retry(); if (globeError) { setGlobeError(false); setGlobeAttempt(n => n + 1); } }} />}
    <NavigatorTour enabled={booted} replayKey={tourReplay} onStep={tourStep} />
  </main>;
}
