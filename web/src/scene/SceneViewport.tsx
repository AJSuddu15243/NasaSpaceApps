import { Globe, Mountain, RotateCcw } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { EphemHeader } from '../contracts/ephem';
import { useSceneEphemeris } from './sceneEphemeris';
import { LunarScene } from './LunarScene';
import { OverviewMoon } from './OverviewMoon';
import { bodyDirection, geographicPoint, projectedPoint } from './coordinates';
import { createMockSouthPoleTile } from './mockTerrain';
import { elevationRange } from './localTerrain';
import { useTerrainData } from './useTerrainData';
import { TERRAIN_REGIONS } from './regions';
import { SlopeLegend } from './heatmap/SlopeLegend';
import type { LunarSceneProps, SceneSimulationState, SceneSiteMarker } from './types';
import { useSceneVisibility } from './useSceneVisibility';
import './scene.css';
export function SceneViewport({ sites, date, table, view, onSiteSelect }: {
  sites: SceneSiteMarker[]; date: string; table: { header: EphemHeader; rows: Float32Array }; view: '3d' | 'map';
  onSiteSelect: (id: string) => void;
}) {
  const { hostRef, active } = useSceneVisibility();
  const [focus, setFocus] = useState('');
  const allSites = useMemo(() => [...sites.map(s => ({ ...s, name: TERRAIN_REGIONS.find(r => r.id === s.id)?.name ?? s.name })), ...TERRAIN_REGIONS.filter(r => !sites.some(s => s.id === r.id))], [sites]);
  const site = allSites.find(s => s.id === focus) ?? sites[0] ?? TERRAIN_REGIONS[0];
  const current = useTerrainData(site);
  const [layer, setLayer] = useState<NonNullable<LunarSceneProps['layer']>>('relief');
  const [contours, setContours] = useState(false);
  const [exaggeration, setExaggeration] = useState<1 | 2>(1);
  const [overview, setOverview] = useState(true);
  const [opacity, setOpacity] = useState(0.85);
  const [reset, setReset] = useState(0);
  const simulationRef = useRef<SceneSimulationState>({});
  const { sample, source, notice } = useSceneEphemeris(table, date);
  simulationRef.current = sample ? { sunDirection: bodyDirection(sample.sunLat, sample.sunLon), earthDirection: bodyDirection(sample.earthLat, sample.earthLon) } : {};
  const synthetic = useMemo(() => {
    const tile = createMockSouthPoleTile(), p = projectedPoint(site.lat, site.lon);
    return p ? { ...tile, id: `synthetic-${site.id}`, x0M: tile.x0M + p.x, y0M: tile.y0M + p.y } : tile;
  }, [site.id, site.lat, site.lon]);
  const tile = current.tile ?? synthetic;
  const [failedImage, setFailedImage] = useState('');
  const imageryError = useCallback(() => setFailedImage(tile.id), [tile.id]);
  const range = useMemo(() => elevationRange(tile), [tile]);
  const center = geographicPoint(tile.x0M + (tile.columns - 1) * tile.cellM / 2, tile.y0M + (tile.rows - 1) * tile.cellM / 2);
  const selectSite = (id: string) => { setFocus(id); setOverview(false); onSiteSelect(id); };
  const local = view === 'map' || !overview;
  const effectiveLayer = layer === 'slope' && !current.assets?.slope || layer === 'imagery' && (!current.assets?.imagery || failedImage === tile.id) ? 'relief' : layer;
  return <div className="scene-viewport" ref={hostRef}>
    <div className="scene-toolbar">
      <label className="scene-select">Site <select aria-label="Terrain site" value={site.id} onChange={e => selectSite(e.target.value)}>{allSites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
      {view === '3d' && <button type="button" className="scene-icon" aria-pressed={!overview} onClick={() => setOverview(v => !v)} aria-label={overview ? 'Explore local terrain' : 'Moon overview'} title={overview ? 'Explore local terrain' : 'Moon overview'}><Globe size={14} /></button>}
      <button type="button" className="scene-icon" onClick={() => setReset(v => v + 1)} aria-label="Reset view" title="Reset view"><RotateCcw size={14} /></button>
      {local && <>
        <label className="scene-select">Layer <select aria-label="Terrain layer" value={effectiveLayer} onChange={e => setLayer(e.target.value as typeof layer)}>
          <option value="relief">Relief</option><option value="imagery" disabled={!current.assets?.imagery || failedImage === tile.id}>NAC imagery</option>
          <option value="elevation">Elevation</option><option value="slope" disabled={!current.assets?.slope}>Slope heatmap</option>
        </select></label>
        <button type="button" className="scene-icon" aria-pressed={contours} onClick={() => setContours(v => !v)} aria-label="Toggle 100 m contours" title="100 m contours"><Mountain size={14} /></button>
        <button type="button" className="scene-icon" aria-pressed={exaggeration === 2} onClick={() => setExaggeration(v => v === 1 ? 2 : 1)} aria-label="Toggle relief exaggeration" title={`Relief ×${exaggeration}`}>{exaggeration === 2 ? '×2' : '×1'}</button>
      </>}
    </div>
    <div className="scene-status"><span>{!local ? 'LROC / LOLA Moon overview' : current.tile ? 'Real LOLA terrain · 80 m' : 'Synthetic terrain preview'}</span><time>{date.slice(0, 16).replace('T', ' ')} UTC</time></div>
    {local && !current.ready ? <div className="scene-message" role="status">Loading terrain…</div> : local && current.error ? <div className="scene-message" role="alert">{current.error}</div> : <div className="scene-canvas">
      {!local ? <OverviewMoon active={active} key={reset} sites={allSites} simulationRef={simulationRef} timeKey={`${date}-${source}`} onSiteSelect={selectSite} /> :
        <LunarScene onImageryError={imageryError} active={active} tile={tile} sites={allSites} simulationRef={simulationRef} timeKey={`${date}-${source}`} resetKey={reset}
          view={view} contoursEnabled={contours} assets={current.assets} layer={effectiveLayer} overlayOpacity={opacity} exaggeration={exaggeration} onSiteSelect={selectSite} />}
      <div className="scene-instructions">{view === 'map' ? 'Drag to pan · scroll to zoom' : 'Drag to orbit · scroll to zoom · choose a site to explore'}</div>
    </div>}
    {local && <>
      <div className="scene-readout"><span>{((tile.columns - 1) * tile.cellM / 1000).toFixed(1)} km × {((tile.rows - 1) * tile.cellM / 1000).toFixed(1)} km · relief ×{exaggeration}</span><span>{center.lat.toFixed(3)}° · {center.lon.toFixed(3)}°</span>
        {view === 'map' && <span>Grid {Math.max(tile.columns - 1, tile.rows - 1) * tile.cellM > 12000 ? 5 : 2} km · +x 90°E</span>}</div>
      {effectiveLayer === 'slope' && current.assets?.slope && <SlopeLegend grid={current.assets.slope} opacity={opacity} onOpacity={setOpacity} />}
      {effectiveLayer === 'elevation' && <div className="scene-elevation"><span>{Math.floor(range[0])} m</span><i /><span>{Math.ceil(range[1])} m</span><span>Elevation above lunar reference sphere</span></div>}
      {effectiveLayer === 'imagery' && <p className="scene-note">{current.assets?.imagery?.attribution} Orbital imagery includes shadows from its acquisition date.</p>}
      {failedImage === tile.id && <p className="scene-note" role="alert">NAC image could not load. Relief remains available.</p>}
      {current.assets?.notices.map(note => <p key={note} className="scene-note">{note}</p>)}
    </>}
    {notice && <p className="scene-note">{notice}</p>}
    <p className="scene-note">{sample ? `Lighting follows the ${source} ephemeris. ` : 'Ephemeris unavailable at this time; solar lighting is off. '}
      {local && (current.tile ? 'Visual shadows cover this local patch only. ' : 'Terrain and shadows are illustrative. ')}
      Display fill keeps dark terrain readable. Simulation metrics remain separate.</p>
  </div>;
}
