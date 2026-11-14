import { site_metrics, MOCK_PARAMS, UnavailableScenario } from '../../engine';
import type { DemoData } from '../data';
import type { Scenario } from '../scenario';
import type { Metrics } from '../../contracts/engine-api';
import { bestValues, countdown, DEFAULT_THRESHOLDS, metricValue, siteStatus, type MetricKey } from '../../features/compare/metrics';
import { parseCustomSite } from '../../features/sites/sites';
import { Card, Badge } from '../ui';

interface SiteResult {
  id: string;
  name: string;
  metrics: Metrics | null;
  message: string | null;
}

const statusTone = { green: 'success', yellow: 'warning', red: 'danger' } as const;
const statusLabel = { green: 'Within limits', yellow: 'Review', red: 'Outside limits' } as const;

function Metric({ label, value, tone, fill, best }: { label: string; value: string; tone?: 'sun' | 'earth' | 'thermal'; fill?: number; best?: boolean }) {
  return <div className={`metric-row ${tone ? `metric-${tone}` : ''} ${best ? 'metric-best' : ''}`}><div><dt>{label}{best && <span className="best-tag">Best</span>}</dt><dd>{value}</dd></div>{fill !== undefined && <span className="metric-track" aria-hidden="true"><i style={{ width: `${Math.max(0, Math.min(100, fill))}%` }}/></span>}</div>;
}

export function ResultsPanel({ data, scenario }: { data: DemoData; scenario: Scenario }) {
  const results: SiteResult[] = scenario.sites.map(id => {
    const site = data.sites.find(item => item.id === id);
    const name = site?.name ?? customName(id);
    if (!site) return { id, name, metrics: null, message: 'Custom coordinates are plotted in the view. Terrain metrics need a horizon mask, and none exists for this point yet.' };
    try {
      return { id, name, metrics: site_metrics(data.masks.get(site.id)!, data.table, scenario.date, scenario.hours, MOCK_PARAMS), message: null };
    } catch (error) {
      return { id, name, metrics: null, message: error instanceof UnavailableScenario ? error.message : 'Example results are unavailable.' };
    }
  });
  const computed = results.map(result => result.metrics).filter((metrics): metrics is Metrics => metrics !== null);
  const best = bestValues(computed);
  const rows: { key: MetricKey; label: string; text: (m: Metrics) => string; tone?: 'sun' | 'earth' | 'thermal'; fill?: (m: Metrics) => number }[] = [
    { key: 'litPercent', label: 'Sunlit window', text: m => `${m.pct_lit}%`, tone: 'sun', fill: m => m.pct_lit },
    { key: 'longestDarknessHours', label: 'Longest darkness', text: m => `${m.longest_dark_h} h`, tone: 'sun' },
    { key: 'earthContactPercent', label: 'Earth contact', text: m => `${m.pct_earth_visible}%`, tone: 'earth', fill: m => m.pct_earth_visible },
    { key: 'longestBlackoutHours', label: 'Longest blackout', text: m => `${m.longest_blackout_h} h`, tone: 'earth' },
  ];
  return <aside className="results-panel" aria-label="Site comparison"><div className="panel-heading"><span className="eyebrow">03 / COMPARE</span><h2>Window summary</h2><p className="hint">Synthetic examples · not mission results</p></div>
    {results.length === 0 ? <Card><h3>No sites selected</h3><p className="hint">Choose a demo site to inspect an example card.</p></Card> : <div className="result-grid">{results.map((result, index) => {
      const { metrics } = result;
      if (!metrics) return <Card key={result.id}><h3>{result.name}</h3><p className="hint">{result.message}</p></Card>;
      const status = siteStatus(metrics, DEFAULT_THRESHOLDS);
      return <Card key={result.id} className="result-card"><div className="card-heading"><div><span className="result-index">SITE {String(index + 1).padStart(2, '0')}</span><h3>{result.name}</h3></div><Badge tone={statusTone[status.status]} title={status.reason}>{statusLabel[status.status]}</Badge></div>
        <div className="primary-reading"><span className="metric-label">Mean solar elevation</span><p className="primary-metric sun">{metrics.mean_sun_el_deg.toFixed(1)}<span>°</span></p></div>
        <dl className="metrics">{rows.map(row => <Metric key={row.key} label={row.label} value={row.text(metrics)} tone={row.tone} fill={row.fill?.(metrics)} best={metricValue(metrics, row.key) === best[row.key]} />)}<Metric label="Temperature range" value={`${metrics.t_min_k}–${metrics.t_max_k} K`} tone="thermal"/></dl>
        <div className="event-countdowns"><span>Sunset in <b>{countdown(metrics.h_to_first_sunset)}</b></span><span>Earthset in <b>{countdown(metrics.h_to_first_earthset)}</b></span></div>
        <p className="card-reason">{status.reason}</p>
      </Card>;
    })}</div>}
    <p className="assumptions">Status uses demo thresholds: ≥70% sunlit, ≥60% Earth contact, ≤48 h darkness, ≤24 h blackout. Temperature model: simplified, no thermal inertia. Earth contact assumes a DSN station can see the Moon; no relay coverage.</p>
  </aside>;
}

function customName(id: string): string {
  const custom = parseCustomSite(id);
  return custom ? `${Math.abs(custom.lat).toFixed(2)}°S · ${custom.lon.toFixed(2)}°E` : id;
}
