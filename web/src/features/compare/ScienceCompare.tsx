import { siteSky } from '../../ephem';
import { trackFor } from '../../engine/track';
import { LAYERS } from '../heatmap/layers';
import { gridSiteMask } from './timeline';
import type { RegionResult } from '../mission/useMissionData';
import type { DemoData } from '../../shell/data';
import type { Params } from '../../contracts/engine-api';
import type { SiteMask } from '../../contracts/site-mask';

export interface ComparePlace { id: string; name: string; lat: number; lon: number; region?: RegionResult }
/** Sky at the playhead: engine site_track (terrain mask) when the place has one, else flat-horizon geometry. */
export interface SkyNow { sunEl: number; earthEl: number; sunLit: number; earthVis: number; flat: boolean }
interface Row { label: string; better: 'high' | 'low'; value: (p: ComparePlace, i: number) => number | undefined; format: (v: number) => string; note?: string; flat?: boolean }

const best = (p: ComparePlace) => p.region?.areas[0];
const pctOf = (v: number) => `${Math.round(v * 100)}%`;

/** Engine track for one hour at the playhead; demo-*, maskless places and engine failures fall back to flat geometry. */
export function skyNow(p: ComparePlace, date: string, masks?: Map<string, SiteMask>, table?: DemoData['table'], params?: Params): SkyNow {
  const mask = p.id.startsWith('demo-') ? undefined : masks?.get(p.id) ?? (p.region ? gridSiteMask(p.region.grid, p.id, p.lat, p.lon) ?? undefined : undefined);
  if (mask && table && params) {
    try {
      const t = trackFor(mask, table, date, 1, params);
      return { sunEl: t.sunEl[0], earthEl: t.earthEl[0], sunLit: t.sunLit[0], earthVis: t.earthVis[0], flat: false };
    } catch { /* engine not loaded or outside the table: flat geometry below */ }
  }
  const sky = siteSky(p.lat, p.lon, date);
  return { sunEl: sky.sun.el, earthEl: sky.earth.el, sunLit: sky.sun.el > 0 ? 1 : 0, earthVis: sky.earth.el > 0 ? 1 : 0, flat: true };
}

/** Side-by-side comparison of the shortlist. Leaders are only marked when two or more places have a value. */
export function ScienceCompare({ places, date, masks, table, params, onInspect, onRemove }: { places: ComparePlace[]; date: string; masks?: Map<string, SiteMask>; table?: DemoData['table']; params?: Params; onInspect: (id: string) => void; onRemove: (id: string) => void }) {
  if (!places.length) return <div className="analysis-empty"><h3>Your shortlist is empty.</h3><p>Open a place and choose “Add to comparison”. You can compare up to four.</p></div>;
  const sky = places.map(p => skyNow(p, date, masks, table, params));
  // Engine scores and window fractions replace the JS preview (18.6-yr averages) once grid_fracs arrive.
  const preview = places.some(p => p.region?.source === 'preview');
  const windowNote = preview ? 'long-term (18.6 yr) until the engine finishes' : 'arrival window, engine';
  const rows: Row[] = [
    { label: 'Best-area score', better: 'high', value: p => best(p)?.score, format: v => v.toFixed(2), note: preview ? 'preview' : 'engine' },
    { label: 'Sunlight at best area', better: 'high', value: p => { const a = best(p); return a ? p.region!.factors.sun_frac[a.index] : undefined; }, format: LAYERS.sun.format, note: windowNote },
    { label: 'Earth contact at best area', better: 'high', value: p => { const a = best(p); return a ? p.region!.factors.earth_frac[a.index] : undefined; }, format: LAYERS.earth.format, note: windowNote },
    { label: 'Sunlight at best area', better: 'high', value: p => { const a = best(p); return a ? p.region!.grid.layers.sun_avg?.[a.index] : undefined; }, format: LAYERS.sun.format, note: 'long-term (18.6 yr)' },
    { label: 'Earth contact at best area', better: 'high', value: p => { const a = best(p); return a ? p.region!.grid.layers.earth_avg?.[a.index] : undefined; }, format: LAYERS.earth.format, note: 'long-term (18.6 yr)' },
    { label: 'Distance to ice trap', better: 'low', value: p => { const a = best(p); return a && Number.isFinite(a.iceKm) ? a.iceKm : undefined; }, format: v => `${v.toFixed(1)} km` },
    { label: 'Landable ground', better: 'high', value: p => { const s = p.region?.scores; if (!s) return undefined; let n = 0; for (const v of s) if (Number.isFinite(v)) n++; return n / s.length; }, format: LAYERS.sun.format },
    { label: 'Sun elevation now', better: 'high', value: (_, i) => sky[i].sunEl, format: v => `${v.toFixed(1)}°`, flat: true },
    { label: 'Sun disk above terrain now', better: 'high', value: (_, i) => sky[i].sunLit, format: pctOf, flat: true },
    { label: 'Earth elevation now', better: 'high', value: (_, i) => sky[i].earthEl, format: v => `${v.toFixed(1)}°`, flat: true },
    { label: 'Earth in view now', better: 'high', value: (_, i) => sky[i].earthVis, format: v => v > 0 ? 'yes' : 'no', flat: true },
  ];
  return <div className="compare">
    <div className="analysis-source">Rust/WASM engine · LOLA terrain · JPL Horizons · playhead {date.slice(0, 16).replace('T', ' ')} UTC</div>
    <div className="compare-scroll"><table>
      <caption className="sr-only">Comparison of {places.length} places</caption>
      <thead><tr><th scope="col">Factor</th>{places.map((p, i) => <th scope="col" key={p.id}><button type="button" onClick={() => onInspect(p.id)}><b>{i + 1}</b>{p.name}</button><button type="button" className="compare-remove" aria-label={`Remove ${p.name} from comparison`} onClick={() => onRemove(p.id)}>×</button></th>)}</tr></thead>
      <tbody>{rows.map(row => {
        const vals = places.map(row.value);
        const finite = vals.filter((v): v is number => v !== undefined && Number.isFinite(v));
        // Engine-horizon vs flat-horizon values are not comparable: no lead mark in a mixed "now" row.
        const mixed = row.flat && sky.some(s => s.flat) && sky.some(s => !s.flat);
        const lead = finite.length >= 2 && !mixed ? (row.better === 'high' ? Math.max(...finite) : Math.min(...finite)) : undefined;
        return <tr key={`${row.label}|${row.note ?? ''}`}><th scope="row">{row.label}{row.note && <small> · {row.note}</small>}</th>
          {vals.map((v, i) => <td key={places[i].id} className={lead !== undefined && v === lead ? 'is-lead' : ''}>{v === undefined || !Number.isFinite(v) ? <span className="muted">{places[i].region ? '—' : 'no survey'}</span> : <>{row.format(v)}{row.flat && sky[i].flat && <small> · flat horizon</small>}{lead !== undefined && v === lead && <span className="lead-tag"> ▲ leads</span>}</>}</td>)}</tr>;
      })}</tbody>
    </table></div>
    <p className="analysis-note">“Leads” marks the strongest value in a row, not an overall winner: the right site depends on your mission's priorities. “Now” rows use the engine's terrain horizon; places without a horizon mask (outside the three surveyed regions, or synthetic demo sites) get Sun and Earth geometry over a flat horizon.</p>
  </div>;
}
