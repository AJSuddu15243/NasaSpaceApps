import { useState, type FormEvent } from 'react';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import type { DemoData } from '../data';
import { DEFAULT_SCENARIO, MAX_SITES, validUtc, type Scenario } from '../scenario';
import { Button, Input, Label } from '../ui';
import { SitePicker } from '../../features/sites/SitePicker';

export function ScenarioPanel({ scenario, data, change, onCollapse }: { scenario: Scenario; data: DemoData; change: (patch: Partial<Scenario>, replace?: boolean) => void; onCollapse?: () => void }) {
  return <aside className="ws-side" aria-label="Sites and scenario">
    <div className="ws-panel-head">
      <div><h2>Mission setup</h2><p className="ws-panel-sub">Sites, window and weights</p></div>
      {onCollapse && <button type="button" className="panel-collapse-btn" onClick={onCollapse} aria-label="Collapse sites panel"><ChevronLeft size={14} aria-hidden="true" /></button>}
    </div>
    <SitePicker sites={data.sites} selected={scenario.sites} onChange={sites => change({ sites: sites.slice(0, MAX_SITES) })} />
    <DateWindow key={`${scenario.date}/${scenario.hours}`} scenario={scenario} change={change} />
    {scenario.mode === 'planner' && <details className="sc-advanced">
      <summary><ChevronDown size={13} aria-hidden="true" /> Advanced · comparison weights</summary>
      <div className="ws-scroll" style={{ flex: '0 1 auto', maxHeight: '46vh' }}>
        <div className="sc-weights">
          {(['sun', 'earth', 'slope', 'crater'] as const).map(key => <div key={key} className="sc-weight"><Label htmlFor={`weight-${key}`}>{({ sun: 'Sunlight', earth: 'Earth contact', slope: 'Low slope', crater: 'Shallow terrain' })[key]} <output htmlFor={`weight-${key}`}>{scenario.weights[key]}%</output></Label><input id={`weight-${key}`} type="range" min="0" max="100" step="1" value={scenario.weights[key]} onChange={event => change({ weights: { ...scenario.weights, [key]: Number(event.target.value) } }, true)} /></div>)}
          <p className="sc-hint">Weights are saved in your link. Ranking is unavailable until the simulation is connected.</p>
          <p className="sc-hint">Rock layer: terrain-roughness proxy, not measured rocks · weight 0 by default.</p>
        </div>
      </div>
    </details>}
    <div className="sc-foot"><Button variant="outline" className="sc-restore" onClick={() => change(structuredClone(DEFAULT_SCENARIO))}>Restore demo scenario</Button></div>
  </aside>;
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
    <p id="window-help" className="sc-hint">Demo results cover 336 h from 14 Nov 2026, 12:00 UTC.</p>
    <p id="date-error" className="sc-error" role={error ? 'alert' : undefined}>{error}</p>
  </form>;
}
