import { useEffect, useMemo, useState } from 'react';
import type { AnalysisLayer, Mode } from '../../shell/scenario';
import { siteSky, sunEarthAt } from '../../ephem';
import { formatCoordinates } from '../sites/sites';
import { LAYERS, percentile, scoreLayer } from '../heatmap/layers';
import type { RegionResult } from '../mission/useMissionData';
import type { PreviewArea } from '../heatmap/score';
import { loadAnalysis, type AnalysisData } from './data';
import { tryTrack } from '../timeline/MissionTimeline';
import { horizonAt } from '../heatmap/grid';
import { earthShare } from '../../engine/track';
import type { Params } from '../../contracts/engine-api';
import type { SiteMask } from '../../contracts/site-mask';
import type { ValidationSet } from '../../contracts/validation';
import { engineVsHorizons } from './engineCheck';
import type { DemoData } from '../../shell/data';
import './analysis.css';

export interface AnalysisLocation { id: string; name: string; lat: number; lon: number }
interface Props {
  location: AnalysisLocation;
  /** Playhead instant (UTC ISO). */
  date: string;
  layer: AnalysisLayer;
  mode: Mode;
  region?: RegionResult;
  slopeLimit: number;
  onLayerChange: (layer: AnalysisLayer) => void;
  onClose: () => void;
  onAdd: () => void;
  canAdd: boolean;
  feedback: string;
  /** Engine horizon for this place (siteMaskFor); null = flat horizon. */
  mask?: SiteMask | null;
  table?: DemoData['table'];
  params: Params;
}
interface Sky { mask?: SiteMask | null; table?: DemoData['table']; params: Params }
const TABS: { key: AnalysisLayer; label: string }[] = [
  { key: 'terrain', label: 'Why here' }, { key: 'horizon', label: 'Sun & Earth' }, { key: 'libration', label: 'Earth wobble' }, { key: 'evidence', label: 'Evidence' },
];

export function AnalysisPanel({ location, date, layer, mode, region, slopeLimit, onLayerChange, onClose, onAdd, canAdd, feedback, mask, table, params: rawParams }: Props) {
  // Callers build params per render; key it by value so the Evidence fetch effect does not loop.
  const paramsKey = JSON.stringify(rawParams);
  const params = useMemo(() => JSON.parse(paramsKey) as Params, [paramsKey]);
  const sky = { mask, table, params };
  const tab = layer === 'heatmap' ? 'terrain' : layer;
  return <section className="analysis-panel" aria-label={`Analysis of ${location.name}`}>
    <header className="analysis-heading"><div><span className="eyebrow">{region ? 'REGION ANALYSIS' : 'SURFACE POINT'}</span><h2>{location.name}</h2></div><button type="button" onClick={onClose} aria-label="Close analysis">×</button></header>
    <p className="analysis-coordinates">{formatCoordinates(location.lat, location.lon)} · MOON_ME</p>
    <nav className="analysis-tabs" aria-label="Analysis views">{TABS.map(t => <button type="button" key={t.key} aria-pressed={tab === t.key} onClick={() => onLayerChange(t.key)}>{t.label}</button>)}</nav>
    <div className="analysis-content" key={`${location.id}/${tab}`}>
      {tab === 'terrain' && (region ? <WhyHere region={region} mode={mode} slopeLimit={slopeLimit} /> : <NoCoverage />)}
      {tab === 'horizon' && <SkyView location={location} date={date} mode={mode} {...sky} />}
      {tab === 'libration' && <Wobble location={location} date={date} mode={mode} {...sky} />}
      {tab === 'evidence' && <Evidence location={location} region={region} table={table} params={params} />}
    </div>
    <footer><button type="button" className="analysis-add" onClick={onAdd} disabled={!canAdd}>Add to comparison <span aria-hidden="true">＋</span></button><p role="status">{feedback || (canAdd ? 'Compare the same arrival window across up to four places.' : 'Already in your comparison, or the four-site limit is reached.')}</p></footer>
  </section>;
}

function NoCoverage() {
  return <div className="analysis-empty"><span>No terrain survey here</span><h3>A point to investigate.</h3><p>We only have measured terrain, sunlight, Earth-visibility and permanent-shadow maps for the three Artemis III regions so far. Sun & Earth and Earth wobble still work here: they are computed live for any coordinate.</p></div>;
}

/** The area's lowest normalised factor; thermal only counts once the engine window has it (the preview has no cold_frac). */
export function weakestFactor(f: Pick<PreviewArea['factors'], 'sun' | 'earth' | 'slope' | 'crater' | 'rock' | 'thermal'>, engine: boolean): [string, number] {
  const all: [string, number][] = [['sunlight', f.sun], ['Earth contact', f.earth], ['flat ground', f.slope], ['shallow terrain', f.crater], ['smooth ground', f.rock], ...(engine ? [['warmth', f.thermal] as [string, number]] : [])];
  return all.filter(e => Number.isFinite(e[1])).reduce((m, e) => e[1] < m[1] ? e : m, ['none', Infinity]);
}

function Bar({ value, tone }: { value: number; tone: string }) {
  return <i className="factor-bar" style={{ ['--v' as string]: `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%`, ['--tone' as string]: tone }} />;
}

function WhyHere({ region, mode, slopeLimit }: { region: RegionResult; mode: Mode; slopeLimit: number }) {
  const { grid, areas } = region;
  const L = grid.layers;
  // Engine window fractions once they load; the 18.6-yr PGDA averages only while the preview shows.
  const engine = region.source !== 'preview';
  const sunL = (engine ? region.factors.sun_frac : L.sun_avg) as Float32Array | undefined;
  const earthL = (engine ? region.factors.earth_frac : L.earth_avg) as Float32Array | undefined;
  const surveyKm = Math.round(grid.header.nx * grid.header.cell_m / 1000);
  const stats = useMemo(() => {
    let ok = 0; let n = 0; let psr = 0; let sunMax = 0;
    for (let i = 0; i < (L.slope_deg?.length ?? 0); i++) { n++; if ((L.slope_deg![i]) <= slopeLimit) ok++; psr += L.psr?.[i] ?? 0; const v = sunL?.[i] ?? 0; if (v > sunMax) sunMax = v; }
    return { landable: n ? ok / n : 0, psr: n ? psr / n : 0, sunMax };
  }, [L, sunL, slopeLimit]);
  if (region.error) return <div className="analysis-empty" role="alert"><span>Ranking unavailable</span><p>{region.error}</p></div>;
  return <>
    <div className="analysis-source">Ranked by your priorities · {engine ? `Rust/WASM engine over your arrival window (${region.source === 'baked' ? 'precomputed' : 'computed in your browser'})` : 'preview of the engine formula on 18.6-yr averages (engine computing)'}</div>
    {areas.length === 0 ? <div className="analysis-empty"><h3>No landable area.</h3><p>No 400 m base footprint here is entirely under the {slopeLimit}° slope limit. Raise the limit in Planner or choose another region.</p></div>
      : <ol className="area-list">{areas.map((a, i) => {
        const sunP = sunL ? percentile(sunL, sunL[a.index]) : 0;
        const earthP = earthL ? percentile(earthL, earthL[a.index]) : 0;
        const sun = sunL?.[a.index] ?? NaN; const earth = earthL?.[a.index] ?? NaN; const slope = L.slope_deg?.[a.index] ?? NaN;
        const weakest = weakestFactor(a.factors, engine);
        return <li key={a.index}>
          <header><b>{i + 1}</b><span>Area {i + 1}<small>{formatCoordinates(a.lat, a.lon)}</small></span><em>{a.score.toFixed(2)}</em></header>
          {mode === 'explorer' ? <p className="area-story">
            The Sun is up here <b>{LAYERS.sun.format(sun)}</b> of the time (sunnier than {Math.min(99, sunP)}% of this region) and Earth is in view <b>{LAYERS.earth.format(earth)}</b> of the time for direct radio.
            {Number.isFinite(a.iceKm) ? <> The nearest permanently shadowed cold trap, where water ice can survive, is <b>{a.iceKm.toFixed(1)} km</b> away.</> : <> No permanently shadowed ground lies inside this {surveyKm} km survey.</>}
            {' '}Trade-off: its weakest point is {weakest[0]}.
          </p> : <dl className="area-factors">
            <div><dt>Sunlight</dt><dd>{LAYERS.sun.format(sun)} <small>p{sunP}</small></dd><Bar value={a.factors.sun} tone="#e9a23b"/></div>
            <div><dt>Earth contact</dt><dd>{LAYERS.earth.format(earth)} <small>p{earthP}</small></dd><Bar value={a.factors.earth} tone="#5aa2f0"/></div>
            <div><dt>Slope</dt><dd>{slope.toFixed(1)}° / {slopeLimit}°</dd><Bar value={a.factors.slope} tone="#f0b979"/></div>
            <div><dt>Crater relief</dt><dd>{(L.crater_depth_m?.[a.index] ?? NaN).toFixed(0)} m</dd><Bar value={a.factors.crater} tone="#f0b979"/></div>
            {engine && <div><dt>Warm enough</dt><dd>{LAYERS.sun.format(a.factors.thermal)} of hours</dd><Bar value={a.factors.thermal} tone="#e07a5f"/></div>}
            <div><dt>Smooth ground <small>proxy</small></dt><dd>{(L.roughness_deg?.[a.index] ?? NaN).toFixed(1)}° roughness</dd><Bar value={a.factors.rock} tone="#a78b56"/></div>
            <div><dt>Ice trap</dt><dd>{Number.isFinite(a.iceKm) ? `${a.iceKm.toFixed(1)} km` : 'none in survey'}</dd><Bar value={Number.isFinite(a.factors.ice) ? a.factors.ice : 0} tone="#3cc9da"/></div>
          </dl>}
        </li>;
      })}</ol>}
    <dl className="analysis-stats">
      <div><dt>Landable cells</dt><dd>{Math.round(stats.landable * 100)}%</dd></div>
      <div><dt>Best sunlight</dt><dd>{LAYERS.sun.format(stats.sunMax)}</dd></div>
      <div><dt>Cold-trap area</dt><dd>{(stats.psr * 100).toFixed(1)}%</dd></div>
    </dl>
    <p className="analysis-note">{engine ? `Sunlight and Earth visibility are the engine's fractions for your arrival window over each cell's 64-bin terrain horizon (${surveyKm} km survey, ${grid.header.cell_m} m cells).` : 'Sunlight and Earth visibility are 18.6-year averages (not your date) until the engine finishes this window.'} Rankings explain trade-offs under your priorities; they are not a safety certification.</p>
  </>;
}

const HOURS = 72;
const SEARCH_H = 720;
type Body = { el: number; az: number; up: boolean; horizon: number };
/** First hour (within n) the body's up/down state flips. */
function nextFlip(up: (h: number) => boolean, n: number) {
  const now = up(0);
  for (let h = 1; h < n; h++) if (up(h) !== now) return { h, up: now };
  return { h: null as number | null, up: now };
}
function SkyView({ location, date, mode, mask, table, params }: { location: AnalysisLocation; date: string; mode: Mode } & Sky) {
  const track = useMemo(() => tryTrack(mask, table, date, SEARCH_H, params), [mask, table, date, params]);
  const data = useMemo(() => {
    if (track && mask) {
      const at = (h: number) => ({
        sun: { el: track.sunEl[h], az: track.sunAz[h], up: track.sunLit[h] > 0, horizon: horizonAt(mask.mask_deg, track.sunAz[h]) },
        earth: { el: track.earthEl[h], az: track.earthAz[h], up: track.earthVis[h] > 0, horizon: horizonAt(mask.mask_deg, track.earthAz[h]) } });
      return { samples: Array.from({ length: HOURS + 1 }, (_, h) => ({ h, ...at(h) })),
        sunset: nextFlip(h => track.sunLit[h] > 0, track.hours), earthset: nextFlip(h => track.earthVis[h] > 0, track.hours) };
    }
    const t0 = Date.parse(date);
    const flat = (h: number) => { const k = siteSky(location.lat, location.lon, new Date(t0 + h * 3_600_000)); return { sun: { ...k.sun, up: k.sun.el > 0, horizon: 0 }, earth: { ...k.earth, up: k.earth.el > 0, horizon: 0 } }; };
    // geometric sunset/earthset: first hour the centre drops below 0° (terrain ignored), searched up to 30 days
    const all = Array.from({ length: SEARCH_H + 1 }, (_, h) => ({ h, ...flat(h) }));
    return { samples: all.slice(0, HOURS + 1), sunset: nextFlip(h => all[h].sun.up, all.length), earthset: nextFlip(h => all[h].earth.up, all.length) };
  }, [track, mask, location.lat, location.lon, date]);
  const els = data.samples.flatMap(s => [s.sun.el, s.earth.el, s.sun.horizon, s.earth.horizon]);
  const lo = Math.min(-5, Math.floor(Math.min(...els))); const hi = Math.max(10, Math.ceil(Math.max(...els)));
  const x = (h: number) => 44 + h / HOURS * 380; const y = (el: number) => 180 - (el - lo) / (hi - lo) * 160;
  const line = (body: 'sun' | 'earth', key: 'el' | 'horizon' = 'el') => data.samples.map(s => `${x(s.h).toFixed(1)},${y((s[body] as Body)[key]).toFixed(1)}`).join(' ');
  const now = data.samples[0];
  const event = (e: { h: number | null; up: boolean }, body: string, on: string, off: string) => e.h === null ? `${body} stays ${e.up ? on : off} for 30+ days` : `${body} ${e.up ? 'sets' : 'rises'} in ${e.h < 48 ? `${e.h} h` : `${(e.h / 24).toFixed(1)} days`}`;
  const terrain = track && mask ? `${mask.bins}-bin LOLA horizon${mask.bins === 360 ? '' : ' (grid cell)'}` : '';
  return <>
    <div className="analysis-source">{terrain ? `Rust/WASM engine · JPL Horizons table · ${terrain}` : 'Astronomy Engine (checked against JPL Horizons, see Evidence) · flat horizon, no terrain mask here'}</div>
    <div className="sky-now">
      <div className="sky-sun"><span>SUN</span><b>{now.sun.el.toFixed(2)}°</b><small>az {now.sun.az.toFixed(1)}° · {terrain ? (now.sun.up ? 'lit · ' : 'behind terrain · ') : ''}{event(data.sunset, 'Sun', 'up', 'down')}</small></div>
      <div className="sky-earth"><span>EARTH</span><b>{now.earth.el.toFixed(2)}°</b><small>az {now.earth.az.toFixed(1)}° · {terrain ? (now.earth.up ? 'in view · ' : 'hidden · ') : ''}{event(data.earthset, 'Earth', 'in view', 'hidden')}</small></div>
    </div>
    <svg className="analysis-chart" viewBox="0 0 440 210" role="img" aria-label={`Sun and Earth elevation over the next ${HOURS} hours. Sun now ${now.sun.el.toFixed(1)} degrees, Earth ${now.earth.el.toFixed(1)} degrees.${terrain ? ` Terrain horizon under the Sun ${now.sun.horizon.toFixed(1)} degrees, under Earth ${now.earth.horizon.toFixed(1)} degrees.` : ''}`}>
      {[lo, 0, hi].map(el => <g key={el}><line className={el === 0 ? 'zero' : ''} x1="44" x2="424" y1={y(el)} y2={y(el)}/><text x="38" y={y(el) + 3} textAnchor="end">{el}°</text></g>)}
      {[0, 24, 48, 72].map(h => <text key={h} x={x(h)} y="198" textAnchor="middle">+{h}h</text>)}
      {terrain && <><polyline className="sun" strokeDasharray="2 3" strokeOpacity={0.6} points={line('sun', 'horizon')} /><polyline className="earth" strokeDasharray="2 3" strokeOpacity={0.6} points={line('earth', 'horizon')} /></>}
      <polyline className="sun" points={line('sun')} /><polyline className="earth" points={line('earth')} />
      <text x={x(HOURS) - 2} y={y(data.samples[HOURS].sun.el) - 6} textAnchor="end" className="label-sun">Sun</text>
      <text x={x(HOURS) - 2} y={y(data.samples[HOURS].earth.el) - 6} textAnchor="end" className="label-earth">Earth</text>
      <text x="46" y={y(0) - 4} className="zero-label">{terrain ? '0° level · dashed: terrain horizon under each body' : '0° flat horizon'}</text>
    </svg>
    <p className="analysis-note">{mode === 'explorer'
      ? 'At the south pole the Sun never climbs high: it circles the sky just above the horizon, so a hill a few degrees tall can block it. That is why ridges matter.'
      : terrain ? `Topocentric elevation of the body centre (parallax and libration included). The Sun counts as lit while any part of its disk clears the terrain horizon; Earth is in view when its centre is ${params.antenna_margin_deg}° above it.`
      : 'Topocentric elevation of the body centre from a site on the 1,737.4 km sphere (parallax and libration included). No terrain mask covers this point, so real sunset/Earthset can be earlier.'}</p>
  </>;
}

const WOBBLE_DAYS = 30;
function Wobble({ location, date, mode, mask, table, params }: { location: AnalysisLocation; date: string; mode: Mode } & Sky) {
  // Same 720 h window as SkyView, so trackFor's cache serves both tabs.
  const track = useMemo(() => tryTrack(mask, table, date, WOBBLE_DAYS * 24, params), [mask, table, date, params]);
  const pts = useMemo(() => {
    const t0 = Date.parse(date);
    return Array.from({ length: WOBBLE_DAYS * 4 + (track ? 0 : 1) }, (_, i) => {
      const t = new Date(t0 + i * 6 * 3_600_000);
      const row = sunEarthAt(t);
      const el = track ? track.earthEl[i * 6] : siteSky(location.lat, location.lon, t).earth.el;
      return { i, lat: row.earth_lat, lon: row.earth_lon, el, up: track ? track.earthVis[i * 6] > 0 : el > 0 };
    });
  }, [date, location.lat, location.lon, track]);
  const sx = (lon: number) => 120 + lon / 9 * 100; const sy = (lat: number) => 110 - lat / 8 * 90;
  const up = track ? earthShare(track) : pts.filter(p => p.up).length / pts.length;
  const elMin = Math.min(...pts.map(p => p.el)); const elMax = Math.max(...pts.map(p => p.el));
  const range = (k: 'lat' | 'lon') => `${Math.min(...pts.map(p => p[k])).toFixed(1)}° to ${Math.max(...pts.map(p => p[k])).toFixed(1)}°`;
  const ex = (i: number) => 262 + i / (pts.length - 1) * 168; const ey = (el: number) => 180 - (el - Math.min(-2, elMin)) / (Math.max(2, elMax) - Math.min(-2, elMin)) * 140;
  const cur = pts[0];
  const horizon = track ? 'terrain horizon' : 'flat horizon';
  return <>
    <div className="analysis-source">Libration of the sub-Earth point · next {WOBBLE_DAYS} days · Astronomy Engine{track ? ' · Earth visibility: Rust/WASM engine over the terrain horizon' : ' · flat horizon'}</div>
    <svg className="analysis-chart wobble" viewBox="0 0 440 210" role="img" aria-label={`Earth's apparent wobble: sub-Earth point now ${cur.lat.toFixed(1)} degrees latitude, ${cur.lon.toFixed(1)} degrees longitude. Earth is in view above this site's ${horizon} ${Math.round(up * 100)} percent of the next ${WOBBLE_DAYS} days.`}>
      <line x1="20" x2="220" y1="110" y2="110"/><line x1="120" x2="120" y1="20" y2="200"/>
      <text x="216" y="104" textAnchor="end">lon +9°</text><text x="124" y="28">lat +8°</text>
      <polyline className="earth" points={pts.map(p => `${sx(p.lon).toFixed(1)},${sy(p.lat).toFixed(1)}`).join(' ')} />
      <circle className="earth-now" cx={sx(cur.lon)} cy={sy(cur.lat)} r="6"/>
      <text x="20" y="206">Where Earth's centre sits overhead on the Moon</text>
      <line className="zero" x1="262" x2="430" y1={ey(0)} y2={ey(0)}/>
      <polyline className="earth" points={pts.map(p => `${ex(p.i).toFixed(1)},${ey(p.el).toFixed(1)}`).join(' ')} />
      <text x="262" y="30">Earth elevation from here</text><text x="430" y={ey(0) - 4} textAnchor="end">0°</text>
      <text x="262" y="206">now</text><text x="430" y="206" textAnchor="end">+{WOBBLE_DAYS} d</text>
    </svg>
    <dl className="analysis-stats">
      <div><dt>Sub-Earth point</dt><dd>{cur.lat.toFixed(2)}°, {cur.lon.toFixed(2)}°</dd></div>
      <div><dt>Earth elevation range</dt><dd>{elMin.toFixed(1)}° to {elMax.toFixed(1)}°</dd></div>
      <div><dt>Earth in view ({horizon})</dt><dd>{Math.round(up * 100)}%</dd></div>
    </dl>
    <p className="analysis-note">{mode === 'explorer'
      ? 'The Moon always shows Earth the same face, but its tilted, elliptical orbit makes it rock back and forth ("libration"). From the south pole, Earth sits right at the horizon, so this wobble decides when you can talk to home.'
      : `Over these ${WOBBLE_DAYS} days libration moves the sub-Earth point ${range('lat')} in latitude and ${range('lon')} in longitude; near the pole that maps almost one-to-one onto Earth elevation. ${track ? `Visibility uses the terrain horizon and a ${params.antenna_margin_deg}° antenna margin.` : 'Flat horizon: no terrain mask covers this point.'}`}</p>
  </>;
}

/** e.g. "Jan 2026 and Jul 2028": the months the reference runs cover, read from the samples. */
function dateSpan(ref: ValidationSet) {
  const months = [...new Set(ref.samples.map(s => s.t_iso.slice(0, 7)))].map(m => new Date(`${m}-01T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }));
  return months.length > 1 ? `${months.slice(0, -1).join(', ')} and ${months[months.length - 1]}` : months[0];
}

function Evidence({ location, region, table, params }: { location: AnalysisLocation; region?: RegionResult; table?: DemoData['table']; params: Params }) {
  const [check, setCheck] = useState<{ status: 'loading' | 'ready' | 'none' | 'error'; data?: AnalysisData; worst?: number; n?: number; engine?: ReturnType<typeof engineVsHorizons> }>({ status: region ? 'loading' : 'none' });
  useEffect(() => {
    if (!region) { setCheck({ status: 'none' }); return; }
    const controller = new AbortController();
    loadAnalysis(region.grid.header.region, controller.signal).then(data => {
      if (controller.signal.aborted) return;
      const ref = data.reference; let worst = 0; let n = 0;
      for (let i = 0; i < ref.samples.length; i += 12) {
        const s = ref.samples[i]; const k = siteSky(ref.lat, ref.lon, s.t_iso, ref.elev_m); n++;
        worst = Math.max(worst, Math.abs(k.sun.el - s.sun_el), Math.abs(k.earth.el - s.earth_el));
      }
      setCheck({ status: 'ready', data, worst, n, engine: table ? engineVsHorizons(ref, table, params) : null });
    }).catch(() => { if (!controller.signal.aborted) setCheck({ status: 'error' }); });
    return () => controller.abort();
  }, [location.id, region, table, params]);
  const urls = region ? [...new Set(region.grid.header.source_urls)] : [];
  return <div data-tour-anchor="evidence-panel">
    <div className="analysis-source">What each layer is, and where it came from</div>
    <ul className="evidence-list">
      {(['sun', 'earth', 'sun_lt', 'earth_lt', 'ice', 'favorability', 'imagery', 'relief', 'elevation', 'slope', 'roughness', 'score'] as const).map(k => { const L = k === 'score' && region ? scoreLayer(region.source) : LAYERS[k]; return <li key={k}><span className={`chip chip-${L.status}`}>{L.status === 'preview' && k === 'favorability' ? 'model' : L.status}</span><b>{L.label}</b><small>{L.citation}. {L.caveat}</small></li>; })}
      <li><span className="chip chip-real">real</span><b>Date-specific sunlight, Earth contact, thermal</b><small>Rust/WASM engine over LOLA horizon masks and the JPL Horizons table: compare cards use site_metrics, the suitability layer uses grid_fracs + scores_from_fracs (precomputed for demo dates, computed in your browser otherwise).</small></li>
    </ul>
    <div className="analysis-source">Ephemeris check vs JPL Horizons</div>
    {check.status === 'ready' ? <p className="analysis-note"><b>{check.n} samples</b> of Sun and Earth elevation at the {check.data!.reference.site_id} reference point ({dateSpan(check.data!.reference)}): the browser ephemeris (Astronomy Engine) agrees with JPL Horizons to <b>{check.worst!.toFixed(4)}°</b> worst case{check.engine ? <>, and the Rust/WASM engine (site_track on the shipped Horizons table, {check.engine.n} samples) to <b>{check.engine.worst.toFixed(4)}°</b></> : ' (engine check unavailable)'}. Computed in your browser now.</p>
      : check.status === 'loading' ? <p role="status" className="analysis-note">Comparing against JPL Horizons…</p>
      : check.status === 'error' ? <p role="alert" className="analysis-note">Reference table unavailable.</p>
      : <p className="analysis-note">JPL reference samples exist for the three surveyed regions; select one to run the check.</p>}
    {urls.length > 0 && <ul className="analysis-sources">{urls.map((url, i) => <li key={url}><a href={url} target="_blank" rel="noreferrer">Source {i + 1} · {new URL(url).hostname}{new URL(url).pathname.length > 1 ? ` · ${new URL(url).pathname.split('/').filter(Boolean).pop()}` : ''} ↗</a></li>)}</ul>}
  </div>;
}
