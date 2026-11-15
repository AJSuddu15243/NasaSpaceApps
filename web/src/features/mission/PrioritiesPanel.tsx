import type { Scenario } from '../../shell/scenario';
import type { RegionResult } from './useMissionData';
import type { GridRegion } from '../heatmap/grid';

type Change = (patch: Partial<Scenario>, replace?: boolean) => void;
type W = Scenario['weights'];
const PRESETS: { id: string; label: string; text: string; weights: W; ice: number }[] = [
  { id: 'balanced', label: 'Balanced landing', text: 'Sunlight and Earth contact first, then safe ground.', weights: { sun: 50, earth: 35, slope: 10, crater: 5, rock: 0, thermal: 0 }, ice: 0 },
  { id: 'power', label: 'Maximum solar power', text: 'Stay in the light as long as possible.', weights: { sun: 80, earth: 10, slope: 10, crater: 0, rock: 0, thermal: 0 }, ice: 0 },
  { id: 'comms', label: 'Always talk to Earth', text: 'Direct radio contact matters most.', weights: { sun: 25, earth: 65, slope: 10, crater: 0, rock: 0, thermal: 0 }, ice: 0 },
  { id: 'ice', label: 'Land near water ice', text: 'Reach a permanently shadowed cold trap while staying lit.', weights: { sun: 35, earth: 15, slope: 10, crater: 0, rock: 0, thermal: 0 }, ice: 40 },
];
const FACTORS: { key: keyof W | 'ice'; label: string; note?: string }[] = [
  { key: 'sun', label: 'Sunlight' }, { key: 'earth', label: 'Earth contact' }, { key: 'slope', label: 'Low slope' }, { key: 'crater', label: 'Shallow terrain' },
  { key: 'ice', label: 'Ice access', note: 'preview factor' }, { key: 'rock', label: 'Smooth ground', note: 'roughness proxy' },
];

const same = (a: W, b: W) => (['sun', 'earth', 'slope', 'crater', 'rock'] as const).every(k => a[k] === b[k]);

/** Explorer: plain-language presets. Planner: exact weights, hard limit and CSV export of ranked areas. */
export function PrioritiesPanel({ scenario, change, results }: { scenario: Scenario; change: Change; results: Partial<Record<GridRegion, RegionResult>> }) {
  const active = PRESETS.find(p => same(p.weights, scenario.weights) && p.ice === scenario.ice)?.id;
  const total = (['sun', 'earth', 'slope', 'crater', 'rock'] as const).reduce((a, k) => a + scenario.weights[k], 0) + scenario.ice;
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
        const share = total > 0 ? Math.round(value / total * 100) : 0;
        return <label className="weight-row" key={f.key}><span>{f.label}{f.note && <i> · {f.note}</i>}</span><output>{share}%</output>
          <input type="range" min={0} max={100} step={1} value={value} aria-label={`${f.label} weight`} onChange={event => {
            const v = Number(event.target.value);
            change(f.key === 'ice' ? { ice: v, heat: 'score' } : { weights: { ...scenario.weights, [f.key]: v }, heat: 'score' }, true);
          }} /></label>;
      })}
      {total === 0 && <p className="hud-warning" role="alert">Every weight is 0: give at least one factor a weight to rank areas.</p>}
      <label className="weight-row limit-row"><span>Slope limit <i>· hard rule</i></span><output>{scenario.slopeLimit}°</output>
        <input type="range" min={3} max={20} step={1} value={scenario.slopeLimit} aria-label="Maximum landing slope in degrees" onChange={event => change({ slopeLimit: Number(event.target.value) }, true)} /></label>
      <p className="hud-note">Cells steeper than the limit are excluded. Thermal is not scored yet (engine pending). Sunlight and Earth use long-term averages.</p>
      <button type="button" className="hud-button" onClick={() => exportCsv(results, scenario)}>Export ranked areas (CSV)</button>
    </>}
  </div>;
}

function exportCsv(results: Partial<Record<GridRegion, RegionResult>>, scenario: Scenario) {
  const rows = [['region', 'rank', 'lat_deg', 'lon_deg', 'score', 'sun_avg', 'earth_avg', 'slope_factor', 'crater_factor', 'ice_km', 'slope_limit_deg', 'weights_sun_earth_slope_crater_rock_ice']];
  for (const [region, r] of Object.entries(results)) r?.areas.forEach((a, i) => rows.push([region, String(i + 1), a.lat.toFixed(5), a.lon.toFixed(5), a.score.toFixed(4), a.factors.sun.toFixed(3), a.factors.earth.toFixed(3), a.factors.slope.toFixed(3), a.factors.crater.toFixed(3), Number.isFinite(a.iceKm) ? a.iceKm.toFixed(2) : '', String(scenario.slopeLimit), [scenario.weights.sun, scenario.weights.earth, scenario.weights.slope, scenario.weights.crater, scenario.weights.rock, scenario.ice].join(' ')]));
  const blob = new Blob([rows.map(r => r.join(',')).join('\n') + '\n'], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'lunar-window-ranked-areas.csv'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
