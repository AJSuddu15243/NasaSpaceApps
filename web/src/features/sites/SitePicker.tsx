import { useMemo, useState, type FormEvent } from 'react';
import type { Site } from '../../contracts/sites';
import { customSiteId, MAX_SELECTED_SITES, parseCustomSite, searchSites, validateCoordinates } from './sites';
import './site-picker.css';

const categoryLabel: Record<Site['category'], string> = {
  artemis3: 'Artemis III candidates', clps: 'CLPS regions', intl: 'International missions', apollo: 'Apollo references',
};

export function SitePicker({ sites, selected, onChange }: { sites: readonly Site[]; selected: readonly string[]; onChange: (ids: string[]) => void }) {
  const [query, setQuery] = useState('');
  const [customOpen, setCustomOpen] = useState(false);
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [feedback, setFeedback] = useState('');
  const matches = useMemo(() => searchSites(sites, query), [sites, query]);
  const selectedSet = new Set(selected);
  const atLimit = selected.length >= MAX_SELECTED_SITES;

  const toggle = (id: string) => {
    if (selectedSet.has(id)) onChange(selected.filter(value => value !== id));
    else if (!atLimit) onChange([...selected, id]);
  };

  const addCustom = (event: FormEvent) => {
    event.preventDefault();
    const result = validateCoordinates(lat, lon);
    if (typeof result === 'string') { setFeedback(result); return; }
    const id = customSiteId(result.lat, result.lon);
    if (selectedSet.has(id)) { setFeedback('Those coordinates are already selected.'); return; }
    if (atLimit) { setFeedback('Remove a site before adding another.'); return; }
    onChange([...selected, id]);
    setFeedback('Custom coordinates added. Terrain metrics will appear when its mask is available.');
    setLat(''); setLon(''); setCustomOpen(false);
  };

  const selectedName = (id: string) => {
    const site = sites.find(item => item.id === id);
    if (site) return site.name;
    const custom = parseCustomSite(id);
    return custom ? `${Math.abs(custom.lat).toFixed(2)}°S · ${custom.lon.toFixed(2)}°E` : id;
  };

  return <section className="site-picker" aria-labelledby="site-picker-heading">
    <div className="site-picker-title"><div><span className="eyebrow">01 / SELECT</span><h2 id="site-picker-heading">Landing sites</h2></div><span className="site-count" aria-label={`${selected.length} of ${MAX_SELECTED_SITES} sites selected`}><b>{selected.length}</b> / {MAX_SELECTED_SITES}</span></div>
    <div className="selected-sites" aria-label="Selected sites">{selected.map((id, index) => <button type="button" key={id} onClick={() => toggle(id)} aria-label={`Remove ${selectedName(id)}`}><span>{String(index + 1).padStart(2, '0')}</span>{selectedName(id)}<b aria-hidden="true">×</b></button>)}</div>
    <label className="site-search"><span className="sr-only">Search sites</span><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search mission or region" /></label>
    <div className="site-catalogue">{matches.length === 0 ? <p className="site-empty">No sites match “{query}”.</p> : (Object.keys(categoryLabel) as Site['category'][]).map(category => {
      const options = matches.filter(site => site.category === category);
      return options.length ? <fieldset key={category}><legend>{categoryLabel[category]} <span>{options.length}</span></legend>{options.map(site => <label className="site-row" key={site.id}><input type="checkbox" checked={selectedSet.has(site.id)} disabled={atLimit && !selectedSet.has(site.id)} onChange={() => toggle(site.id)} /><span className="site-marker" aria-hidden="true"/><span><strong>{site.name}</strong><small>{Math.abs(site.lat).toFixed(2)}°S · {site.lon.toFixed(2)}°E</small></span></label>)}</fieldset> : null;
    })}</div>
    <button type="button" className="custom-toggle" aria-expanded={customOpen} onClick={() => setCustomOpen(value => !value)}><span>＋</span> Custom coordinates <b>{customOpen ? 'Close' : 'Add'}</b></button>
    {customOpen && <form className="custom-site" onSubmit={addCustom} noValidate><label>Latitude (°)<input inputMode="decimal" value={lat} onChange={event => setLat(event.target.value)} placeholder="−85.000" /></label><label>Longitude (°)<input inputMode="decimal" value={lon} onChange={event => setLon(event.target.value)} placeholder="45.000" /></label><button type="submit" disabled={atLimit}>Add point</button></form>}
    <p className="site-feedback" role="status" aria-live="polite">{feedback || (atLimit ? 'Four-site comparison limit reached.' : 'Select curated sites or add a south-pole coordinate.')}</p>
  </section>;
}
