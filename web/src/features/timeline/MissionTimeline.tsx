import { useEffect, useMemo, useState } from 'react';
import type { Scenario } from '../../shell/scenario';
import { siteSky } from '../../ephem';

export function scenarioInstant(scenario: Pick<Scenario, 'date' | 'delay' | 'playhead'>): string {
  return new Date(Date.parse(scenario.date) + ((scenario.delay ?? 0) * 24 + (scenario.playhead ?? 0)) * 3_600_000).toISOString();
}
const fmt = (iso: string) => iso.slice(0, 16).replace('T', ' ');

/** Arrival timeline: playhead, launch-delay presets and geometric Sun/Earth lanes for the place in view. */
export function MissionTimeline({ scenario, change, place }: { scenario: Scenario; change: (patch: Partial<Scenario>, replace?: boolean) => void; place?: { name: string; lat: number; lon: number } }) {
  const [hour, setHour] = useState(scenario.playhead ?? 0);
  useEffect(() => setHour(scenario.playhead ?? 0), [scenario.playhead, scenario.date, scenario.hours]);
  useEffect(() => {
    if (hour === (scenario.playhead ?? 0)) return;
    const timer = setTimeout(() => change({ playhead: hour }, true), 150);
    return () => clearTimeout(timer);
  }, [hour, scenario.playhead, change]);
  const delay = scenario.delay ?? 0;
  const start = Date.parse(scenario.date) + delay * 86_400_000;
  const step = Math.max(1, Math.round(scenario.hours / 240));
  const lanes = useMemo(() => {
    if (!place) return null;
    const pts = [];
    for (let h = 0; h <= scenario.hours; h += step) pts.push({ h, ...siteSky(place.lat, place.lon, new Date(start + h * 3_600_000)) });
    return pts;
  }, [place, start, scenario.hours, step]);
  const baseline = useMemo(() => place ? siteSky(place.lat, place.lon, new Date(Date.parse(scenario.date))) : null, [place, scenario.date]);
  const arrival = lanes?.[0];
  // One shared elevation scale for both lanes (dataviz: one axis), fitted to the data with 0° always visible.
  const span = useMemo(() => {
    const els = lanes ? lanes.flatMap(p => [p.sun.el, p.earth.el]) : [0];
    return [Math.min(-1, ...els), Math.max(1, ...els)] as const;
  }, [lanes]);
  const ly = (el: number) => 37 - (el - span[0]) / (span[1] - span[0]) * 34;
  const lane = (body: 'sun' | 'earth') => lanes ? lanes.map(p => `${(p.h / scenario.hours * 1000).toFixed(1)},${ly(p[body].el).toFixed(2)}`).join(' ') : '';
  const upShare = (body: 'sun' | 'earth') => lanes ? Math.round(lanes.filter(p => p[body].el > 0).length / lanes.length * 100) : 0;
  return <section className="mission-timeline" data-tour="timeline" aria-label="Arrival timeline">
    <div className="timeline-row">
      <div className="timeline-label"><span className="eyebrow">WHEN</span><time>{fmt(scenarioInstant({ ...scenario, playhead: hour }))} UTC</time></div>
      <div className="delay-controls" role="group" aria-label="Launch delay"><span>Launch slip</span>{[0, 1, 3, 7, 14].map(days => <button type="button" key={days} aria-pressed={delay === days} onClick={() => change({ delay: days })}>{days === 0 ? 'On time' : `+${days}d`}</button>)}
        <label>Custom <input aria-label="Custom launch delay (days)" type="number" min="0" max="365" step="1" value={delay} onChange={event => { const n = event.target.valueAsNumber; if (Number.isInteger(n) && n >= 0 && n <= 365) change({ delay: n }, true); }} /> d</label></div>
    </div>
    <div className="timeline-track">
      {lanes && <svg className="timeline-lanes" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true">
        <line x1="0" x2="1000" y1={ly(0)} y2={ly(0)} className="lane-zero"/>
        <polyline className="lane-sun" points={lane('sun')} vectorEffect="non-scaling-stroke"/>
        <polyline className="lane-earth" points={lane('earth')} vectorEffect="non-scaling-stroke"/>
      </svg>}
      <input type="range" min={0} max={scenario.hours} step={1} value={hour} aria-label="Mission playhead (hours after arrival)" aria-valuetext={`+${hour} hours, ${fmt(scenarioInstant({ ...scenario, playhead: hour }))} UTC`}
        onChange={event => setHour(Number(event.target.value))} onKeyDown={event => {
          if (event.shiftKey && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) { event.preventDefault(); setHour(value => Math.max(0, Math.min(scenario.hours, value + (event.key === 'ArrowRight' ? 24 : -24)))); }
        }} />
    </div>
    <div className="timeline-foot">
      <span>Arrival {fmt(new Date(start).toISOString())}</span>
      {place && lanes ? <span className="timeline-legend"><i className="dot-sun"/>Sun up {upShare('sun')}% <i className="dot-earth"/>Earth up {upShare('earth')}% <em>· {place.name} · {span[0].toFixed(1)}° to {span[1].toFixed(1)}° · flat horizon</em></span> : <span className="timeline-legend"><em>Select a place to see its Sun and Earth lanes</em></span>}
      <span>+{scenario.hours} h</span>
    </div>
    {delay > 0 && baseline && arrival && <p className="timeline-delta" role="status">Slip {delay} d: at touchdown the Sun moves from {baseline.sun.el.toFixed(1)}° to <b>{arrival.sun.el.toFixed(1)}°</b> and Earth from {baseline.earth.el.toFixed(1)}° to <b>{arrival.earth.el.toFixed(1)}°</b> above the flat horizon at {place!.name}.</p>}
  </section>;
}
