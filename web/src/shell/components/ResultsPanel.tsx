import { useMemo, useState, type ReactNode } from 'react';
import { metricsHash, site_metrics, siteExtras, siteParams, MOCK_PARAMS, UnavailableScenario } from '../../engine';
import { scenarioInstant } from '../../features/timeline/MissionTimeline';
import type { DemoData } from '../data';
import type { Scenario } from '../scenario';
import type { Metrics } from '../../contracts/engine-api';
import { bestValues, countdown, DEFAULT_THRESHOLDS, metricValue, siteStatus, slipDeltas, thresholdText, type MetricKey } from '../../features/compare/metrics';
import { cellReadiness, gridSiteMask, readinessScore, regionAt, siteTimeline, trackTimeline, TL_BOTH, TL_DARK, TL_EARTH, TL_SUN } from '../../features/compare/timeline';
import { trackFor } from '../../engine/track';
import type { RegionResult } from '../../features/mission/useMissionData';
import { parseCustomSite } from '../../features/sites/sites';
import type { ScrubState } from './ViewPanel';
import { ChevronRight } from 'lucide-react';
import { Badge } from '../ui';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../design';

export interface SiteResult {
  id: string;
  name: string;
  metrics: Metrics | null;
  /** Same site on the on-time date, only when the launch slipped. */
  baseline: Metrics | null;
  /** Engine site_extras survives_night (real sites only). */
  survivesNight: boolean | null;
  message: string | null;
  timeline: Uint8Array | null;
  /** Set when the bar is not the engine track over the terrain mask (e.g. "flat horizon, geometry only"). */
  timelineNote: string | null;
  /** Engine suitability at the site's grid cell (0–100); demo-* sites keep the mission-weights heuristic. */
  readiness: number | null;
}

type Regions = Partial<Record<string, RegionResult>>;
const NO_MASK = 'No horizon mask exists for this place yet, so engine metrics are unavailable. Its measured layers are in the science comparison.';

/** Engine percentages are unrounded floats; one decimal, no trailing .0. */
const pct = (value: number) => String(Math.round(value * 10) / 10);
const statusTone = { green: 'success', yellow: 'warning', red: 'danger' } as const;
const statusLabel = { green: 'Within limits', yellow: 'Review', red: 'Outside limits' } as const;

const rows: { key: MetricKey; label: string; short: string; text: (m: Metrics) => string; tip: string }[] = [
  { key: 'litPercent', label: 'Sunlit window', short: 'Sunlit', text: m => `${pct(m.pct_lit)}%`, tip: 'Share of the window the site spends in sunlight — drives solar power.' },
  { key: 'longestDarknessHours', label: 'Longest darkness', short: 'Darkness', text: m => `${m.longest_dark_h} h`, tip: 'Longest unbroken stretch without sunlight; radiators and batteries must survive it.' },
  { key: 'earthContactPercent', label: 'Earth contact', short: 'Earth contact', text: m => `${pct(m.pct_earth_visible)}%`, tip: 'Share of the window with a clear line of sight to Earth for direct-to-Earth comms.' },
  { key: 'longestBlackoutHours', label: 'Longest blackout', short: 'Blackout', text: m => `${m.longest_blackout_h} h`, tip: 'Longest stretch without line of sight to Earth.' },
];

type ResultInputs = Pick<Scenario, 'sites' | 'date' | 'delay' | 'hours' | 'survivalK' | 'batteryH' | 'missionWeights'>;

/** Engine results per site. `scenario.date` is the on-time launch; this function alone applies the slip, so callers must not. */
export function siteResults(data: DemoData, scenario: ResultInputs, regions?: Regions): { start: string; results: SiteResult[] } {
  // Cards score the arrival window: date + launch slip, never the playhead.
  const start = scenarioInstant({ date: scenario.date, delay: scenario.delay });
  const slipped = (scenario.delay ?? 0) > 0;
  const params = siteParams(scenario);
  const results = scenario.sites.map((id): SiteResult => {
    const site = data.sites.find(item => item.id === id);
    const name = site?.name ?? customName(id);
    const coords = site ?? parseCustomSite(id);
    const demo = id.startsWith('demo-');
    if (demo) {
      // Synthetic fixtures: mock metrics, mean-horizon timeline and the mission-weights heuristic, unchanged.
      const mask = data.masks.get(id);
      const horizonDeg = mask ? mask.mask_deg.reduce((a, b) => a + b, 0) / mask.mask_deg.length : 0;
      const timeline = coords ? siteTimeline(data.table, coords.lat, coords.lon, start, scenario.hours, horizonDeg) : null;
      if (!mask) return { id, name, metrics: null, baseline: null, survivesNight: null, message: NO_MASK, timeline, timelineNote: null, readiness: null };
      try {
        const metrics = site_metrics(mask, data.table, start, scenario.hours, MOCK_PARAMS);
        const baseline = slipped ? site_metrics(mask, data.table, scenario.date, scenario.hours, MOCK_PARAMS) : null;
        return { id, name, metrics, baseline, survivesNight: null, message: null, timeline, timelineNote: null, readiness: readinessScore(metrics, scenario.missionWeights, scenario.hours) };
      } catch (error) {
        return { id, name, metrics: null, baseline: null, survivesNight: null, message: error instanceof UnavailableScenario ? error.message : 'Engine results are unavailable.', timeline, timelineNote: null, readiness: null };
      }
    }
    const region = coords ? regionAt(regions, coords.lat, coords.lon) : undefined;
    const readiness = realReadiness(data, id, regions);
    // Curated 360-bin mask first; points inside a surveyed grid use that cell's 64-bin mask.
    const mask = data.masks.get(id) ?? (region && coords ? gridSiteMask(region.grid, id, coords.lat, coords.lon) ?? undefined : undefined);
    const flat = () => coords ? siteTimeline(data.table, coords.lat, coords.lon, start, scenario.hours, 0) : null;
    const flatNote = 'flat horizon, geometry only';
    if (!mask) return { id, name, metrics: null, baseline: null, survivesNight: null, message: NO_MASK, timeline: flat(), timelineNote: flatNote, readiness };
    try {
      const metrics = site_metrics(mask, data.table, start, scenario.hours, params);
      const baseline = slipped ? site_metrics(mask, data.table, scenario.date, scenario.hours, params) : null;
      const survivesNight = siteExtras(mask, data.table, start, scenario.hours, params).survives_night;
      const timeline = trackTimeline(trackFor(mask, data.table, start, scenario.hours, params));
      return { id, name, metrics, baseline, survivesNight, message: null, timeline, timelineNote: mask.bins === 360 ? null : `${mask.bins}-bin grid horizon`, readiness };
    } catch (error) {
      return { id, name, metrics: null, baseline: null, survivesNight: null, message: error instanceof UnavailableScenario ? error.message : 'Engine results are unavailable.', timeline: flat(), timelineNote: flatNote, readiness };
    }
  });
  return { start, results };
}

/** Engine suitability at a real site's grid cell; cheap, so it can follow every weights change. */
function realReadiness(data: DemoData, id: string, regions?: Regions): number | null {
  const coords = data.sites.find(item => item.id === id) ?? parseCustomSite(id);
  return coords ? cellReadiness(regionAt(regions, coords.lat, coords.lon), coords.lat, coords.lon) : null;
}

export function ResultsPanel({ data, scenario, regions, onCollapse, scrub }: { data: DemoData; scenario: Scenario; regions?: Regions; onCollapse?: () => void; scrub?: ScrubState }) {
  // Up to 4 engine calls per site; skip them on playhead/layer/view/weights changes. The store re-parses the URL on every set,
  // so arrays and `regions` are fresh objects each time: key on serialized values. Only the loaded grid set (stable Grid objects)
  // feeds the masks; readiness follows `regions` in the cheap pass below.
  const { sites, date, delay, hours, survivalK, batteryH, missionWeights } = scenario;
  const sitesKey = sites.join(','), mwKey = JSON.stringify(missionWeights), gridsKey = Object.keys(regions ?? {}).join(',');
  const params = siteParams(scenario);
  const heavy = useMemo(() => siteResults(data, { sites, date, delay, hours, survivalK, batteryH, missionWeights }, regions).results, [data, sitesKey, date, delay, hours, survivalK, batteryH, mwKey, gridsKey]);
  const results = useMemo(() => heavy.map(r => r.id.startsWith('demo-') ? r : { ...r, readiness: realReadiness(data, r.id, regions) }), [heavy, data, regions]);
  const computed = results.map(result => result.metrics).filter((metrics): metrics is Metrics => metrics !== null);
  const best = bestValues(computed);
  const showTable = computed.length > 1;
  const ready = results.map(result => result.readiness).filter((v): v is number => v !== null);
  const bestReady = ready.length > 1 ? Math.max(...ready) : null;
  let hash: string | null = null;
  try { hash = computed.length ? metricsHash(computed) : null; } catch { /* engine not loaded: no hash */ }

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
        })}</tr>)}<tr><th scope="row">Temp range</th>{results.map(result => <td key={result.id}>{result.metrics ? `${Math.round(result.metrics.t_min_k)}–${Math.round(result.metrics.t_max_k)} K` : '—'}</td>)}</tr><tr><th scope="row"><TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild><span className="rs-th-tip">Readiness</span></TooltipTrigger><TooltipContent>Engine suitability (0–100) at the site's 160 m grid cell for this window and your Priorities weights. — outside the three surveyed grids, on cells past the slope limit, or while the engine scores. Synthetic demo sites use the mission-priorities heuristic.</TooltipContent></Tooltip></TooltipProvider></th>{results.map(result => <td key={result.id} className={result.readiness !== null && result.readiness === bestReady ? 'rs-best' : undefined}>{result.readiness !== null ? result.readiness : '—'}</td>)}</tr></tbody>
      </table></div>}
      {showTable && <p className="rs-units">● best in row · temps in kelvin · times in hours</p>}

      {results.length === 0
        ? <p className="rs-empty">Choose a site to compare engine results.</p>
        : <div className="rs-sites">{results.map((result, index) => {
          const { metrics } = result;
          if (!metrics) return <div key={result.id} className="rs-card"><h3>{result.name}{mockTag(result.id)}</h3>{result.timeline && <TimelineBar timeline={result.timeline} note={result.timelineNote} scrubHour={scrub?.hour ?? null} />}<p className="rs-reason">{result.message}</p></div>;
          const status = siteStatus(metrics, DEFAULT_THRESHOLDS);
          return <div key={result.id} className="rs-card">
            <div className="rs-card-head"><div><span className="rs-idx">SITE {String(index + 1).padStart(2, '0')}</span><h3>{result.name}{mockTag(result.id)}</h3></div><div className="rs-head-right"><Badge tone={statusTone[status.status]} title={status.reason}>{statusLabel[status.status]}</Badge>{result.readiness !== null && <span className="rs-score" title={result.id.startsWith('demo-') ? 'Mission-priorities heuristic (synthetic demo site)' : "Engine suitability at this site's grid cell (Priorities weights)"}>{result.readiness}<span className="rs-score-unit">/100</span></span>}</div></div>
            <div className="rs-solar"><span className="rs-big">{metrics.mean_sun_el_deg.toFixed(1)}<span>°</span></span><span className="rs-label">mean solar elevation</span></div>
            <dl className="rs-facts">
              {!showTable && <><div><dt>Sunlit</dt><dd>{pct(metrics.pct_lit)}%</dd></div><div><dt>Earth contact</dt><dd>{pct(metrics.pct_earth_visible)}%</dd></div></>}
              <div><dt>Temp range</dt><dd>{Math.round(metrics.t_min_k)}–{Math.round(metrics.t_max_k)} K</dd></div>
              <div><dt>Below survival</dt><dd>{metrics.h_below_survival} h</dd></div>
              <div><dt>Peak sun elev.</dt><dd>{metrics.max_sun_el_deg.toFixed(1)}°</dd></div>
            </dl>
            <div className="rs-countdowns"><span>Sunset in <b>{countdown(metrics.h_to_first_sunset)}</b></span><span>Earthset in <b>{countdown(metrics.h_to_first_earthset)}</b></span></div>
            {result.baseline && <p className="rs-reason" role="status">Slip {scenario.delay} d: {slipDeltas(result.baseline, metrics)}</p>}
            {result.timeline && <TimelineBar timeline={result.timeline} note={result.timelineNote} scrubHour={scrub?.hour ?? null} />}
            <p className="rs-reason">{status.reason}</p>
            {result.survivesNight !== null && <p className="rs-units">Survival {params.survival_temp_k} K · battery {params.battery_h} h ({result.survivesNight ? 'outlasts' : 'does not outlast'} the longest darkness) · antenna margin {params.antenna_margin_deg}°</p>}
          </div>;
        })}</div>}
      {hash && <HashLine hash={hash} />}

      <details className="rs-assumptions"><summary>Assumptions &amp; thresholds</summary><p>Status badge uses fixed thresholds: {thresholdText(DEFAULT_THRESHOLDS)}. The survival temperature and battery set in Planner feed the engine (hours below survival, whether the battery outlasts the longest darkness) but do not change the badge. Hourly bar: for real sites, engine Sun disk and Earth line of sight over the terrain horizon mask; synthetic demo sites use mean-horizon geometry. Temperature model: simplified, no thermal inertia. Earth contact assumes a DSN station can see the Moon; no relay coverage.</p></details>
    </div>
  </aside>;
}

function HashLine({ hash }: { hash: string }) {
  const [copied, setCopied] = useState(false);
  return <p className="rs-units" title="FNV-1a 64 over the engine metrics above: identical inputs give the identical hash on every machine.">
    Determinism hash <code>{hash}</code>{' '}
    <button type="button" className="rs-copy" aria-label="Copy determinism hash" onClick={() => navigator.clipboard?.writeText(hash).then(() => setCopied(true), () => setCopied(false))}>{copied ? 'Copied' : 'Copy'}</button>
  </p>;
}

const tlState = { [TL_DARK]: 'tl-dark', [TL_SUN]: 'tl-sun', [TL_EARTH]: 'tl-earth', [TL_BOTH]: 'tl-both' } as const;

function TimelineBar({ timeline, note, scrubHour }: { timeline: Uint8Array; note?: string | null; scrubHour: number | null }) {
  const hours = timeline.length;
  const stride = Math.max(1, Math.ceil(hours / 480));
  const bars: ReactNode[] = [];
  for (let h = 0; h < hours; h += stride) {
    const span = Math.min(stride, hours - h);
    const dominant = (span === 1 ? timeline[h] : (() => { const counts = [0, 0, 0, 0]; for (let i = h; i < h + span; i++) counts[timeline[i]]++; return counts.indexOf(Math.max(...counts)); })()) as 0 | 1 | 2 | 3;
    bars.push(<rect key={h} x={h / hours} y={0} width={span / hours} height={1} className={tlState[dominant]} />);
  }
  return <div className="rs-timeline" role="img" aria-label={`Hour-by-hour Sun and Earth visibility over ${hours} hours${note ? `, ${note}` : ''}`}>
    <svg viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">{bars}
      {scrubHour !== null && scrubHour >= 0 && scrubHour < hours && <rect x={scrubHour / hours} y={-0.06} width={1 / hours} height={1.12} className="tl-playhead" />}
    </svg>
    <div className="rs-timeline-key"><span><i className="tl-key tl-sun"/>Sun</span><span><i className="tl-key tl-earth"/>Earth</span><span><i className="tl-key tl-both"/>Both</span><span><i className="tl-key tl-dark"/>Neither</span>{note && <span>· {note}</span>}</div>
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
