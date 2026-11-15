import { useEffect, useMemo, useState } from 'react';
import type { AnalysisLayer, Mode } from '../../shell/scenario';
import { siteSky, sunEarthAt } from '../../ephem';
import { formatCoordinates } from '../sites/sites';
import { LAYERS, percentile, scoreLayer } from '../heatmap/layers';
import type { RegionResult } from '../mission/useMissionData';
import { loadAnalysis, type AnalysisData } from './data';
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
}
const TABS: { key: AnalysisLayer; label: string }[] = [
  { key: 'terrain', label: 'Why here' }, { key: 'horizon', label: 'Sun & Earth' }, { key: 'libration', label: 'Earth wobble' }, { key: 'evidence', label: 'Evidence' },
];

export function AnalysisPanel({ location, date, layer, mode, region, slopeLimit, onLayerChange, onClose, onAdd, canAdd, feedback }: Props) {
  const tab = layer === 'heatmap' ? 'terrain' : layer;
  return <section className="analysis-panel" aria-label={`Analysis of ${location.name}`}>
    <header className="analysis-heading"><div><span className="eyebrow">{region ? 'REGION ANALYSIS' : 'SURFACE POINT'}</span><h2>{location.name}</h2></div><button type="button" onClick={onClose} aria-label="Close analysis">×</button></header>
    <p className="analysis-coordinates">{formatCoordinates(location.lat, location.lon)} · MOON_ME</p>
    <nav className="analysis-tabs" aria-label="Analysis views">{TABS.map(t => <button type="button" key={t.key} aria-pressed={tab === t.key} onClick={() => onLayerChange(t.key)}>{t.label}</button>)}</nav>
    <div className="analysis-content" key={`${location.id}/${tab}`}>
      {tab === 'terrain' && (region ? <WhyHere region={region} mode={mode} slopeLimit={slopeLimit} /> : <NoCoverage />)}
      {tab === 'horizon' && <SkyView location={location} date={date} mode={mode} />}
      {tab === 'libration' && <Wobble location={location} date={date} mode={mode} />}
      {tab === 'evidence' && <Evidence location={location} region={region} />}
    </div>
    <footer><button type="button" className="analysis-add" onClick={onAdd} disabled={!canAdd}>Add to comparison <span aria-hidden="true">＋</span></button><p role="status">{feedback || (canAdd ? 'Compare the same arrival window across up to four places.' : 'Already in your comparison, or the four-site limit is reached.')}</p></footer>
  </section>;
}

function NoCoverage() {
  return <div className="analysis-empty"><span>No terrain survey here</span><h3>A point to investigate.</h3><p>We only have measured terrain, sunlight, Earth-visibility and permanent-shadow maps for the three Artemis III regions so far. Sun & Earth and Earth wobble still work here: they are computed live for any coordinate.</p></div>;
}

function Bar({ value, tone }: { value: number; tone: string }) {
  return <i className="factor-bar" style={{ ['--v' as string]: `${Math.round(Math.max(0, Math.min(1, value)) * 100)}%`, ['--tone' as string]: tone }} />;
}

function WhyHere({ region, mode, slopeLimit }: { region: RegionResult; mode: Mode; slopeLimit: number }) {
  const { grid, areas } = region;
  const L = grid.layers;
  const stats = useMemo(() => {
    let ok = 0; let n = 0; let psr = 0; let sunMax = 0;
    for (let i = 0; i < (L.slope_deg?.length ?? 0); i++) { n++; if ((L.slope_deg![i]) <= slopeLimit) ok++; psr += L.psr?.[i] ?? 0; sunMax = Math.max(sunMax, L.sun_avg?.[i] ?? 0); }
    return { landable: n ? ok / n : 0, psr: n ? psr / n : 0, sunMax };
  }, [L, slopeLimit]);
  if (region.error) return <div className="analysis-empty" role="alert"><span>Ranking unavailable</span><p>{region.error}</p></div>;
  return <>
    <div className="analysis-source">Ranked by your priorities · preview of the engine formula on measured layers</div>
    {areas.length === 0 ? <div className="analysis-empty"><h3>No landable area.</h3><p>No 400 m base footprint here is entirely under the {slopeLimit}° slope limit. Raise the limit in Planner or choose another region.</p></div>
      : <ol className="area-list">{areas.map((a, i) => {
        const sunP = L.sun_avg ? percentile(L.sun_avg, L.sun_avg[a.index]) : 0;
        const earthP = L.earth_avg ? percentile(L.earth_avg, L.earth_avg[a.index]) : 0;
        const sun = L.sun_avg?.[a.index] ?? NaN; const earth = L.earth_avg?.[a.index] ?? NaN; const slope = L.slope_deg?.[a.index] ?? NaN;
        const weakest = ([['sunlight', a.factors.sun], ['Earth contact', a.factors.earth], ['flat ground', a.factors.slope], ['shallow terrain', a.factors.crater]] as const).reduce((m, f) => f[1] < m[1] ? f : m);
        return <li key={a.index}>
          <header><b>{i + 1}</b><span>Area {i + 1}<small>{formatCoordinates(a.lat, a.lon)}</small></span><em>{a.score.toFixed(2)}</em></header>
          {mode === 'explorer' ? <p className="area-story">
            The Sun is up here <b>{LAYERS.sun.format(sun)}</b> of the time (sunnier than {Math.min(99, sunP)}% of this region) and Earth is in view <b>{LAYERS.earth.format(earth)}</b> of the time for direct radio.
            {Number.isFinite(a.iceKm) ? <> The nearest permanently shadowed cold trap, where water ice can survive, is <b>{a.iceKm.toFixed(1)} km</b> away.</> : <> No permanently shadowed ground lies inside this 20 km survey.</>}
            {' '}Trade-off: its weakest point is {weakest[0]}.
          </p> : <dl className="area-factors">
            <div><dt>Sunlight</dt><dd>{LAYERS.sun.format(sun)} <small>p{sunP}</small></dd><Bar value={a.factors.sun} tone="#e9a23b"/></div>
            <div><dt>Earth contact</dt><dd>{LAYERS.earth.format(earth)} <small>p{earthP}</small></dd><Bar value={a.factors.earth} tone="#5aa2f0"/></div>
            <div><dt>Slope</dt><dd>{slope.toFixed(1)}° / {slopeLimit}°</dd><Bar value={a.factors.slope} tone="#f0b979"/></div>
            <div><dt>Crater relief</dt><dd>{(L.crater_depth_m?.[a.index] ?? NaN).toFixed(0)} m</dd><Bar value={a.factors.crater} tone="#f0b979"/></div>
            <div><dt>Ice trap</dt><dd>{Number.isFinite(a.iceKm) ? `${a.iceKm.toFixed(1)} km` : 'none in survey'}</dd><Bar value={Number.isFinite(a.factors.ice) ? a.factors.ice : 0} tone="#3cc9da"/></div>
          </dl>}
        </li>;
      })}</ol>}
    <dl className="analysis-stats">
      <div><dt>Landable cells</dt><dd>{Math.round(stats.landable * 100)}%</dd></div>
      <div><dt>Best sunlight</dt><dd>{LAYERS.sun.format(stats.sunMax)}</dd></div>
      <div><dt>Cold-trap area</dt><dd>{(stats.psr * 100).toFixed(1)}%</dd></div>
    </dl>
    <p className="analysis-note">Sunlight and Earth visibility are 18.6-year averages (not your date). The engine's date-specific scores will replace this preview. Rankings explain trade-offs under your priorities; they are not a safety certification.</p>
  </>;
}

const HOURS = 72;
function SkyView({ location, date, mode }: { location: AnalysisLocation; date: string; mode: Mode }) {
  const data = useMemo(() => {
    const t0 = Date.parse(date);
    const samples = Array.from({ length: HOURS + 1 }, (_, h) => ({ h, ...siteSky(location.lat, location.lon, new Date(t0 + h * 3_600_000)) }));
    // geometric sunset/earthset: first hour the centre drops below 0° (terrain ignored), searched up to 30 days
    const next = (body: 'sun' | 'earth') => {
      const up = samples[0][body].el > 0;
      for (let h = 1; h <= 720; h++) { const s = siteSky(location.lat, location.lon, new Date(t0 + h * 3_600_000))[body].el > 0; if (s !== up) return { h, up }; }
      return { h: null as number | null, up };
    };
    return { samples, sunset: next('sun'), earthset: next('earth') };
  }, [location.lat, location.lon, date]);
  const els = data.samples.flatMap(s => [s.sun.el, s.earth.el]);
  const lo = Math.min(-5, Math.floor(Math.min(...els))); const hi = Math.max(10, Math.ceil(Math.max(...els)));
  const x = (h: number) => 44 + h / HOURS * 380; const y = (el: number) => 180 - (el - lo) / (hi - lo) * 160;
  const line = (body: 'sun' | 'earth') => data.samples.map(s => `${x(s.h).toFixed(1)},${y(s[body].el).toFixed(1)}`).join(' ');
  const now = data.samples[0];
  const event = (e: { h: number | null; up: boolean }, body: string) => e.h === null ? `${body} stays ${e.up ? 'up' : 'down'} for 30+ days` : `${body} ${e.up ? 'sets' : 'rises'} in ${e.h < 48 ? `${e.h} h` : `${(e.h / 24).toFixed(1)} days`}`;
  return <>
    <div className="analysis-source">Astronomy Engine · checked against JPL Horizons (±0.003°) · flat horizon, terrain not included</div>
    <div className="sky-now">
      <div className="sky-sun"><span>SUN</span><b>{now.sun.el.toFixed(2)}°</b><small>az {now.sun.az.toFixed(1)}° · {event(data.sunset, 'Sun')}</small></div>
      <div className="sky-earth"><span>EARTH</span><b>{now.earth.el.toFixed(2)}°</b><small>az {now.earth.az.toFixed(1)}° · {event(data.earthset, 'Earth')}</small></div>
    </div>
    <svg className="analysis-chart" viewBox="0 0 440 210" role="img" aria-label={`Sun and Earth elevation over the next ${HOURS} hours. Sun now ${now.sun.el.toFixed(1)} degrees, Earth ${now.earth.el.toFixed(1)} degrees.`}>
      {[lo, 0, hi].map(el => <g key={el}><line className={el === 0 ? 'zero' : ''} x1="44" x2="424" y1={y(el)} y2={y(el)}/><text x="38" y={y(el) + 3} textAnchor="end">{el}°</text></g>)}
      {[0, 24, 48, 72].map(h => <text key={h} x={x(h)} y="198" textAnchor="middle">+{h}h</text>)}
      <polyline className="sun" points={line('sun')} /><polyline className="earth" points={line('earth')} />
      <text x={x(HOURS) - 2} y={y(data.samples[HOURS].sun.el) - 6} textAnchor="end" className="label-sun">Sun</text>
      <text x={x(HOURS) - 2} y={y(data.samples[HOURS].earth.el) - 6} textAnchor="end" className="label-earth">Earth</text>
      <text x="46" y={y(0) - 4} className="zero-label">0° flat horizon</text>
    </svg>
    <p className="analysis-note">{mode === 'explorer'
      ? 'At the south pole the Sun never climbs high: it circles the sky just above the horizon, so a hill a few degrees tall can block it. That is why ridges matter.'
      : 'Topocentric elevation of the body centre from a site on the 1,737.4 km sphere (parallax and libration included). Terrain masks come from the engine (pending), so real sunset/Earthset can be earlier.'}</p>
  </>;
}

const WOBBLE_DAYS = 30;
function Wobble({ location, date, mode }: { location: AnalysisLocation; date: string; mode: Mode }) {
  const pts = useMemo(() => {
    const t0 = Date.parse(date);
    return Array.from({ length: WOBBLE_DAYS * 4 + 1 }, (_, i) => {
      const t = new Date(t0 + i * 6 * 3_600_000);
      const row = sunEarthAt(t);
      return { i, lat: row.earth_lat, lon: row.earth_lon, el: siteSky(location.lat, location.lon, t).earth.el };
    });
  }, [date, location.lat, location.lon]);
  const sx = (lon: number) => 120 + lon / 9 * 100; const sy = (lat: number) => 110 - lat / 8 * 90;
  const up = pts.filter(p => p.el > 0).length / pts.length;
  const elMin = Math.min(...pts.map(p => p.el)); const elMax = Math.max(...pts.map(p => p.el));
  const ex = (i: number) => 262 + i / (pts.length - 1) * 168; const ey = (el: number) => 180 - (el - Math.min(-2, elMin)) / (Math.max(2, elMax) - Math.min(-2, elMin)) * 140;
  const cur = pts[0];
  return <>
    <div className="analysis-source">Libration of the sub-Earth point · next {WOBBLE_DAYS} days · Astronomy Engine</div>
    <svg className="analysis-chart wobble" viewBox="0 0 440 210" role="img" aria-label={`Earth's apparent wobble: sub-Earth point now ${cur.lat.toFixed(1)} degrees latitude, ${cur.lon.toFixed(1)} degrees longitude. Earth is above this site's flat horizon ${Math.round(up * 100)} percent of the next ${WOBBLE_DAYS} days.`}>
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
      <div><dt>Earth above horizon</dt><dd>{Math.round(up * 100)}%</dd></div>
    </dl>
    <p className="analysis-note">{mode === 'explorer'
      ? 'The Moon always shows Earth the same face, but its tilted, elliptical orbit makes it rock back and forth ("libration"). From the south pole, Earth sits right at the horizon, so this wobble decides when you can talk to home.'
      : 'Optical libration in latitude (±6.7°) and longitude (±7.9°) moves the sub-Earth point; near the pole that maps almost one-to-one onto Earth elevation. Flat horizon; terrain masks pending.'}</p>
  </>;
}

function Evidence({ location, region }: { location: AnalysisLocation; region?: RegionResult }) {
  const [check, setCheck] = useState<{ status: 'loading' | 'ready' | 'none' | 'error'; data?: AnalysisData; worst?: number; n?: number }>({ status: region ? 'loading' : 'none' });
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
      setCheck({ status: 'ready', data, worst, n });
    }).catch(() => { if (!controller.signal.aborted) setCheck({ status: 'error' }); });
    return () => controller.abort();
  }, [location.id, region]);
  const urls = region ? [...new Set(region.grid.header.source_urls)] : [];
  return <div data-tour-anchor="evidence-panel">
    <div className="analysis-source">What each layer is, and where it came from</div>
    <ul className="evidence-list">
      {(['sun', 'earth', 'ice', 'favorability', 'imagery', 'relief', 'elevation', 'slope', 'roughness', 'score'] as const).map(k => { const L = k === 'score' && region ? scoreLayer(region.source) : LAYERS[k]; return <li key={k}><span className={`chip chip-${L.status}`}>{L.status === 'preview' && k === 'favorability' ? 'model' : L.status}</span><b>{L.label}</b><small>{L.citation}. {L.caveat}</small></li>; })}
      <li><span className="chip chip-real">real</span><b>Date-specific sunlight, Earth contact, thermal</b><small>Rust/WASM engine over LOLA horizon masks and the JPL Horizons table: compare cards use site_metrics, the suitability layer uses grid_fracs + scores_from_fracs (precomputed for demo dates, computed in your browser otherwise).</small></li>
    </ul>
    <div className="analysis-source">Ephemeris check vs JPL Horizons</div>
    {check.status === 'ready' ? <p className="analysis-note"><b>{check.n} samples</b> of Sun and Earth elevation for {location.name} (Jan 2026, Jul 2028) agree with JPL Horizons to <b>{check.worst!.toFixed(4)}°</b> worst case (computed in your browser now).</p>
      : check.status === 'loading' ? <p role="status" className="analysis-note">Comparing against JPL Horizons…</p>
      : check.status === 'error' ? <p role="alert" className="analysis-note">Reference table unavailable.</p>
      : <p className="analysis-note">JPL reference samples exist for the three surveyed regions; select one to run the check.</p>}
    {urls.length > 0 && <ul className="analysis-sources">{urls.map((url, i) => <li key={url}><a href={url} target="_blank" rel="noreferrer">Source {i + 1} · {new URL(url).hostname}{new URL(url).pathname.length > 1 ? ` · ${new URL(url).pathname.split('/').filter(Boolean).pop()}` : ''} ↗</a></li>)}</ul>}
  </div>;
}
