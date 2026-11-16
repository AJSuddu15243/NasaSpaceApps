import { Globe, Layers, Map as MapIcon, Mountain, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Grid } from './grid';
import { cellLatLon } from './grid';
import { probeIndex } from './specimen';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../design';
import { displayRange, LAYERS, STACK, SURFACE_LAYERS, TERRAIN_LAYERS, layerSpec, layerValues, type HeatLayer, type ScoreSource, type WindowFracs } from './layers';
import { scalarTexture } from './scalarTexture';
import { formatCoordinates } from '../sites/sites';
import { useTerrainData } from '../../scene/useTerrainData';
import { useSceneVisibility } from '../../scene/useSceneVisibility';
import { sunEarthAt } from '../../ephem';
import { bodyDirection, tileFrame } from '../../scene/coordinates';
import { Vector3 } from 'three';
import { elevationRange } from '../../scene/localTerrain';
import './holo.css';

const StrataView = lazy(() => import('./StrataView').then(m => ({ default: m.StrataView })));
const LunarScene = lazy(() => import('../../scene/LunarScene').then(m => ({ default: m.LunarScene })));
function webglAvailable() {
  try { const c = document.createElement('canvas'); const gl = c.getContext('webgl2') || c.getContext('webgl'); if (!gl) return false; gl.getExtension('WEBGL_lose_context')?.loseContext(); return true; } catch { return false; }
}

export interface HeatRequest { heat: HeatLayer; pick: number }
/** Layer to show after the parent's heat or pick counter changed: a new request settles its layer, even the same one again
 * (a preset, a weight drag or a dock click re-picks the current heat); otherwise keep what is shown (null = the anatomy stack). */
export function shownLayer(prev: HeatRequest, next: HeatRequest, current: HeatLayer | null): HeatLayer | null {
  return prev.heat !== next.heat || prev.pick !== next.pick ? next.heat : current;
}

/** Real terrain is the persistent specimen; scientific overlays expand above it and dock on selection. */
export function HoloStage({ name, grid, heat, heatPick = 0, onShown, scores, source = 'preview', window, computing = false, slopeLimit, reducedMotion, date, sunLit, view, onView, onHeat, onClose, tourResetKey = 0 }: {
  name: string; grid: Grid; heat: HeatLayer;
  /** Bumped by the parent on every explicit heat request; a pick made before this stage mounted opens on that layer. */
  heatPick?: number; onShown?: (layer: HeatLayer | null) => void; scores: Float32Array; source?: ScoreSource; window?: WindowFracs; computing?: boolean; slopeLimit: number; reducedMotion: boolean; date: string;
  /** Engine sun_lit (0..1, visible solar disk over the terrain horizon) at the focused place and playhead; undefined = plane test only. */
  sunLit?: number;
  view: import('../../shell/scenario').View; onView: (view: 'map' | '3d') => void; onClose: () => void;
  onHeat: (layer: HeatLayer) => void; tourResetKey?: number;
}) {
  const [selected, setSelected] = useState<HeatLayer | null>(() => new URLSearchParams(location.search).has('heat') ? heat : null);
  const [probe, setProbe] = useState<number | null>(null);
  const [resetKey, setReset] = useState(0);
  const [contours, setContours] = useState(false);
  const [exaggeration, setExaggeration] = useState<1 | 2>(1);
  const [opacity, setOpacity] = useState(0.9);
  const [stackCount, setStackCount] = useState(1);
  const previousTourReset = useRef(tourResetKey);
  useEffect(() => {
    if (previousTourReset.current === tourResetKey) return;
    previousTourReset.current = tourResetKey;
    setSelected(null); setStackCount(1); setProbe(null);
  }, [tourResetKey]);
  const map = view === 'map';
  const [failedImage, setFailedImage] = useState('');
  const [attempt, setAttempt] = useState(0);
  const { hostRef, active } = useSceneVisibility();
  const centre = useMemo(() => ({ id: grid.header.region, ...cellLatLon(grid.header, Math.floor(grid.header.nx * grid.header.ny / 2)) }), [grid]);
  const terrain = useTerrainData(centre, attempt);
  const labels = useRef<(HTMLElement | null)[]>([]);
  const gl = useMemo(webglAvailable, []);
  useEffect(() => {
    if (!terrain.ready) { setStackCount(1); return; }
    if (!gl || map || selected !== null || stackCount >= STACK.length) return;
    const frame = requestAnimationFrame(() => setStackCount(count => Math.min(STACK.length, count + 1)));
    return () => cancelAnimationFrame(frame);
  }, [terrain.ready, gl, map, selected, stackCount]);
  const previousHeat = useRef<HeatRequest>({ heat, pick: 0 });
  useEffect(() => { onShown?.(selected); }, [selected, onShown]);
  const imageryError = useCallback(() => setFailedImage(grid.header.region), [grid.header.region]);
  const available = useCallback((key: HeatLayer) => key === 'relief' || (key === 'imagery' ? !!terrain.assets?.imagery && failedImage !== grid.header.region : key === 'slope' ? !!terrain.assets?.slope : !!layerValues(grid, key, scores, window)), [terrain.assets, failedImage, grid, scores, window]);
  // Dock clicks set heat without knowing this region's assets: gate asset-backed layers here, once terrain has loaded.
  useEffect(() => {
    const old = previousHeat.current; const next = { heat, pick: heatPick };
    if (shownLayer(old, next, null) === null) return;
    const assetBacked = heat === 'imagery' || TERRAIN_LAYERS.includes(heat);
    if (assetBacked && !terrain.ready) return;
    setProbe(null);
    if (!assetBacked || available(heat)) { previousHeat.current = next; setSelected(heat); return; }
    if (heat === 'imagery' && selected !== 'imagery') { previousHeat.current = { heat: old.heat, pick: heatPick }; onHeat(old.heat); return; } // keep the current layer
    previousHeat.current = { heat: 'relief', pick: heatPick }; setSelected('relief'); onHeat('relief');
  }, [heat, heatPick, terrain.ready, available, selected, onHeat]);
  const select = (key: HeatLayer) => { if (available(key)) { setSelected(key); setProbe(null); onHeat(key); } };
  const spec = layerSpec(selected ?? 'relief', source);
  const legendRamp = selected === 'slope' || selected === 'elevation' ? ['#00204d', '#1e4c78', '#466f6a', '#9d9252', '#fde725'] : spec.ramp;
  const ranges = useMemo(() => Object.fromEntries(STACK.map(key => {
    const values = layerValues(grid, key, scores, window);
    if (key === 'elevation' && terrain.tile) return [key, elevationRange(terrain.tile)];
    return [key, key === 'score' || key === 'sun' || key === 'earth' || key === 'sun_lt' || key === 'earth_lt' || key === 'ice' || key === 'favorability' ? [0, 1] : key === 'slope' ? [0, 30] : values ? displayRange(values) : [0, 1]];
  })) as Record<HeatLayer, [number, number]>, [grid, scores, window, terrain.tile]);
  const ephem = useMemo(() => sunEarthAt(date), [date]);
  const simulationRef = useRef({ sunDirection: bodyDirection(ephem.sun_lat, ephem.sun_lon), earthDirection: bodyDirection(ephem.earth_lat, ephem.earth_lon) });
  simulationRef.current = { sunDirection: bodyDirection(ephem.sun_lat, ephem.sun_lon), earthDirection: bodyDirection(ephem.earth_lat, ephem.earth_lon) };
  const sunDir = useMemo((): [number, number, number] => {
    if (!terrain.tile) return [0, 1, 0];
    const frame = tileFrame(terrain.tile), sun = new Vector3(...simulationRef.current.sunDirection);
    return [sun.dot(frame.right), sun.dot(frame.normal), -sun.dot(frame.up)];
  }, [terrain.tile, ephem]);
  const values = selected ? layerValues(grid, selected, scores, window) : undefined;
  const windowLayer = (key: HeatLayer | null) => key === 'score' || key === 'sun' || key === 'earth';
  const pending = (key: HeatLayer) => (key === 'sun' || key === 'earth') && !window ? (computing ? ' · computing' : ' · engine unavailable') : ' · unavailable';
  const cell = probe !== null ? { ...cellLatLon(grid.header, probe), value: values?.[probe] } : null;
  const surfaceLayer = selected === 'imagery' || selected === 'slope' || selected === 'elevation' ? selected : 'relief';
  const scalarValues = map && selected && !SURFACE_LAYERS.includes(selected) ? values : undefined;
  const scalarRange = selected ? ranges[selected] : undefined;
  const scalarMap = useMemo(() => selected && terrain.tile && scalarValues && scalarRange
    ? scalarTexture(grid, terrain.tile, scalarValues, scalarRange, LAYERS[selected].ramp) : undefined,
  [grid, selected, terrain.tile, scalarValues, scalarRange]);
  useEffect(() => () => scalarMap?.dispose(), [scalarMap]);
  return <section ref={hostRef} className="holo-stage" aria-label={`Terrain survey of ${name}`} data-layer={selected ?? 'stack'}>
    <div className="holo-frame" aria-hidden="true"><i/><i/><i/><i/></div>
    <header className="holo-title">
      <span className="holo-eyebrow">LUNAR SPECIMEN / {name.toUpperCase()}</span>
      <h2>{selected ? spec.label : 'Anatomy of a landing site'}</h2>
      <span className={`holo-status holo-status-${spec.status}`}>{windowLayer(selected) ? (source === 'preview' ? (computing ? 'PREVIEW · ENGINE COMPUTING' : 'PREVIEW · ENGINE UNAVAILABLE') : `RUST/WASM ENGINE · ${source.toUpperCase()}`) : spec.status === 'proxy' ? 'PROXY' : selected === 'favorability' ? 'USGS GEOLOGIC MODEL' : 'NASA SOURCE DATA'}</span>
      <TooltipProvider delayDuration={200}><div className="specimen-controls" data-tour="terrain-controls" role="toolbar" aria-label="Terrain controls">
        <Tooltip><TooltipTrigger asChild><button type="button" onClick={() => { setStackCount(1); setSelected(null); onView('3d'); setProbe(null); }} aria-pressed={selected === null && !map} aria-label="All layers"><Layers size={14} /><span>All layers</span></button></TooltipTrigger><TooltipContent>Show every heatmap layer stacked in 3D</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button type="button" onClick={() => onView(map ? '3d' : 'map')} aria-pressed={map} aria-label={map ? 'Switch to 3D view' : 'Polar map'}>{map ? <Mountain size={14} /> : <MapIcon size={14} />}<span>{map ? 'Terrain 3D' : 'Polar map'}</span></button></TooltipTrigger><TooltipContent>{map ? 'Back to the 3D terrain' : 'Flat top-down polar map of this region'}</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button type="button" onClick={() => setReset(n => n + 1)} aria-label="Reset view"><RotateCcw size={14} /><span>Reset view</span></button></TooltipTrigger><TooltipContent>Reset camera</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><button type="button" onClick={onClose} aria-label="Return to globe"><Globe size={14} /><span>Return to globe</span></button></TooltipTrigger><TooltipContent>Return to the Moon view</TooltipContent></Tooltip>
        <details className="display-menu">
          <summary aria-label="Display options" title="Display options"><SlidersHorizontal size={14} /><span>Display options</span></summary>
          <div className="display-pop">
            <Tooltip><TooltipTrigger asChild><label className="display-toggle"><input type="checkbox" checked={contours} onChange={e => setContours(e.target.checked)} /> 100 m contours</label></TooltipTrigger><TooltipContent side="left">Draw elevation contour lines every 100 m</TooltipContent></Tooltip>
            <label className="display-toggle"><input type="checkbox" checked={exaggeration === 2} onChange={e => setExaggeration(e.target.checked ? 2 : 1)} /> Relief ×2</label>
            {selected === 'slope' && <label className="display-slider">Overlay opacity <input aria-label="Overlay opacity" type="range" min={0.1} max={1} step={0.05} value={opacity} onChange={e => setOpacity(Number(e.target.value))} /></label>}
          </div>
        </details>
      </div></TooltipProvider>
    </header>
    <div className="holo-canvas">
      {selected && !SURFACE_LAYERS.includes(selected) && !values && <p className="holo-loading" role="status">{LAYERS[selected].short}{pending(selected)}</p>}
      {!terrain.ready ? <p className="holo-loading" role="status">Retrieving LOLA terrain and orbital imagery…</p>
        : terrain.error || !terrain.tile ? <div className="holo-loading" role="alert"><p>{terrain.error ?? 'No measured terrain covers this point.'}</p><button onClick={() => setAttempt(n => n + 1)}>Retry terrain</button></div>
        : !gl ? <p className="holo-loading" role="status">3D unavailable. Layer descriptions, ranked areas and cell values remain available below.</p>
        : <Suspense fallback={<p className="holo-loading" role="status">Preparing specimen…</p>}>
          {map ? <LunarScene active={active} tile={terrain.tile} assets={failedImage ? { ...terrain.assets!, imagery: undefined } : terrain.assets} view="map" layer={surfaceLayer} scalarMap={scalarMap} contoursEnabled={contours} exaggeration={exaggeration} resetKey={resetKey} overlayOpacity={opacity} simulationRef={simulationRef} timeKey={date} onImageryError={imageryError} onProbe={(u, v) => setProbe(probeIndex(grid, terrain.tile!, u, v))}/>
            : <StrataView active={active} resetKey={resetKey} contours={contours} exaggeration={exaggeration} overlayOpacity={opacity} onImageryError={imageryError}
              grid={grid} tile={terrain.tile} assets={failedImage ? { ...terrain.assets!, imagery: undefined } : terrain.assets} scores={scores} window={window} ranges={ranges} selected={selected} stackCount={stackCount} onSelect={select} onProbe={setProbe} sunDir={sunDir} sunLit={sunLit} reducedMotion={reducedMotion} labelRefs={labels}/>}
        </Suspense>}
      {!map && selected === null && terrain.ready && gl && <div className="strata-labels" aria-label="Exploded terrain layers">{STACK.map((key, i) => <button key={key} ref={el => { labels.current[i] = el; }} disabled={!available(key)} onClick={() => select(key)}><span>{String(i + 1).padStart(2, '0')}</span>{LAYERS[key].short}{!available(key) && pending(key)}</button>)}</div>}
    </div>
    <footer className="holo-footer">
      {selected && TERRAIN_LAYERS.includes(selected) && <div className="terrain-switch" data-tour="terrain-sublayers" role="group" aria-label="Terrain layer">{TERRAIN_LAYERS.map(key => <button type="button" key={key} disabled={!available(key)} aria-pressed={selected === key} onClick={() => select(key)}>{LAYERS[key].short}</button>)}</div>}
      {selected && <>{!['imagery', 'relief'].includes(selected) && <div className="holo-legend"><span>{spec.format(ranges[selected][0])}</span><i style={{ background: `linear-gradient(90deg, ${legendRamp.join(',')})` }}/><span>{spec.format(ranges[selected][1])}{selected === "slope" ? "+" : ""}</span>{selected === 'slope' && <span>White contour: 10° reference · mission limit: {slopeLimit}°</span>}</div>}<p className="specimen-explain">{spec.explain} <span>{spec.caveat}</span></p></>}
      <p className="holo-probe" data-tour="survey-readout" role="status">{cell ? <><b>{formatCoordinates(cell.lat, cell.lon)}</b><span>{cell.value !== undefined && Number.isFinite(cell.value) ? spec.format(cell.value) : 'No scalar value for this layer'}</span></> : <span>{selected ? 'Drag to orbit · scroll/pinch to zoom · hover to probe' : 'Choose a floating layer to settle it onto the ground'}</span>}</p>
      <label className="specimen-cell">Inspect cell <input aria-label="Inspect grid cell" type="number" min={0} max={grid.header.nx * grid.header.ny - 1} value={probe ?? ''} placeholder={`0–${grid.header.nx * grid.header.ny - 1}`} onChange={e => { const n = e.target.valueAsNumber; setProbe(Number.isInteger(n) && n >= 0 && n < grid.header.nx * grid.header.ny ? n : null); }}/></label>
      <p className="specimen-caption">LOLA 80 m terrain · science cells 160 m · relief normalized for display, ×{exaggeration} · cutaway depth illustrative, no subsurface measurements.</p>
      {terrain.assets?.notices.map(note => <p className="specimen-caption" key={note}>{note}</p>)}
      {failedImage && <p role="alert" className="specimen-caption">NAC image unavailable. Other measured layers remain usable.</p>}
    </footer>
  </section>;
}
