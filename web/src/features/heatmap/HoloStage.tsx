import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Grid } from './grid';
import { cellLatLon } from './grid';
import { displayRange, LAYERS, STACK, layerValues, scoreLayer, type HeatLayer, type ScoreSource } from './layers';
import type { PreviewArea } from './score';
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

/** Real terrain is the persistent specimen; scientific overlays expand above it and dock on selection. */
export function HoloStage({ name, grid, heat, scores, areas, source = 'preview', slopeLimit, reducedMotion, date, view, onView, onHeat, onClose }: {
  name: string; grid: Grid; heat: HeatLayer; scores: Float32Array; areas: PreviewArea[]; source?: ScoreSource; slopeLimit: number; reducedMotion: boolean; date: string;
  view: import('../../shell/scenario').View; onView: (view: 'map' | '3d') => void;
  onHeat: (layer: HeatLayer) => void; onClose: () => void;
}) {
  const [selected, setSelected] = useState<HeatLayer | null>(() => new URLSearchParams(location.search).has('heat') ? heat : null);
  const [probe, setProbe] = useState<number | null>(null);
  const [resetKey, setReset] = useState(0);
  const [contours, setContours] = useState(false);
  const [exaggeration, setExaggeration] = useState<1 | 2>(1);
  const [opacity, setOpacity] = useState(0.9);
  const map = view === 'map';
  const [failedImage, setFailedImage] = useState('');
  const [attempt, setAttempt] = useState(0);
  const { hostRef, active } = useSceneVisibility();
  const centre = useMemo(() => ({ id: grid.header.region, ...cellLatLon(grid.header, Math.floor(grid.header.nx * grid.header.ny / 2)) }), [grid]);
  const terrain = useTerrainData(centre, attempt);
  const labels = useRef<(HTMLElement | null)[]>([]);
  const areaLabels = useRef<(HTMLElement | null)[]>([]);
  const gl = useMemo(webglAvailable, []);
  const previousHeat = useRef(heat);
  useEffect(() => { if (previousHeat.current !== heat) { setSelected(heat); setProbe(null); previousHeat.current = heat; } }, [heat]);
  const imageryError = useCallback(() => setFailedImage(grid.header.region), [grid.header.region]);
  const available = useCallback((key: HeatLayer) => key === 'relief' || (key === 'imagery' ? !!terrain.assets?.imagery && failedImage !== grid.header.region : key === 'slope' ? !!terrain.assets?.slope : !!layerValues(grid, key, scores)), [terrain.assets, failedImage, grid, scores]);
  const select = (key: HeatLayer) => { if (available(key)) { setSelected(key); setProbe(null); onHeat(key); } };
  const spec = selected === 'score' ? scoreLayer(source) : LAYERS[selected ?? 'relief'];
  const legendRamp = selected === 'slope' || selected === 'elevation' ? ['#00204d', '#1e4c78', '#466f6a', '#9d9252', '#fde725'] : spec.ramp;
  const ranges = useMemo(() => Object.fromEntries(STACK.map(key => {
    const values = layerValues(grid, key, scores);
    if (key === 'elevation' && terrain.tile) return [key, elevationRange(terrain.tile)];
    return [key, key === 'score' || key === 'sun' || key === 'earth' || key === 'ice' || key === 'favorability' ? [0, 1] : key === 'slope' ? [0, 30] : values ? displayRange(values) : [0, 1]];
  })) as Record<HeatLayer, [number, number]>, [grid, scores, terrain.tile]);
  const ephem = useMemo(() => sunEarthAt(date), [date]);
  const simulationRef = useRef({ sunDirection: bodyDirection(ephem.sun_lat, ephem.sun_lon), earthDirection: bodyDirection(ephem.earth_lat, ephem.earth_lon) });
  simulationRef.current = { sunDirection: bodyDirection(ephem.sun_lat, ephem.sun_lon), earthDirection: bodyDirection(ephem.earth_lat, ephem.earth_lon) };
  const sunDir = useMemo((): [number, number, number] => {
    if (!terrain.tile) return [0, 1, 0];
    const frame = tileFrame(terrain.tile), sun = new Vector3(...simulationRef.current.sunDirection);
    return [sun.dot(frame.right), sun.dot(frame.normal), -sun.dot(frame.up)];
  }, [terrain.tile, ephem]);
  const marks = useMemo(() => areas.map(a => a.index), [areas]);
  const values = selected ? layerValues(grid, selected, scores) : undefined;
  const cell = probe !== null ? { ...cellLatLon(grid.header, probe), value: values?.[probe] } : null;
  const surfaceLayer = selected === 'imagery' || selected === 'slope' || selected === 'elevation' ? selected : 'relief';
  return <section ref={hostRef} className="holo-stage" aria-label={`Terrain survey of ${name}`} data-layer={selected ?? 'stack'}>
    <div className="holo-frame" aria-hidden="true"><i/><i/><i/><i/></div>
    <header className="holo-title">
      <span className="holo-eyebrow">LUNAR SPECIMEN / {name.toUpperCase()}</span>
      <h2>{selected ? spec.label : 'Anatomy of a landing site'}</h2>
      <span className={`holo-status holo-status-${spec.status}`}>{selected === 'score' ? (source === 'preview' ? 'PREVIEW · ENGINE COMPUTING' : `RUST/WASM ENGINE · ${source.toUpperCase()}`) : spec.status === 'proxy' ? 'PROXY' : selected === 'favorability' ? 'USGS GEOLOGIC MODEL' : 'NASA SOURCE DATA'}</span>
      <div className="specimen-controls" role="group" aria-label="Terrain controls">
        <button onClick={() => { setSelected(null); onView('3d'); setProbe(null); }} aria-pressed={selected === null && !map}>All layers</button>
        <button onClick={() => onView(map ? '3d' : 'map')} aria-pressed={map}>Polar map</button>
        <button onClick={() => setReset(n => n + 1)}>Reset view</button>
        <button onClick={onClose}>Return to globe</button>
        <button onClick={() => setContours(v => !v)} aria-pressed={contours}>100 m contours</button>
        <button onClick={() => setExaggeration(v => v === 1 ? 2 : 1)}>Relief ×{exaggeration}</button>
        <label>Overlay <input aria-label="Overlay opacity" type="range" min={0.1} max={1} step={0.05} value={opacity} onChange={e => setOpacity(Number(e.target.value))}/></label>
      </div>
    </header>
    <div className="holo-canvas">
      {!terrain.ready ? <p className="holo-loading" role="status">Retrieving LOLA terrain and orbital imagery…</p>
        : terrain.error || !terrain.tile ? <div className="holo-loading" role="alert"><p>{terrain.error ?? 'No measured terrain covers this point.'}</p><button onClick={() => setAttempt(n => n + 1)}>Retry terrain</button></div>
        : !gl ? <p className="holo-loading" role="status">3D unavailable. Layer descriptions, ranked areas and cell values remain available below.</p>
        : <Suspense fallback={<p className="holo-loading" role="status">Preparing specimen…</p>}>
          {map ? <LunarScene active={active} tile={terrain.tile} assets={failedImage ? { ...terrain.assets!, imagery: undefined } : terrain.assets} view="map" layer={surfaceLayer} contoursEnabled={contours} exaggeration={exaggeration} resetKey={resetKey} overlayOpacity={opacity} simulationRef={simulationRef} timeKey={date} onImageryError={imageryError}/>
            : <StrataView active={active} resetKey={resetKey} contours={contours} exaggeration={exaggeration} overlayOpacity={opacity} onImageryError={imageryError}
              grid={grid} tile={terrain.tile} assets={failedImage ? { ...terrain.assets!, imagery: undefined } : terrain.assets} scores={scores} marks={marks} ranges={ranges} selected={selected} onSelect={select} onProbe={setProbe} sunDir={sunDir} reducedMotion={reducedMotion} labelRefs={labels} areaLabelRefs={areaLabels}/>}
        </Suspense>}
      {!map && selected === null && terrain.ready && gl && <div className="strata-labels" aria-label="Exploded terrain layers">{STACK.map((key, i) => <button key={key} ref={el => { labels.current[i] = el; }} disabled={!available(key)} onClick={() => select(key)}><span>{String(i + 1).padStart(2, '0')}</span>{LAYERS[key].short}{!available(key) && ' · unavailable'}</button>)}</div>}
    </div>
    <footer className="holo-footer">
      <div className="specimen-layer-list" role="group" aria-label="Select a scientific layer">{STACK.map(key => <button key={key} disabled={!available(key)} aria-pressed={selected === key} onClick={() => select(key)}>{LAYERS[key].short}</button>)}</div>
      {selected && <>{!['imagery', 'relief'].includes(selected) && <div className="holo-legend"><span>{spec.format(ranges[selected][0])}</span><i style={{ background: `linear-gradient(90deg, ${legendRamp.join(',')})` }}/><span>{spec.format(ranges[selected][1])}{selected === "slope" ? "+" : ""}</span>{selected === 'slope' && <span>White contour: 10° reference · mission limit: {slopeLimit}°</span>}</div>}<p className="specimen-explain">{spec.explain} <span>{spec.caveat}</span></p></>}
      <p className="holo-probe" role="status">{cell ? <><b>{formatCoordinates(cell.lat, cell.lon)}</b><span>{cell.value !== undefined && Number.isFinite(cell.value) ? spec.format(cell.value) : 'No scalar value for this layer'}</span></> : <span>{selected ? 'Drag to orbit · scroll/pinch to zoom · hover to probe' : 'Choose a floating layer to settle it onto the ground'}</span>}</p>
      <label className="specimen-cell">Inspect cell <input aria-label="Inspect grid cell" type="number" min={0} max={grid.header.nx * grid.header.ny - 1} value={probe ?? ''} placeholder={`0–${grid.header.nx * grid.header.ny - 1}`} onChange={e => { const n = e.target.valueAsNumber; setProbe(Number.isInteger(n) && n >= 0 && n < grid.header.nx * grid.header.ny ? n : null); }}/></label>
      <p className="specimen-caption">LOLA 80 m terrain · science cells 160 m · relief normalized for display, ×{exaggeration} · cutaway depth illustrative, no subsurface measurements.</p>
      {map && selected && !['imagery', 'slope', 'elevation', 'relief'].includes(selected) && <p className="specimen-caption">Polar map shows relief. Open All layers and select {spec.short} for its dot field.</p>}
      {terrain.assets?.notices.map(note => <p className="specimen-caption" key={note}>{note}</p>)}
      {failedImage && <p role="alert" className="specimen-caption">NAC image unavailable. Other measured layers remain usable.</p>}
    </footer>
  </section>;
}
