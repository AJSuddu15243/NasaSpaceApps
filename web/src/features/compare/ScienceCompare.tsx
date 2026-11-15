import { siteSky } from '../../ephem';
import { LAYERS } from '../heatmap/layers';
import type { RegionResult } from '../mission/useMissionData';

export interface ComparePlace { id: string; name: string; lat: number; lon: number; region?: RegionResult }
interface Row { label: string; unit?: string; better: 'high' | 'low'; value: (p: ComparePlace) => number | undefined; format: (v: number) => string; note?: string }

const best = (p: ComparePlace) => p.region?.areas[0];
const ROWS: Row[] = [
  { label: 'Best-area score', better: 'high', value: p => best(p)?.score, format: v => v.toFixed(2), note: 'preview' },
  { label: 'Sunlight at best area', better: 'high', value: p => { const a = best(p); return a ? p.region!.grid.layers.sun_avg?.[a.index] : undefined; }, format: LAYERS.sun.format },
  { label: 'Earth contact at best area', better: 'high', value: p => { const a = best(p); return a ? p.region!.grid.layers.earth_avg?.[a.index] : undefined; }, format: LAYERS.earth.format },
  { label: 'Distance to ice trap', better: 'low', value: p => { const a = best(p); return a && Number.isFinite(a.iceKm) ? a.iceKm : undefined; }, format: v => `${v.toFixed(1)} km` },
  { label: 'Landable ground', better: 'high', value: p => { const s = p.region?.scores; if (!s) return undefined; let n = 0; for (const v of s) if (Number.isFinite(v)) n++; return n / s.length; }, format: LAYERS.sun.format },
];

/** Side-by-side comparison of the shortlist. Leaders are only marked when two or more places have a value. */
export function ScienceCompare({ places, date, onInspect, onRemove }: { places: ComparePlace[]; date: string; onInspect: (id: string) => void; onRemove: (id: string) => void }) {
  if (!places.length) return <div className="analysis-empty"><h3>Your shortlist is empty.</h3><p>Open a place and choose “Add to comparison”. You can compare up to four.</p></div>;
  const sky = places.map(p => siteSky(p.lat, p.lon, date));
  const rows: Row[] = [...ROWS,
    { label: 'Sun elevation now', better: 'high', value: p => sky[places.indexOf(p)].sun.el, format: v => `${v.toFixed(1)}°`, note: 'flat horizon' },
    { label: 'Earth elevation now', better: 'high', value: p => sky[places.indexOf(p)].earth.el, format: v => `${v.toFixed(1)}°`, note: 'flat horizon' }];
  return <div className="compare">
    <div className="analysis-source">Measured layers + live ephemeris · playhead {date.slice(0, 16).replace('T', ' ')} UTC</div>
    <div className="compare-scroll"><table>
      <caption className="sr-only">Comparison of {places.length} places</caption>
      <thead><tr><th scope="col">Factor</th>{places.map((p, i) => <th scope="col" key={p.id}><button type="button" onClick={() => onInspect(p.id)}><b>{i + 1}</b>{p.name}</button><button type="button" className="compare-remove" aria-label={`Remove ${p.name} from comparison`} onClick={() => onRemove(p.id)}>×</button></th>)}</tr></thead>
      <tbody>{rows.map(row => {
        const vals = places.map(row.value);
        const finite = vals.filter((v): v is number => v !== undefined && Number.isFinite(v));
        const lead = finite.length >= 2 ? (row.better === 'high' ? Math.max(...finite) : Math.min(...finite)) : undefined;
        return <tr key={row.label}><th scope="row">{row.label}{row.note && <small> · {row.note}</small>}</th>
          {vals.map((v, i) => <td key={places[i].id} className={lead !== undefined && v === lead ? 'is-lead' : ''}>{v === undefined || !Number.isFinite(v) ? <span className="muted">{places[i].region ? '—' : 'no survey'}</span> : <>{row.format(v)}{lead !== undefined && v === lead && <span className="lead-tag"> ▲ leads</span>}</>}</td>)}</tr>;
      })}</tbody>
    </table></div>
    <p className="analysis-note">“Leads” marks the strongest value in a row, not an overall winner: the right site depends on your mission's priorities. Places outside the three surveyed regions only get live Sun and Earth geometry.</p>
  </div>;
}
