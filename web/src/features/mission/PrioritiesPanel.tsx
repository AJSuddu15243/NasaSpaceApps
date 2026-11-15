import type { Scenario } from '../../shell/scenario';
import type { RegionResult } from './useMissionData';
import type { GridRegion } from '../heatmap/grid';
import { scenarioInstant } from '../timeline/MissionTimeline';

type Change = (patch: Partial<Scenario>, replace?: boolean) => void;
type W = Scenario['weights'];
const PRESETS: { id: string; label: string; text: string; weights: W; ice: number }[] = [
  { id: 'balanced', label: 'Balanced landing', text: 'Sunlight and Earth contact first, then safe ground.', weights: { sun: 35, earth: 25, slope: 20, crater: 10, rock: 0, thermal: 10 }, ice: 0 },
  { id: 'power', label: 'Maximum solar power', text: 'Stay in the light as long as possible.', weights: { sun: 80, earth: 10, slope: 10, crater: 0, rock: 0, thermal: 0 }, ice: 0 },
  { id: 'comms', label: 'Always talk to Earth', text: 'Direct radio contact matters most.', weights: { sun: 25, earth: 65, slope: 10, crater: 0, rock: 0, thermal: 0 }, ice: 0 },
  { id: 'ice', label: 'Land near water ice', text: 'Stay lit near a permanently shadowed cold trap. Distance to ice is shown but does not change the engine score.', weights: { sun: 35, earth: 15, slope: 10, crater: 0, rock: 0, thermal: 0 }, ice: 40 },
];
const FACTORS: { key: keyof W | 'ice'; label: string; note?: string }[] = [
  { key: 'sun', label: 'Sunlight' }, { key: 'earth', label: 'Earth contact' }, { key: 'slope', label: 'Low slope' }, { key: 'crater', label: 'Shallow terrain' },
  { key: 'thermal', label: 'Warm enough', note: 'hours above survival temp' }, { key: 'ice', label: 'Ice access' }, { key: 'rock', label: 'Smooth ground', note: 'roughness proxy' },
];
const ENGINE_KEYS = ['sun', 'earth', 'slope', 'crater', 'rock', 'thermal'] as const;

const same = (a: W, b: W) => ENGINE_KEYS.every(k => a[k] === b[k]);
/** Which factors the shown score really uses: the engine scores the six weights; the JS preview adds ice and drops thermal. */
export function weightShares(weights: W, ice: number, engine: boolean): Record<keyof W | 'ice', number | null> {
  const used = (k: keyof W | 'ice') => k === 'ice' ? !engine : engine || k !== 'thermal';
  const value = (k: keyof W | 'ice') => k === 'ice' ? ice : weights[k];
  const keys = [...ENGINE_KEYS, 'ice'] as const;
  const total = keys.reduce((a, k) => a + (used(k) ? value(k) : 0), 0);
  return Object.fromEntries(keys.map(k => [k, !used(k) ? null : total > 0 ? Math.round(value(k) / total * 100) : 0])) as Record<keyof W | 'ice', number | null>;
}

/** Explorer: plain-language presets. Planner: exact weights, hard limit and CSV export of ranked areas. */
export function PrioritiesPanel({ scenario, change, results }: { scenario: Scenario; change: Change; results: Partial<Record<GridRegion, RegionResult>> }) {
  const active = PRESETS.find(p => same(p.weights, scenario.weights) && p.ice === scenario.ice)?.id;
  const engine = Object.values(results).some(r => r && r.source !== 'preview');
  const shares = weightShares(scenario.weights, scenario.ice, engine);
  const sum = ENGINE_KEYS.reduce((acc, k) => acc + scenario.weights[k], 0);
  const total = engine ? sum : sum - scenario.weights.thermal + scenario.ice;
  return <div className="priorities">
    {scenario.mode === 'explorer' ? <>
      <p className="hud-lede">What should your landing site be good at? The suitability heatmap and ranked areas update instantly.</p>
      <div className="preset-list" role="radiogroup" aria-label="Mission priority">
        {PRESETS.map(p => <button type="button" role="radio" aria-checked={active === p.id} key={p.id} onClick={() => change({ weights: p.weights, ice: p.ice, heat: 'score' })}><strong>{p.label}</strong><span>{p.text}</span></button>)}
      </div>
      <p className="hud-note">Switch to <b>Planner</b> for exact weights, the slope limit and data export.</p>
    </> : <>
      <p className="hud-lede">Weights set how much each factor counts in the suitability score (score = Σ weight × factor ÷ Σ weights).</p>
      {FACTORS.map(f => {
        const value = f.key === 'ice' ? scenario.ice : scenario.weights[f.key];
        const share = shares[f.key];
        const note = share === null ? (f.key === 'ice' ? 'not in engine score' : 'not in preview score') : f.note;
        return <label className="weight-row" key={f.key}><span>{f.label}{note && <i> · {note}</i>}</span><output>{share === null ? '—' : `${share}%`}</output>
          <input type="range" min={0} max={100} step={1} value={value} aria-label={`${f.label} weight`} onChange={event => {
            const v = Number(event.target.value);
            change(f.key === 'ice' ? { ice: v, heat: 'score' } : { weights: { ...scenario.weights, [f.key]: v }, heat: 'score' }, true);
          }} /></label>;
      })}
      {total === 0 && <p className="hud-warning" role="alert">Every weight is 0: give at least one factor a weight to rank areas.</p>}
      <label className="weight-row limit-row"><span>Slope limit <i>· hard rule</i></span><output>{scenario.slopeLimit}°</output>
        <input type="range" min={3} max={20} step={1} value={scenario.slopeLimit} aria-label="Maximum landing slope in degrees" onChange={event => change({ slopeLimit: Number(event.target.value) }, true)} /></label>
      <p className="hud-note">Cells steeper than the limit are excluded. {engine
        ? 'Scores come from the Rust/WASM engine for your arrival window (Sunlight, Earth and thermal over date + delay). Ice access is display-only.'
        : 'Engine still computing: the preview uses 18.6-year Sunlight and Earth averages and leaves thermal out.'}</p>
      <button type="button" className="hud-button" onClick={() => exportCsv(results, scenario)}>Export ranked areas (CSV)</button>
    </>}
  </div>;
}

function exportCsv(results: Partial<Record<GridRegion, RegionResult>>, scenario: Scenario) {
  const start = scenarioInstant({ date: scenario.date, delay: scenario.delay });
  const w = scenario.weights;
  const rows = [['region', 'rank', 'lat_deg', 'lon_deg', 'score', 'source', 'sun_earth_basis', 'window_start_utc', 'window_h', 'sun_frac', 'earth_frac', 'thermal_factor', 'slope_factor', 'crater_factor', 'ice_km', 'slope_limit_deg', 'weights_sun_earth_slope_crater_rock_thermal_ice']];
  const f3 = (v: number) => Number.isFinite(v) ? v.toFixed(3) : '';
  for (const [region, r] of Object.entries(results)) r?.areas.forEach((a, i) => rows.push([region, String(i + 1), a.lat.toFixed(5), a.lon.toFixed(5), a.score.toFixed(4), r.source, r.source === 'preview' ? 'long-term 18.6 yr' : 'window', r.source === 'preview' ? '' : start, r.source === 'preview' ? '' : String(scenario.hours), f3(a.factors.sun), f3(a.factors.earth), r.source === 'preview' ? '' : f3(a.factors.thermal), f3(a.factors.slope), f3(a.factors.crater), Number.isFinite(a.iceKm) ? a.iceKm.toFixed(2) : '', String(scenario.slopeLimit), [w.sun, w.earth, w.slope, w.crater, w.rock, w.thermal, scenario.ice].join(' ')]));
  const blob = new Blob([rows.map(r => r.join(',')).join('\n') + '\n'], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'lunar-window-ranked-areas.csv'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
