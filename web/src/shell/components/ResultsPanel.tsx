import { site_metrics, MOCK_PARAMS, UnavailableScenario } from '../../engine';
import type { DemoData } from '../data';
import type { Scenario } from '../scenario';
import type { Metrics } from '../../contracts/engine-api';
import { bestValues, countdown, DEFAULT_THRESHOLDS, metricValue, siteStatus, type MetricKey } from '../../features/compare/metrics';
import { parseCustomSite } from '../../features/sites/sites';
import { ChevronRight } from 'lucide-react';
import { Badge } from '../ui';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../design';

interface SiteResult {
  id: string;
  name: string;
  metrics: Metrics | null;
  message: string | null;
}

const statusTone = { green: 'success', yellow: 'warning', red: 'danger' } as const;
const statusLabel = { green: 'Within limits', yellow: 'Review', red: 'Outside limits' } as const;

const rows: { key: MetricKey; label: string; short: string; text: (m: Metrics) => string; tip: string }[] = [
  { key: 'litPercent', label: 'Sunlit window', short: 'Sunlit', text: m => `${m.pct_lit}%`, tip: 'Share of the window the site spends in sunlight — drives solar power.' },
  { key: 'longestDarknessHours', label: 'Longest darkness', short: 'Darkness', text: m => `${m.longest_dark_h} h`, tip: 'Longest unbroken stretch without sunlight; radiators and batteries must survive it.' },
  { key: 'earthContactPercent', label: 'Earth contact', short: 'Earth contact', text: m => `${m.pct_earth_visible}%`, tip: 'Share of the window with a clear line of sight to Earth for direct-to-Earth comms.' },
  { key: 'longestBlackoutHours', label: 'Longest blackout', short: 'Blackout', text: m => `${m.longest_blackout_h} h`, tip: 'Longest stretch with neither Sun nor Earth visible — the worst-case comms gap.' },
];

export function ResultsPanel({ data, scenario, onCollapse }: { data: DemoData; scenario: Scenario; onCollapse?: () => void }) {
  const results: SiteResult[] = scenario.sites.map(id => {
    const site = data.sites.find(item => item.id === id);
    const name = site?.name ?? customName(id);
    if (!site) return { id, name, metrics: null, message: 'Custom coordinates are plotted in the view. Terrain metrics need a horizon mask, and none exists for this point yet.' };
    if (!data.masks.has(site.id)) return { id, name, metrics: null, message: 'Horizon mask pending — the pipeline has not shipped terrain data for this region yet.' };
    try {
      return { id, name, metrics: site_metrics(data.masks.get(site.id)!, data.table, scenario.date, scenario.hours, MOCK_PARAMS), message: null };
    } catch (error) {
      return { id, name, metrics: null, message: error instanceof UnavailableScenario ? error.message : 'Example results are unavailable.' };
    }
  });
  const computed = results.map(result => result.metrics).filter((metrics): metrics is Metrics => metrics !== null);
  const best = bestValues(computed);
  const showTable = computed.length > 1;

  return <aside className="ws-results rs" aria-label="Site comparison">
    <div className="ws-panel-head">
      <div><h2>Compare</h2><p className="ws-panel-sub">Example metrics · real regions pending pipeline data</p></div>
      {onCollapse && <button type="button" className="panel-collapse-btn" onClick={onCollapse} aria-label="Collapse comparison panel"><ChevronRight size={14} aria-hidden="true" /></button>}
    </div>
    <div className="ws-scroll">
      {showTable && <div className="rs-table-wrap"><table className="rs-table">
        <caption className="sr-only">Metric comparison across selected sites; best value per row is highlighted.</caption>
        <thead><tr><th scope="col">Metric</th>{results.map(result => <th key={result.id} scope="col" title={result.name}>{shortName(result.name)}</th>)}</tr></thead>
        <tbody>{rows.map(row => <tr key={row.key}><th scope="row"><TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild><span className="rs-th-tip">{row.short}</span></TooltipTrigger><TooltipContent>{row.tip}</TooltipContent></Tooltip></TooltipProvider></th>{results.map(result => {
          const value = result.metrics ? metricValue(result.metrics, row.key) : null;
          const isBest = value !== null && value === best[row.key];
          return <td key={result.id} className={isBest ? 'rs-best' : undefined}>{result.metrics ? row.text(result.metrics) : '—'}</td>;
        })}</tr>)}<tr><th scope="row">Temp range</th>{results.map(result => <td key={result.id}>{result.metrics ? `${result.metrics.t_min_k}–${result.metrics.t_max_k} K` : '—'}</td>)}</tr></tbody>
      </table></div>}
      {showTable && <p className="rs-units">● best in row · temps in kelvin · times in hours</p>}

      {results.length === 0
        ? <p className="rs-empty">Choose a demo site to inspect an example card.</p>
        : <div className="rs-sites">{results.map((result, index) => {
          const { metrics } = result;
          if (!metrics) return <div key={result.id} className="rs-card"><h3>{result.name}</h3><p className="rs-reason">{result.message}</p></div>;
          const status = siteStatus(metrics, DEFAULT_THRESHOLDS);
          return <div key={result.id} className="rs-card">
            <div className="rs-card-head"><div><span className="rs-idx">SITE {String(index + 1).padStart(2, '0')}</span><h3>{result.name}</h3></div><Badge tone={statusTone[status.status]} title={status.reason}>{statusLabel[status.status]}</Badge></div>
            <div className="rs-solar"><span className="rs-big">{metrics.mean_sun_el_deg.toFixed(1)}<span>°</span></span><span className="rs-label">mean solar elevation</span></div>
            <dl className="rs-facts">
              {!showTable && <><div><dt>Sunlit</dt><dd>{metrics.pct_lit}%</dd></div><div><dt>Earth contact</dt><dd>{metrics.pct_earth_visible}%</dd></div></>}
              <div><dt>Temp range</dt><dd>{metrics.t_min_k}–{metrics.t_max_k} K</dd></div>
              <div><dt>Below survival</dt><dd>{metrics.h_below_survival} h</dd></div>
              <div><dt>Peak sun elev.</dt><dd>{metrics.max_sun_el_deg.toFixed(1)}°</dd></div>
            </dl>
            <div className="rs-countdowns"><span>Sunset in <b>{countdown(metrics.h_to_first_sunset)}</b></span><span>Earthset in <b>{countdown(metrics.h_to_first_earthset)}</b></span></div>
            <p className="rs-reason">{status.reason}</p>
          </div>;
        })}</div>}

      <details className="rs-assumptions"><summary>Assumptions &amp; thresholds</summary><p>Status uses demo thresholds: ≥70% sunlit, ≥60% Earth contact, ≤48 h darkness, ≤24 h blackout. Temperature model: simplified, no thermal inertia. Earth contact assumes a DSN station can see the Moon; no relay coverage.</p></details>
    </div>
  </aside>;
}

function shortName(name: string): string {
  return name.length > 14 ? `${name.slice(0, 13)}…` : name;
}

function customName(id: string): string {
  const custom = parseCustomSite(id);
  return custom ? `${Math.abs(custom.lat).toFixed(2)}°S · ${custom.lon.toFixed(2)}°E` : id;
}
