import { site_metrics, MOCK_PARAMS, UnavailableScenario } from '../../engine';
import type { DemoData } from '../data';
import type { Scenario } from '../scenario';
import { Card, Badge } from '../ui';
export function ResultsPanel({ data, scenario }: { data: DemoData; scenario: Scenario }) {
  const sites = data.sites.filter(site => scenario.sites.includes(site.id));
  return <aside className="results-panel" aria-label="Site comparison"><div className="panel-heading"><span className="eyebrow">03 / COMPARE</span><h2>Selected sites</h2><p className="hint">Synthetic examples · not mission results</p></div>
    {sites.length === 0 ? <Card><h3>No sites selected</h3><p className="hint">Choose a demo site to inspect an example card.</p></Card> : <div className="result-grid">{sites.map(site => {
      try {
        const metrics = site_metrics(data.masks.get(site.id)!, data.table, scenario.date, scenario.hours, MOCK_PARAMS);
        return <Card key={site.id} className="result-card"><div className="card-heading"><h3>{site.name}</h3><Badge>Mock</Badge></div>
          <p className="metric-label">Mean solar elevation</p><p className="primary-metric sun">{metrics.mean_sun_el_deg.toFixed(1)}<span>°</span></p>
          <dl className="metrics"><div><dt>Sunlit fraction</dt><dd className="sun">{metrics.pct_lit}%</dd></div><div><dt>Longest darkness</dt><dd>{metrics.longest_dark_h} h</dd></div><div><dt>Earth contact</dt><dd className="earth">{metrics.pct_earth_visible}%</dd></div><div><dt>Longest blackout</dt><dd>{metrics.longest_blackout_h} h</dd></div><div><dt>Temperature</dt><dd>{metrics.t_min_k}–{metrics.t_max_k} K</dd></div></dl>
        </Card>;
      } catch (error) {
        return <Card key={site.id}><h3>{site.name}</h3><p className="hint">{error instanceof UnavailableScenario ? error.message : 'Example results are unavailable.'}</p></Card>;
      }
    })}</div>}
    <p className="assumptions">Temperature model: simplified, no thermal inertia. Earth contact assumes a DSN station can see the Moon; no relay coverage.</p>
  </aside>;
}
