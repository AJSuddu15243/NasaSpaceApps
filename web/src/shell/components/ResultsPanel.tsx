import type { ReactNode } from 'react';
import { site_metrics, MOCK_PARAMS, UnavailableScenario } from '../../engine';
import type { DemoData } from '../data';
import type { Scenario } from '../scenario';
import type { Metrics } from '../../contracts/engine-api';
import { bestValues, countdown, DEFAULT_THRESHOLDS, metricValue, siteStatus, type MetricKey } from '../../features/compare/metrics';
import { readinessScore, siteTimeline, TL_BOTH, TL_DARK, TL_EARTH, TL_SUN } from '../../features/compare/timeline';
import { parseCustomSite } from '../../features/sites/sites';
import type { ScrubState } from './ViewPanel';
import { ChevronRight } from 'lucide-react';
import { Badge } from '../ui';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../design';

interface SiteResult {
  id: string;
  name: string;
  metrics: Metrics | null;
  message: string | null;
  timeline: Uint8Array | null;
  readiness: number | null;
}

/** Engine percentages are unrounded floats; one decimal, no trailing .0. */
const pct = (value: number) => String(Math.round(value * 10) / 10);
const statusTone = { green: 'success', yellow: 'warning', red: 'danger' } as const;
const statusLabel = { green: 'Within limits', yellow: 'Review', red: 'Outside limits' } as const;

const rows: { key: MetricKey; label: string; short: string; text: (m: Metrics) => string; tip: string }[] = [
  { key: 'litPercent', label: 'Sunlit window', short: 'Sunlit', text: m => `${pct(m.pct_lit)}%`, tip: 'Share of the window the site spends in sunlight — drives solar power.' },
  { key: 'longestDarknessHours', label: 'Longest darkness', short: 'Darkness', text: m => `${m.longest_dark_h} h`, tip: 'Longest unbroken stretch without sunlight; radiators and batteries must survive it.' },
  { key: 'earthContactPercent', label: 'Earth contact', short: 'Earth contact', text: m => `${pct(m.pct_earth_visible)}%`, tip: 'Share of the window with a clear line of sight to Earth for direct-to-Earth comms.' },
  { key: 'longestBlackoutHours', label: 'Longest blackout', short: 'Blackout', text: m => `${m.longest_blackout_h} h`, tip: 'Longest stretch with neither Sun nor Earth visible — the worst-case comms gap.' },
];

export function ResultsPanel({ data, scenario, onCollapse, scrub }: { data: DemoData; scenario: Scenario; onCollapse?: () => void; scrub?: ScrubState }) {
  const results: SiteResult[] = scenario.sites.map(id => {
    const site = data.sites.find(item => item.id === id);
    const name = site?.name ?? customName(id);
    const coords = site ?? parseCustomSite(id);
    const mask = data.masks.get(id);
    const horizonDeg = mask ? mask.mask_deg.reduce((a, b) => a + b, 0) / mask.mask_deg.length : 0;
    const timeline = coords ? siteTimeline(data.table, coords.lat, coords.lon, scenario.date, scenario.hours, horizonDeg) : null;
    // Named regions without a horizon mask are treated like custom points: no metrics are invented for them.
    if (!site || !mask) return { id, name, metrics: null, message: 'No horizon mask exists for this place yet, so engine metrics are unavailable. Its measured layers are in the science comparison.', timeline, readiness: null };
    try {
      const metrics = site_metrics(mask!, data.table, scenario.date, scenario.hours, MOCK_PARAMS);
      return { id, name, metrics, message: null, timeline, readiness: readinessScore(metrics, scenario.missionWeights, scenario.hours) };
    } catch (error) {
      return { id, name, metrics: null, message: error instanceof UnavailableScenario ? error.message : 'Engine results are unavailable.', timeline, readiness: null };
    }
  });
  const computed = results.map(result => result.metrics).filter((metrics): metrics is Metrics => metrics !== null);
  const best = bestValues(computed);
  const showTable = computed.length > 1;

  return <aside className="ws-results rs" aria-label="Site comparison">
    <div className="ws-panel-head">
      <div><h2>Compare</h2><p className="ws-panel-sub">Rust/WASM engine · JPL Horizons ephemeris · LOLA horizon masks</p></div>
      {onCollapse && <button type="button" className="panel-collapse-btn" onClick={onCollapse} aria-label="Collapse comparison panel"><ChevronRight size={14} aria-hidden="true" /></button>}
    </div>
    <div className="ws-scroll">
      {showTable && <div className="rs-table-wrap"><table className="rs-table">
        <caption className="sr-only">Metric comparison across selected sites; best value per row is highlighted.</caption>
        <thead><tr><th scope="col">Metric</th>{results.map(result => <th key={result.id} scope="col" title={result.name}>{shortName(result.name)}</th>)}</tr></thead>
        <tbody>{rows.map(row => <tr key={row.key}><th scope="row"><TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild><span className="rs-th-tip">{row.short}</span></TooltipTrigger><TooltipContent>{row.tip}</TooltipContent></Tooltip></TooltipProvider></th>{results.map(result => {
          const value = result.metrics ? metricValue(result.metrics, row.key) : null;
          // A single computed site gets no comparative "best" highlight.
          const isBest = computed.length > 1 && value !== null && value === best[row.key];
          return <td key={result.id} className={isBest ? 'rs-best' : undefined}>{result.metrics ? row.text(result.metrics) : '—'}</td>;
        })}</tr>)}<tr><th scope="row">Temp range</th>{results.map(result => <td key={result.id}>{result.metrics ? `${Math.round(result.metrics.t_min_k)}–${Math.round(result.metrics.t_max_k)} K` : '—'}</td>)}</tr><tr><th scope="row"><TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild><span className="rs-th-tip">Readiness</span></TooltipTrigger><TooltipContent>Weighted 0–100 heuristic from your mission priorities — not an engine score.</TooltipContent></Tooltip></TooltipProvider></th>{results.map(result => <td key={result.id} className={result.readiness !== null ? 'rs-best' : undefined}>{result.readiness !== null ? result.readiness : '—'}</td>)}</tr></tbody>
      </table></div>}
      {showTable && <p className="rs-units">● best in row · temps in kelvin · times in hours</p>}

      {results.length === 0
        ? <p className="rs-empty">Choose a site to compare engine results.</p>
        : <div className="rs-sites">{results.map((result, index) => {
          const { metrics } = result;
          if (!metrics) return <div key={result.id} className="rs-card"><h3>{result.name}{mockTag(result.id)}</h3>{result.timeline && <TimelineBar timeline={result.timeline} scrubHour={scrub?.hour ?? null} />}<p className="rs-reason">{result.message}</p></div>;
          const status = siteStatus(metrics, DEFAULT_THRESHOLDS);
          return <div key={result.id} className="rs-card">
            <div className="rs-card-head"><div><span className="rs-idx">SITE {String(index + 1).padStart(2, '0')}</span><h3>{result.name}{mockTag(result.id)}</h3></div><div className="rs-head-right"><Badge tone={statusTone[status.status]} title={status.reason}>{statusLabel[status.status]}</Badge>{result.readiness !== null && <span className="rs-score" title="Weighted readiness heuristic">{result.readiness}<span className="rs-score-unit">/100</span></span>}</div></div>
            <div className="rs-solar"><span className="rs-big">{metrics.mean_sun_el_deg.toFixed(1)}<span>°</span></span><span className="rs-label">mean solar elevation</span></div>
            <dl className="rs-facts">
              {!showTable && <><div><dt>Sunlit</dt><dd>{pct(metrics.pct_lit)}%</dd></div><div><dt>Earth contact</dt><dd>{pct(metrics.pct_earth_visible)}%</dd></div></>}
              <div><dt>Temp range</dt><dd>{Math.round(metrics.t_min_k)}–{Math.round(metrics.t_max_k)} K</dd></div>
              <div><dt>Below survival</dt><dd>{metrics.h_below_survival} h</dd></div>
              <div><dt>Peak sun elev.</dt><dd>{metrics.max_sun_el_deg.toFixed(1)}°</dd></div>
            </dl>
            <div className="rs-countdowns"><span>Sunset in <b>{countdown(metrics.h_to_first_sunset)}</b></span><span>Earthset in <b>{countdown(metrics.h_to_first_earthset)}</b></span></div>
            {result.timeline && <TimelineBar timeline={result.timeline} scrubHour={scrub?.hour ?? null} />}
            <p className="rs-reason">{status.reason}</p>
          </div>;
        })}</div>}

      <details className="rs-assumptions"><summary>Assumptions &amp; thresholds</summary><p>Status uses demo thresholds: ≥70% sunlit, ≥60% Earth contact, ≤48 h darkness, ≤24 h blackout. Temperature model: simplified, no thermal inertia. Earth contact assumes a DSN station can see the Moon; no relay coverage.</p></details>
    </div>
  </aside>;
}

const tlState = { [TL_DARK]: 'tl-dark', [TL_SUN]: 'tl-sun', [TL_EARTH]: 'tl-earth', [TL_BOTH]: 'tl-both' } as const;

function TimelineBar({ timeline, scrubHour }: { timeline: Uint8Array; scrubHour: number | null }) {
  const hours = timeline.length;
  const stride = Math.max(1, Math.ceil(hours / 480));
  const bars: ReactNode[] = [];
  for (let h = 0; h < hours; h += stride) {
    const span = Math.min(stride, hours - h);
    const dominant = (span === 1 ? timeline[h] : (() => { const counts = [0, 0, 0, 0]; for (let i = h; i < h + span; i++) counts[timeline[i]]++; return counts.indexOf(Math.max(...counts)); })()) as 0 | 1 | 2 | 3;
    bars.push(<rect key={h} x={h / hours} y={0} width={span / hours} height={1} className={tlState[dominant]} />);
  }
  return <div className="rs-timeline" role="img" aria-label={`Hour-by-hour Sun and Earth visibility over ${hours} hours`}>
    <svg viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">{bars}
      {scrubHour !== null && scrubHour >= 0 && scrubHour < hours && <rect x={scrubHour / hours} y={-0.06} width={1 / hours} height={1.12} className="tl-playhead" />}
    </svg>
    <div className="rs-timeline-key"><span><i className="tl-key tl-sun"/>Sun</span><span><i className="tl-key tl-earth"/>Earth</span><span><i className="tl-key tl-both"/>Both</span><span><i className="tl-key tl-dark"/>Neither</span></div>
  </div>;
}

/** demo-* sites run on synthetic fixtures, never the engine. */
function mockTag(id: string) {
  return id.startsWith('demo-') ? <> <Badge tone="neutral" title="Synthetic fixture, not engine output">mock</Badge></> : null;
}

function shortName(name: string): string {
  return name.length > 14 ? `${name.slice(0, 13)}…` : name;
}

function customName(id: string): string {
  const custom = parseCustomSite(id);
  return custom ? `${Math.abs(custom.lat).toFixed(2)}°S · ${custom.lon.toFixed(2)}°E` : id;
}
