import { useMemo, useState, type FormEvent } from 'react';
import { ChevronRight, Search } from 'lucide-react';
import type { Site } from '../../contracts/sites';
import { customSiteId, MAX_SELECTED_SITES, parseCustomSite, searchSites, validateCoordinates } from './sites';

const categoryLabel: Record<Site['category'], string> = {
  artemis3: 'Artemis III candidates', clps: 'CLPS regions', intl: 'International missions', apollo: 'Apollo references',
};

const coordsText = (lat: number, lon: number) => `${Math.abs(lat).toFixed(2)}°${lat < 0 ? 'S' : 'N'} · ${Math.abs(lon).toFixed(2)}°${lon < 0 ? 'W' : 'E'}`;

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
    return custom ? coordsText(custom.lat, custom.lon) : id;
  };

  return <div className="sp">
    <div className="ws-scroll">
      <div className="sp-selected" aria-label="Selected sites">
        {selected.length === 0
          ? <span className="sp-empty-chips">No sites selected</span>
          : selected.map((id, index) => <button type="button" key={id} className="sp-chip" onClick={() => toggle(id)} aria-label={`Remove ${selectedName(id)}`}>
              <span className="sp-chip-idx">{String(index + 1).padStart(2, '0')}</span>
              <span className="sp-chip-name">{selectedName(id)}</span>
              <span className="sp-chip-x" aria-hidden="true">×</span>
            </button>)}
      </div>

      <label className="sp-search">
        <Search size={13} aria-hidden="true" />
        <span className="sr-only">Search sites</span>
        <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search sites" />
      </label>

      <div className="sp-groups">
        {matches.length === 0 && <p className="sp-feedback">No sites match “{query}”.</p>}
        {(Object.keys(categoryLabel) as Site['category'][]).map(category => {
          const options = matches.filter(site => site.category === category);
          if (!options.length) return null;
          return <div key={category} role="group" aria-label={categoryLabel[category]}>
            <p className="sp-group-label">{categoryLabel[category]}</p>
            {options.map(site => {
              const pressed = selectedSet.has(site.id);
              return <button type="button" key={site.id} className="sp-row" aria-pressed={pressed} disabled={atLimit && !pressed} onClick={() => toggle(site.id)}>
                <span className="sp-dot" aria-hidden="true" />
                <span className="sp-row-text">
                  <span className="sp-row-name">{site.name}</span>
                  {site.note && <span className="sp-note">{site.note}</span>}
                </span>
                <span className="sp-row-coords">{coordsText(site.lat, site.lon)}</span>
              </button>;
            })}
          </div>;
        })}
      </div>

      <details className="sp-custom" open={customOpen} onToggle={event => setCustomOpen((event.target as HTMLDetailsElement).open)}>
        <summary><ChevronRight size={13} aria-hidden="true" /> Custom coordinates</summary>
        <form onSubmit={addCustom} noValidate>
          <label>Latitude (°)<input inputMode="decimal" value={lat} onChange={event => setLat(event.target.value)} placeholder="−85.000" /></label>
          <label>Longitude (°)<input inputMode="decimal" value={lon} onChange={event => setLon(event.target.value)} placeholder="45.000" /></label>
          <button type="submit" className="ui-button ui-button-outline" disabled={atLimit}>Add</button>
        </form>
      </details>

      <p className="sp-feedback" role="status" aria-live="polite">{feedback || (atLimit ? 'Four-site comparison limit reached.' : 'South of 80°S only.')}</p>
    </div>
  </div>;
}
