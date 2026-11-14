import { site_metrics, MOCK_PARAMS, UnavailableScenario } from '../../engine';
import type { DemoData } from '../data';
import type { Scenario } from '../scenario';
import { Card, Badge } from '../ui';
function Metric({ label, value, tone, fill }: { label: string; value: string; tone?: 'sun' | 'earth' | 'thermal'; fill?: number }) {
  return <div className={`metric-row ${tone ? `metric-${tone}` : ''}`}><div><dt>{label}</dt><dd>{value}</dd></div>{fill !== undefined && <span className="metric-track" aria-hidden="true"><i style={{ width: `${Math.max(0, Math.min(100, fill))}%` }}/></span>}</div>;
}
export function ResultsPanel({ data, scenario }: { data: DemoData; scenario: Scenario }) {
  const sites = data.sites.filter(site => scenario.sites.includes(site.id));
  return <aside className="results-panel" aria-label="Site comparison"><div className="panel-heading"><span className="eyebrow">03 / COMPARE</span><h2>Window summary</h2><p className="hint">Synthetic examples · not mission results</p></div>
    {sites.length === 0 ? <Card><h3>No sites selected</h3><p className="hint">Choose a demo site to inspect an example card.</p></Card> : <div className="result-grid">{sites.map(site => {
      try {
        const metrics = site_metrics(data.masks.get(site.id)!, data.table, scenario.date, scenario.hours, MOCK_PARAMS);
        return <Card key={site.id} className="result-card"><div className="card-heading"><div><span className="result-index">SITE {String(sites.indexOf(site) + 1).padStart(2, '0')}</span><h3>{site.name}</h3></div><Badge tone="warning">Mock</Badge></div>
          <div className="primary-reading"><span className="metric-label">Mean solar elevation</span><p className="primary-metric sun">{metrics.mean_sun_el_deg.toFixed(1)}<span>°</span></p></div>
          <dl className="metrics"><Metric label="Sunlit window" value={`${metrics.pct_lit}%`} fill={metrics.pct_lit} tone="sun"/><Metric label="Longest darkness" value={`${metrics.longest_dark_h} h`} tone="sun"/><Metric label="Earth contact" value={`${metrics.pct_earth_visible}%`} fill={metrics.pct_earth_visible} tone="earth"/><Metric label="Longest blackout" value={`${metrics.longest_blackout_h} h`} tone="earth"/><Metric label="Temperature range" value={`${metrics.t_min_k}–${metrics.t_max_k} K`} tone="thermal"/></dl>
        </Card>;
      } catch (error) {
        return <Card key={site.id}><h3>{site.name}</h3><p className="hint">{error instanceof UnavailableScenario ? error.message : 'Example results are unavailable.'}</p></Card>;
      }
    })}</div>}
    <p className="assumptions">Temperature model: simplified, no thermal inertia. Earth contact assumes a DSN station can see the Moon; no relay coverage.</p>
  </aside>;
}
