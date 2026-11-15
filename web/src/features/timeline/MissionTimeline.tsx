import { useEffect, useMemo, useState } from 'react';
import type { Scenario } from '../../shell/scenario';
import { siteSky } from '../../ephem';
import { trackFor, earthShare, litShare, type Track } from '../../engine/track';
import type { Params } from '../../contracts/engine-api';
import type { SiteMask } from '../../contracts/site-mask';
import type { DemoData } from '../../shell/data';

export function scenarioInstant(scenario: Pick<Scenario, 'date' | 'delay' | 'playhead'>): string {
  return new Date(Date.parse(scenario.date) + ((scenario.delay ?? 0) * 24 + (scenario.playhead ?? 0)) * 3_600_000).toISOString();
}
const fmt = (iso: string) => iso.slice(0, 16).replace('T', ' ');

/** Engine track, or null (no mask, no table, or a window the engine cannot compute): the caller falls back to the flat horizon. */
export function tryTrack(mask: SiteMask | null | undefined, table: DemoData['table'] | undefined, iso: string, hours: number, params: Params): Track | null {
  if (!mask || !table) return null;
  try { return trackFor(mask, table, iso, hours, params); } catch { return null; }
}

/** Arrival timeline: playhead, launch-delay presets and Sun/Earth lanes for the place in view. Lanes and shares come
 * from the engine's site_track over the place's terrain mask; without a mask they fall back to a labelled flat horizon. */
export function MissionTimeline({ scenario, change, place, mask, table, params }: { scenario: Scenario; change: (patch: Partial<Scenario>, replace?: boolean) => void; place?: { name: string; lat: number; lon: number }; mask?: SiteMask | null; table?: DemoData['table']; params: Params }) {
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
  const track = useMemo(() => place ? tryTrack(mask, table, new Date(start).toISOString(), scenario.hours, params) : null, [place, mask, table, start, scenario.hours, params]);
  const lanes = useMemo(() => {
    if (!place) return null;
    const pts = [];
    if (track) for (let h = 0; h < track.hours; h += step) pts.push({ h, sun: { el: track.sunEl[h], up: track.sunLit[h] > 0 }, earth: { el: track.earthEl[h], up: track.earthVis[h] > 0 } });
    else for (let h = 0; h <= scenario.hours; h += step) { const s = siteSky(place.lat, place.lon, new Date(start + h * 3_600_000)); pts.push({ h, sun: { el: s.sun.el, up: s.sun.el > 0 }, earth: { el: s.earth.el, up: s.earth.el > 0 } }); }
    return pts;
  }, [place, track, start, scenario.hours, step]);
  const baseline = useMemo(() => {
    if (!place) return null;
    const t = track && tryTrack(mask, table, new Date(Date.parse(scenario.date)).toISOString(), 1, params);
    if (t) return { sun: { el: t.sunEl[0], up: t.sunLit[0] > 0 }, earth: { el: t.earthEl[0], up: t.earthVis[0] > 0 } };
    const s = siteSky(place.lat, place.lon, new Date(Date.parse(scenario.date)));
    return { sun: { el: s.sun.el, up: s.sun.el > 0 }, earth: { el: s.earth.el, up: s.earth.el > 0 } };
  }, [place, track, mask, table, scenario.date, params]);
  const arrival = lanes?.[0];
  const horizon = track ? `${mask!.bins}-bin LOLA horizon · engine` : 'flat horizon';
  // One shared elevation scale for both lanes (dataviz: one axis), fitted to the data with 0° always visible.
  const span = useMemo(() => {
    const els = lanes ? lanes.flatMap(p => [p.sun.el, p.earth.el]) : [0];
    return [Math.min(-1, ...els), Math.max(1, ...els)] as const;
  }, [lanes]);
  const ly = (el: number) => 37 - (el - span[0]) / (span[1] - span[0]) * 34;
  const lane = (body: 'sun' | 'earth') => lanes ? lanes.map(p => `${(p.h / scenario.hours * 1000).toFixed(1)},${ly(p[body].el).toFixed(2)}`).join(' ') : '';
  const upShare = (body: 'sun' | 'earth') => track ? Math.round((body === 'sun' ? litShare(track) : earthShare(track)) * 100) : lanes ? Math.round(lanes.filter(p => p[body].up).length / lanes.length * 100) : 0;
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
      {place && lanes ? <span className="timeline-legend"><i className="dot-sun"/>Sun {track ? 'lit' : 'up'} {upShare('sun')}% <i className="dot-earth"/>Earth {track ? 'in view' : 'up'} {upShare('earth')}% <em>· {place.name} · {span[0].toFixed(1)}° to {span[1].toFixed(1)}° · {horizon}</em></span> : <span className="timeline-legend"><em>Select a place to see its Sun and Earth lanes</em></span>}
      <span>+{scenario.hours} h</span>
    </div>
    {delay > 0 && baseline && arrival && <p className="timeline-delta" role="status">Slip {delay} d: at touchdown the Sun moves from {baseline.sun.el.toFixed(1)}°{track ? ` (${baseline.sun.up ? 'lit' : 'hidden'})` : ''} to <b>{arrival.sun.el.toFixed(1)}°{track ? ` (${arrival.sun.up ? 'lit' : 'hidden'})` : ''}</b> and Earth from {baseline.earth.el.toFixed(1)}°{track ? ` (${baseline.earth.up ? 'in view' : 'hidden'})` : ''} to <b>{arrival.earth.el.toFixed(1)}°{track ? ` (${arrival.earth.up ? 'in view' : 'hidden'})` : ''}</b> at {place!.name} ({track ? 'terrain horizon from the engine' : 'flat horizon'}).</p>}
  </section>;
}
