import { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpenCheck, ChevronDown, ChevronUp, ChevronLeft, Columns3, MapPin, RotateCcw, ScanSearch, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../design';
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
import { AskPanel } from '../ask/AskPanel';
import './workspace.css';
import './mission.css';

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
/** Tilted toward the south pole so the Artemis III regions are in view from the start. */
const POLE_VIEW = { lat: -62, lng: -20, altitude: 1.9 };

export default function Navigator() {
  const { scenario, warnings, setScenario } = useShell();
  const mission = useMissionData();
  const results = useRegionResults(mission.grids.data, scenario, mission.demo.data?.table);
  const narrow = useMediaQuery('(max-width: 1439px)');
  const reducedMotion = useMediaQuery(reducedMotionQuery);
  const [booted, setBooted] = useState(false);
  const [globeReady, setGlobeReady] = useState(false);
  const [globeError, setGlobeError] = useState(false);
  const [globeAttempt, setGlobeAttempt] = useState(0);
  const [leftTab, setLeftTab] = useState<'sites' | 'priorities'>('sites');
  const [leftOpen, setLeftOpen] = useState(true);
  const [bottomOpen, setBottomOpen] = useState(true);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [tourReplay, setTourReplay] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [askOpen, setAskOpen] = useState(false);
  const [solgCast, setSolgCast] = useState(false);
  useEffect(() => { if (narrow) setLeftOpen(false); }, [narrow]);
  useEffect(() => { void syncRemoteScenarios(); }, []);
  useEffect(() => {
    const open = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setAskOpen(true); } };
    addEventListener('keydown', open);
    return () => removeEventListener('keydown', open);
  }, []);

  // The bare catalogue shows first; the demo load swaps in notes carrying the mask elevation.
  const catalogue: Site[] = useMemo(() => (mission.demo.data?.sites ?? mission.sites.data).map(site => site.category === 'demo' ? { ...site, name: `${site.name} (synthetic demo)` } : site), [mission.demo.data, mission.sites.data]);
  const engineData = useMemo(() => mission.demo.data && { ...mission.demo.data, sites: catalogue }, [mission.demo.data, catalogue]);
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
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape' && booted) { closeAnalysis(); setCompareOpen(false); setAskOpen(false); } };
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
  const askContext = useMemo(() => [
    'Lunar Window — lunar landing site navigator (NASA Space Apps). The user is looking at the 3D Moon workspace.',
    `Mode: ${scenario.mode} · View: ${scenario.view} · heat layer: ${scenario.heat ? LAYERS[scenario.heat].label : 'none'}`,
    `Mission: landing ${scenario.date}${scenario.delay ? ` (+${scenario.delay}d launch delay)` : ''} for ${scenario.hours}h`,
    `Playhead UTC: ${instant} · sub-solar ${telemetry.sun_lat.toFixed(2)}°,${telemetry.sun_lon.toFixed(1)}° · Earth ${telemetry.earth_lat.toFixed(2)}°,${telemetry.earth_lon.toFixed(2)}° @ ${Math.round(telemetry.earth_dist_km)} km`,
    focused ? `Focused site: ${focused.name} (${focused.lat.toFixed(3)}°, ${focused.lon.toFixed(3)}°)${region ? ` · surveyed region ${covered ?? ''} loaded` : ' · no terrain survey loaded'}` : 'No site focused — globe overview of the south pole.',
    comparePlaces.length ? `Comparing: ${comparePlaces.map(p => `${p.name} (${p.lat.toFixed(2)}°,${p.lon.toFixed(2)}°)`).join('; ')}` : '',
  ].filter(Boolean).join('\n'), [scenario.mode, scenario.view, scenario.heat, scenario.date, scenario.delay, scenario.hours, instant, telemetry, focused, region, covered, comparePlaces]);

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
      <TooltipProvider delayDuration={200}>
        <div className="hud-actions">
          <Tooltip><TooltipTrigger asChild><button type="button" className={`hud-icon solg-btn${solgCast ? ' is-casting' : ''}`} aria-label="Ask Solgaleo, the lunar copilot" aria-expanded={askOpen}
            onClick={() => { setSolgCast(true); setTimeout(() => setSolgCast(false), 750); setAskOpen(v => !v); }}><Sparkles size={15} /></button></TooltipTrigger><TooltipContent>Solgaleo · ask about what you see</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><button type="button" className="hud-icon" aria-label="Replay mission briefing" onClick={() => setTourReplay(n => n + 1)}><RotateCcw size={15} /></button></TooltipTrigger><TooltipContent>Replay briefing</TooltipContent></Tooltip>
        </div>
      </TooltipProvider>
    </header>

    {leftOpen && <aside className="hud hud-left" data-tour="sites" aria-label="Sites and priorities">
      <div className="hud-tabs" role="tablist" aria-label="Left panel">
        <button type="button" role="tab" aria-selected={leftTab === 'sites'} onClick={() => setLeftTab('sites')}>Sites <span>{scenario.sites.length}/{MAX_SITES}</span></button>
        <button type="button" role="tab" aria-selected={leftTab === 'priorities'} onClick={() => setLeftTab('priorities')}>Priorities</button>
        <TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild><button type="button" className="hud-min" aria-label="Minimize panel" onClick={() => setLeftOpen(false)}><ChevronLeft size={14} /></button></TooltipTrigger><TooltipContent>Minimize</TooltipContent></Tooltip></TooltipProvider>
      </div>
      <div className="hud-scroll" role="tabpanel">
        {leftTab === 'sites' ? <ScenarioPanel scenario={scenario} data={{ sites: catalogue }} change={change} onInspect={id => inspect(id)} />
          : <PrioritiesPanel scenario={scenario} change={change} results={results} />}
      </div>
    </aside>}
    {!leftOpen && <TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild><button type="button" className="hud-fab" aria-label="Open sites and priorities" onClick={() => setLeftOpen(true)}><MapPin size={16} /></button></TooltipTrigger><TooltipContent>Sites &amp; priorities</TooltipContent></Tooltip></TooltipProvider>}

    {region && focused && <div className="mission-holo-wrap" key={focused.id}>
      <HoloStage name={focused.name} grid={region.grid} heat={scenario.heat} scores={region.scores} areas={region.areas} source={region.source} slopeLimit={scenario.slopeLimit} reducedMotion={reducedMotion} date={instant} view={scenario.view} onView={view => setScenario({ view }, true)} onHeat={heat => setScenario({ heat }, true)} onClose={closeAnalysis} />
    </div>}

    {focused && !compareOpen && (!narrow || analysisOpen) && <div className="hud hud-right mission-analysis" key={`a-${focused.id}`}>
      <AnalysisPanel location={focused} date={instant} layer={scenario.layer ?? 'terrain'} mode={scenario.mode} region={region} slopeLimit={scenario.slopeLimit}
        onLayerChange={layer => setScenario({ layer }, true)} onClose={closeAnalysis} onAdd={addFocused} canAdd={scenario.sites.length < MAX_SITES && !scenario.sites.includes(focused.id)} feedback={feedback} />
    </div>}
    {focused && narrow && <TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild><button type="button" className="hud-fab hud-inspector" aria-expanded={analysisOpen} aria-label={analysisOpen ? 'Close analysis' : 'Why this place?'} onClick={() => setAnalysisOpen(v => !v)}>{analysisOpen ? <X size={16} /> : <ScanSearch size={16} />}</button></TooltipTrigger><TooltipContent>{analysisOpen ? 'Close analysis' : 'Why this place?'}</TooltipContent></Tooltip></TooltipProvider>}
    {compareOpen && <div className="hud hud-right mission-comparison">
      <header className="analysis-heading"><div><span className="eyebrow">SHORTLIST · {scenario.sites.length}/{MAX_SITES}</span><h2>Compare places</h2></div><button type="button" onClick={() => setCompareOpen(false)} aria-label="Close comparison">×</button></header>
      <ScienceCompare places={comparePlaces} date={instant} onInspect={id => inspect(id)} onRemove={id => setScenario({ sites: scenario.sites.filter(s => s !== id) })} />
      {engineInShortlist && engineData && <details className="demo-results" open><summary>Engine results (Sun, Earth, thermal)</summary><ResultsPanel data={engineData} scenario={scenario} /></details>}
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
        <TooltipProvider delayDuration={200}>
          <Tooltip><TooltipTrigger asChild><button type="button" aria-expanded={compareOpen} onClick={() => setCompareOpen(v => !v)} aria-label={`Compare sites (${scenario.sites.length})`}><Columns3 size={15} /><span className="dock-count">{scenario.sites.length}</span></button></TooltipTrigger><TooltipContent>Compare sites ({scenario.sites.length}/{MAX_SITES})</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><button type="button" onClick={() => { inspect(focused?.id ?? 'connecting-ridge', 'evidence'); setAnalysisOpen(true); }} aria-label="Evidence"><BookOpenCheck size={15} /></button></TooltipTrigger><TooltipContent>Evidence &amp; sources</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><button type="button" className="dock-priorities" onClick={() => { setLeftTab('priorities'); setLeftOpen(true); }} aria-label="Mission priorities"><SlidersHorizontal size={15} /></button></TooltipTrigger><TooltipContent>Mission priorities</TooltipContent></Tooltip>
        </TooltipProvider>
      </div>
    </nav>

    {bottomOpen
      ? <div className="hud hud-bottom"><MissionTimeline scenario={scenario} change={change} place={place} />
          <TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild><button type="button" className="hud-min hud-min-bottom" aria-label="Minimize timeline" onClick={() => setBottomOpen(false)}><ChevronDown size={14} /></button></TooltipTrigger><TooltipContent>Minimize timeline</TooltipContent></Tooltip></TooltipProvider>
        </div>
      : <TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild><button type="button" className="hud-fab hud-fab-bottom" aria-label="Show mission timeline" onClick={() => setBottomOpen(true)}><ChevronUp size={16} /></button></TooltipTrigger><TooltipContent>Mission timeline</TooltipContent></Tooltip></TooltipProvider>}
    {askOpen && <AskPanel context={askContext} onClose={() => setAskOpen(false)} onReplay={() => setTourReplay(n => n + 1)} />}

    {(warnings.length > 0 || (scenario.focus && !focused) || mission.grids.error) && <div className="notice mission-notice" role="alert">{mission.grids.error && <p>Some science grids could not load: {mission.grids.error} <button onClick={mission.retry}>Retry science grids</button></p>}{warnings.map(warning => <p key={warning}>{warning}</p>)}{scenario.focus && !focused && <p>This focused location is unavailable. Choose a region or click the Moon.</p>}</div>}
    {!booted && <BootSequence lines={bootLines} onDone={finishBoot} onRetry={() => { mission.retry(); if (globeError) { setGlobeError(false); setGlobeAttempt(n => n + 1); } }} />}
    <NavigatorTour enabled={booted} replayKey={tourReplay} onStep={tourStep} />
  </main>;
}
