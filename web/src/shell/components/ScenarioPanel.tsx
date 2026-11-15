import { useEffect, useState, type FormEvent } from 'react';
import { Check, ChevronDown, ChevronLeft, Save } from 'lucide-react';
import type { DemoData } from '../data';
import { DEFAULT_SCENARIO, MAX_SITES, validUtc, type MissionWeights, type Scenario } from '../scenario';
import { scenarioShareUrl, saveScenario } from '../../scenarios/store';
import { Button, Input, Label } from '../ui';
import { SitePicker } from '../../features/sites/SitePicker';

export function ScenarioPanel({ scenario, data, change, onCollapse, onInspect }: { scenario: Scenario; data: Pick<DemoData, 'sites'>; change: (patch: Partial<Scenario>, replace?: boolean) => void; onCollapse?: () => void; onInspect?: (id: string) => void }) {
  return <aside className="ws-side" aria-label="Sites and scenario">
    {onCollapse && <div className="ws-panel-head">
      {onCollapse && <button type="button" className="panel-collapse-btn" onClick={onCollapse} aria-label="Collapse sites panel"><ChevronLeft size={14} aria-hidden="true" /></button>}
    </div>}
    <SitePicker onInspect={onInspect} sites={data.sites} selected={scenario.sites} onChange={sites => change({ sites: sites.slice(0, MAX_SITES) })} />
    <DateWindow key={`${scenario.date}/${scenario.hours}`} scenario={scenario} change={change} />
    {scenario.mode === 'planner' && <SurvivalParams scenario={scenario} change={change} />}
    {scenario.mode === 'planner' && <details className="sc-advanced">
      <summary><ChevronDown size={13} aria-hidden="true" /> Readiness score weights · synthetic demo sites</summary>
      <MissionWeightsPanel scenario={scenario} change={change} />
    </details>}
    <div className="sc-foot">
      <SaveScenario scenario={scenario} />
      <Button variant="outline" className="sc-restore" onClick={() => change({ sites: DEFAULT_SCENARIO.sites, date: DEFAULT_SCENARIO.date, hours: DEFAULT_SCENARIO.hours, survivalK: DEFAULT_SCENARIO.survivalK, batteryH: DEFAULT_SCENARIO.batteryH, delay: undefined, playhead: undefined })}>Reset sites and window</Button>
    </div>
  </aside>;
}

function SaveScenario({ scenario }: { scenario: Scenario }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault();
    const stored = saveScenario(name, scenario);
    const url = scenarioShareUrl(stored.slug);
    try { await navigator.clipboard.writeText(url); setStatus(`Saved "${stored.name}" — link copied`); }
    catch { setStatus(`Saved "${stored.name}" — copy ${url}`); }
    setOpen(false); setName('');
  }
  if (!open) return <Button variant="outline" className="sc-save" onClick={() => setOpen(true)}><Save size={13} aria-hidden="true" /> Save scenario</Button>;
  return <form className="sc-save-form" onSubmit={submit}>
    <Label htmlFor="scenario-name" className="sr-only">Scenario name</Label>
    <Input id="scenario-name" value={name} onChange={e => setName(e.target.value)} placeholder="Scenario name" maxLength={60} autoFocus />
    <Button type="submit" disabled={!name.trim()}><Check size={13} aria-hidden="true" /> Save</Button>
    <Button type="button" variant="ghost" onClick={() => { setOpen(false); setStatus(''); }}>Cancel</Button>
    {status && <p className="sc-hint" role="status">{status}</p>}
  </form>;
}

const mwLabels: { key: keyof MissionWeights; label: string; tip: string }[] = [
  { key: 'lit', label: 'Sunlit window', tip: 'Weight on share of the window in sunlight (solar power).' },
  { key: 'earth', label: 'Earth contact', tip: 'Weight on share of the window with a clear view of Earth (comms).' },
  { key: 'dark', label: 'Max darkness', tip: 'Weight on minimizing the longest unbroken darkness stretch.' },
  { key: 'blackout', label: 'Max blackout', tip: 'Weight on minimizing the longest stretch with neither Sun nor Earth visible.' },
];

function MissionWeightsPanel({ scenario, change }: { scenario: Scenario; change: (patch: Partial<Scenario>, replace?: boolean) => void }) {
  const mw = scenario.missionWeights;
  const total = mw.lit + mw.earth + mw.dark + mw.blackout;
  const share = (v: number) => (total > 0 ? Math.round((v / total) * 100) : 0);
  return <div className="sc-mw">
    <p className="sc-mw-title">Mission priorities <span className="sc-hint">normalized to {total > 0 ? '100%' : '—'}</span></p>
    {mwLabels.map(({ key, label, tip }) => <div key={key} className="sc-weight">
      <Label htmlFor={`mw-${key}`} title={tip}>{label} <output htmlFor={`mw-${key}`}>{mw[key]} · {share(mw[key])}%</output></Label>
      <input id={`mw-${key}`} type="range" min="0" max="100" step="1" value={mw[key]} aria-label={label} onChange={event => change({ missionWeights: { ...mw, [key]: Number(event.target.value) } }, true)} />
    </div>)}
    <p className="sc-hint">Drives the readiness score in Compare. Saved in your link as <code>mw</code>.</p>
  </div>;
}

/** Planner: lander survival limits for real site cards (URL surv, bat; same ranges as readScenario). */
function SurvivalParams({ scenario, change }: { scenario: Scenario; change: (patch: Partial<Scenario>, replace?: boolean) => void }) {
  return <div className="sc-form"><div className="sc-row">
    <WholeNumber id="sc-surv" label="Survival temp (K)" min={40} max={400} value={scenario.survivalK} set={survivalK => change({ survivalK }, true)} />
    <WholeNumber id="sc-bat" label="Battery (h)" min={0} max={720} value={scenario.batteryH} set={batteryH => change({ batteryH }, true)} />
  </div><p id="survival-help" className="sc-hint">Each real site card uses these for hours below survival and whether the battery outlasts the longest darkness.</p></div>;
}

function WholeNumber({ id, label, min, max, value, set }: { id: string; label: string; min: number; max: number; value: number; set: (n: number) => void }) {
  const [text, setText] = useState(String(value));
  useEffect(() => setText(String(value)), [value]);
  const n = Number(text);
  const valid = /^\d+$/.test(text) && n >= min && n <= max;
  return <div><Label htmlFor={id}>{label}</Label>
    <Input id={id} type="number" min={min} max={max} step="1" value={text} aria-describedby="survival-help" aria-invalid={!valid}
      onChange={event => { const next = event.target.value; setText(next); if (/^\d+$/.test(next) && Number(next) >= min && Number(next) <= max) set(Number(next)); }} /></div>;
}

function DateWindow({ scenario, change }: { scenario: Scenario; change: (patch: Partial<Scenario>) => void }) {
  const [date, setDate] = useState(scenario.date.slice(0, 16));
  const [hours, setHours] = useState(String(scenario.hours));
  const [error, setError] = useState('');
  function submit(event: FormEvent) {
    event.preventDefault();
    const utc = `${date}:00.000Z`;
    if (!validUtc(utc) || !/^\d+$/.test(hours) || Number(hours) < 1 || Number(hours) > 8760) { setError('Valid UTC date and 1–8760 whole hours.'); return; }
    change({ date: utc, hours: Number(hours) }); setError('');
  }
  return <form onSubmit={submit} className="sc-form" noValidate>
    <div className="sc-row">
      <div><Label htmlFor="date">Landing date (UTC)</Label><Input id="date" type="datetime-local" value={date} onChange={e => setDate(e.target.value)} aria-describedby="window-help date-error" aria-invalid={!!error} /></div>
      <div><Label htmlFor="hours">Hours</Label><Input id="hours" type="number" min="1" max="8760" step="1" value={hours} onChange={e => setHours(e.target.value)} aria-describedby="window-help date-error" aria-invalid={!!error} /></div>
      <Button type="submit" variant="secondary" className="sc-apply">Apply</Button>
    </div>
    <p id="window-help" className="sc-hint">UTC. Engine metrics use the JPL Horizons table (2026–2030); the demo window is 336 h from 15 Jan 2027, 00:00. Synthetic demo-* sites only cover 336 h from 14 Nov 2026, 12:00.</p>
    <p id="date-error" className="sc-error" role={error ? 'alert' : undefined}>{error}</p>
  </form>;
}
