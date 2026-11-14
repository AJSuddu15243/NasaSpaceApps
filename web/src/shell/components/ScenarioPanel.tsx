import { useState, type FormEvent } from 'react';
import type { DemoData } from '../data';
import { DEFAULT_SCENARIO, MAX_SITES, validUtc, type Scenario } from '../scenario';
import { Button, Input, Label } from '../ui';
export function ScenarioPanel({ scenario, data, change }: { scenario: Scenario; data: DemoData; change: (patch: Partial<Scenario>, replace?: boolean) => void }) {
  const toggleSite = (id: string) => change({ sites: scenario.sites.includes(id) ? scenario.sites.filter(site => site !== id) : [...scenario.sites, id] });
  return <aside className="scenario-panel" aria-label="Sites and scenario">
    <div className="panel-heading"><span className="eyebrow">01 / CONFIGURE</span><h2>Your scenario</h2></div>
    <fieldset className="site-list"><legend>Sites <span className="muted">{scenario.sites.length}/{MAX_SITES}</span></legend>
      {data.sites.map(site => <label className="site-option" key={site.id}><input type="checkbox" checked={scenario.sites.includes(site.id)} disabled={!scenario.sites.includes(site.id) && scenario.sites.length >= MAX_SITES} onChange={() => toggleSite(site.id)} /><span>{site.name}<small>{site.lat.toFixed(2)}°, {site.lon.toFixed(2)}°</small></span></label>)}
    </fieldset>
    <DateWindow key={`${scenario.date}/${scenario.hours}`} scenario={scenario} change={change} />
    {scenario.mode === 'planner' && <fieldset className="weight-list"><legend>Comparison weights</legend>
      {(['sun', 'earth', 'slope', 'crater'] as const).map(key => <div key={key}><Label htmlFor={`weight-${key}`}>{({ sun: 'Sunlight', earth: 'Earth contact', slope: 'Low slope', crater: 'Shallow terrain' })[key]} <output htmlFor={`weight-${key}`}>{scenario.weights[key]}%</output></Label><input id={`weight-${key}`} type="range" min="0" max="100" step="1" value={scenario.weights[key]} onChange={event => change({ weights: { ...scenario.weights, [key]: Number(event.target.value) } }, true)} /></div>)}
      <p className="hint">Weights are saved in your link. Ranking is unavailable until the simulation is connected.</p><p className="hint">Rock layer: no data · weight 0</p>
    </fieldset>}
    <Button variant="outline" className="full-width" onClick={() => change(structuredClone(DEFAULT_SCENARIO))}>Restore demo scenario</Button>
  </aside>;
}
function DateWindow({ scenario, change }: { scenario: Scenario; change: (patch: Partial<Scenario>) => void }) {
  const [date, setDate] = useState(scenario.date.slice(0, 16));
  const [hours, setHours] = useState(String(scenario.hours));
  const [error, setError] = useState('');
  function submit(event: FormEvent) {
    event.preventDefault();
    const utc = `${date}:00.000Z`;
    if (!validUtc(utc) || !/^\d+$/.test(hours) || Number(hours) < 1 || Number(hours) > 8760) { setError('Enter a valid UTC date and 1–8760 whole hours.'); return; }
    change({ date: utc, hours: Number(hours) }); setError('');
  }
  return <form onSubmit={submit} className="date-form" noValidate>
    <Label htmlFor="date">Landing date & time (UTC)</Label><Input id="date" type="datetime-local" value={date} onChange={e => setDate(e.target.value)} aria-describedby="window-help date-error" aria-invalid={!!error} />
    <Label htmlFor="hours">Mission length (h)</Label><Input id="hours" type="number" min="1" max="8760" step="1" value={hours} onChange={e => setHours(e.target.value)} aria-describedby="window-help date-error" aria-invalid={!!error} />
    <p id="window-help" className="hint">UTC throughout. Demo results cover 336 h from 14 Nov 2026, 12:00 UTC.</p><p id="date-error" className="error-text" role={error ? 'alert' : undefined}>{error}</p>
    <Button type="submit" variant="secondary" className="full-width">Apply window</Button>
  </form>;
}
