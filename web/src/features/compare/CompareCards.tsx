import { useMemo } from 'react';
import { bestValues, countdown, siteStatus, type CompareThresholds, type MetricKey, type SiteMetrics } from './metrics';
import './compare.css';

export interface CompareCardsProps {
  sites: readonly SiteMetrics[];
  timelineIso: string;
  thresholds: CompareThresholds;
  loading?: boolean;
  error?: string | null;
}

const rows: { key: MetricKey; label: string; unit: string; digits: number }[] = [
  { key: 'litPercent', label: 'Sunlit', unit: '%', digits: 0 },
  { key: 'longestDarknessHours', label: 'Longest darkness', unit: 'h', digits: 1 },
  { key: 'earthContactPercent', label: 'Earth contact', unit: '%', digits: 0 },
  { key: 'longestBlackoutHours', label: 'Longest blackout', unit: 'h', digits: 1 },
];

function value(value: number | null, digits = 1): string {
  return value === null || !Number.isFinite(value) ? 'No data' : value.toFixed(digits);
}

function SiteCard({ site, timelineIso, thresholds, best }: {
  site: SiteMetrics;
  timelineIso: string;
  thresholds: CompareThresholds;
  best: Partial<Record<MetricKey, number>>;
}) {
  const badge = siteStatus(site, thresholds);
  return <article className="compare-card" aria-label={`${site.name} metrics`}>
    <header className="compare-card-head">
      <h3>{site.name}</h3>
      <span className={`compare-badge compare-badge-${badge.status}`} title={badge.reason} aria-label={`${badge.status} status: ${badge.reason}`} tabIndex={0}>{badge.status === 'green' ? 'Within limits' : badge.status === 'yellow' ? 'Review' : 'Outside limits'}</span>
    </header>
    <div className="compare-solar">
      <span>Solar elevation</span>
      <strong>{value(site.solarElevationDeg)}<small>{site.solarElevationDeg === null ? '' : '°'}</small></strong>
    </div>
    <dl className="compare-metrics">
      {rows.map(row => {
        const metric = site[row.key];
        const winning = metric !== null && Number.isFinite(metric) && metric === best[row.key];
        return <div key={row.key} className={`compare-metric ${winning ? 'compare-best' : ''}`}>
          <dt>{row.label}</dt>
          <dd>{value(metric, row.digits)}{metric !== null && Number.isFinite(metric) && <span> {row.unit}</span>}{winning && <small aria-label="Best among selected sites">Best</small>}</dd>
        </div>;
      })}
      <div className="compare-metric compare-temperature"><dt>Temperature range</dt><dd>{site.temperatureMinK !== null && site.temperatureMaxK !== null && Number.isFinite(site.temperatureMinK) && Number.isFinite(site.temperatureMaxK) ? <>{value(site.temperatureMinK, 0)}–{value(site.temperatureMaxK, 0)}<span> K</span></> : 'No data'}</dd></div>
    </dl>
    <div className="compare-events">
      <div><span>Next sunset</span><strong>{countdown(site.nextSunsetIso, timelineIso)}</strong></div>
      <div><span>Next Earthset</span><strong>{countdown(site.nextEarthsetIso, timelineIso)}</strong></div>
    </div>
    <p className="compare-reason">{badge.reason}</p>
  </article>;
}

export function CompareCards({ sites, timelineIso, thresholds, loading = false, error = null }: CompareCardsProps) {
  const best = useMemo(() => bestValues(sites), [sites]);
  if (loading) return <section className="compare-state" role="status">Calculating site conditions…</section>;
  if (error) return <section className="compare-state compare-error" role="alert">Comparison unavailable: {error}</section>;
  if (!sites.length) return <section className="compare-state">Choose two or more sites to compare their conditions.</section>;
  return <section className="compare" aria-label="Site comparison">
    <div className="compare-heading"><div><p>Site comparison</p><h2>Which site works?</h2></div><span>{sites.length} {sites.length === 1 ? 'site' : 'sites'} selected</span></div>
    <div className="compare-grid">{sites.map(site => <SiteCard key={site.id} site={site} timelineIso={timelineIso} thresholds={thresholds} best={best} />)}</div>
    <p className="compare-note">Temperature is a simplified equilibrium estimate with no thermal inertia. Earth contact assumes a DSN station can see the Moon and no relay is available. Best marks compare only selected sites.</p>
  </section>;
}
