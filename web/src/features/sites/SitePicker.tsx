import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { addSelection, categories, customSiteId, MAX_SELECTED_SITES, searchSites, SITE_MAP_CLICK_EVENT, validateCustomSite, type CuratedSite, type SelectedSite, type SiteMapClickDetail } from './sites.ts';
import './site-picker.css';

export interface SitePickerProps {
  curatedSites: readonly CuratedSite[];
  selectedSites: readonly SelectedSite[];
  onSelectionChange: (sites: SelectedSite[]) => void;
  mapClickTarget?: EventTarget;
  loading?: boolean;
  error?: string | null;
}

export function SitePicker({ curatedSites, selectedSites, onSelectionChange, mapClickTarget, loading = false, error = null }: SitePickerProps) {
  const [query, setQuery] = useState('');
  const [name, setName] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [feedback, setFeedback] = useState('');
  const matching = useMemo(() => searchSites(curatedSites, query), [curatedSites, query]);
  const atLimit = selectedSites.length >= MAX_SELECTED_SITES;
  const selectedIds = new Set(selectedSites.map(site => site.id));

  useEffect(() => {
    const target = mapClickTarget ?? window;
    const onMapClick = (event: Event) => {
      const detail = (event as CustomEvent<SiteMapClickDetail>).detail;
      if (!detail) return;
      if (!Number.isFinite(detail.lat) || !Number.isFinite(detail.lon)) { setFeedback('Map site not added: coordinates are unavailable.'); return; }
      const siteName = detail.name?.trim() || `Map site ${detail.lat.toFixed(3)}°, ${detail.lon.toFixed(3)}°`;
      const valid = validateCustomSite(siteName, String(detail.lat), String(detail.lon));
      if (typeof valid === 'string') { setFeedback(`Map site not added: ${valid}`); return; }
      const next = addSelection(selectedSites, { kind: 'custom', id: customSiteId(valid.lat, valid.lon), ...valid });
      if (typeof next === 'string') setFeedback(next);
      else if (next.length === selectedSites.length) setFeedback('These coordinates are already selected.');
      else { onSelectionChange(next); setFeedback(`${valid.name} added from map.`); }
    };
    target.addEventListener(SITE_MAP_CLICK_EVENT, onMapClick);
    return () => target.removeEventListener(SITE_MAP_CLICK_EVENT, onMapClick);
  }, [mapClickTarget, onSelectionChange, selectedSites]);

  const toggle = (site: CuratedSite) => {
    if (selectedIds.has(site.id)) {
      onSelectionChange(selectedSites.filter(item => item.id !== site.id));
      setFeedback(`${site.name} removed.`);
      return;
    }
    const next = addSelection(selectedSites, { kind: 'curated', id: site.id, site });
    if (typeof next === 'string') setFeedback(next);
    else { onSelectionChange(next); setFeedback(`${site.name} added.`); }
  };

  const submitCustom = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const valid = validateCustomSite(name, lat, lon);
    if (typeof valid === 'string') { setFeedback(valid); return; }
    const next = addSelection(selectedSites, { kind: 'custom', id: customSiteId(valid.lat, valid.lon), ...valid });
    if (typeof next === 'string') { setFeedback(next); return; }
    if (next.length === selectedSites.length) { setFeedback('These coordinates are already selected.'); return; }
    onSelectionChange(next);
    setFeedback(`${valid.name} added.`);
    setName(''); setLat(''); setLon('');
  };

  return <section className="site-picker" aria-labelledby="site-picker-title">
    <header className="site-picker-header"><div><h2 id="site-picker-title">Choose landing sites</h2><p>Compare up to {MAX_SELECTED_SITES} locations.</p></div><strong aria-label={`${selectedSites.length} of ${MAX_SELECTED_SITES} sites selected`}>{selectedSites.length} / {MAX_SELECTED_SITES}</strong></header>
    {selectedSites.length > 0 && <div className="site-picker-selected" aria-label="Selected sites">{selectedSites.map(item => <button key={item.id} type="button" onClick={() => { onSelectionChange(selectedSites.filter(site => site.id !== item.id)); setFeedback(`${item.kind === 'curated' ? item.site.name : item.name} removed.`); }} aria-label={`Remove ${item.kind === 'curated' ? item.site.name : item.name}`}>{item.kind === 'curated' ? item.site.name : item.name}<span aria-hidden="true">×</span></button>)}</div>}
    {atLimit && <p className="site-picker-limit">Four sites selected. Remove one to add another.</p>}
    <p className="site-picker-feedback" role="status" aria-live="polite">{feedback}</p>
    <label className="site-picker-search-label" htmlFor="site-search">Search curated sites</label>
    <input id="site-search" className="site-picker-input" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Name, mission, or location" autoComplete="off" />
    {loading ? <p className="site-picker-state" role="status">Loading curated sites…</p> : error ? <p className="site-picker-state site-picker-error" role="alert">Sites unavailable: {error}</p> : matching.length === 0 ? <p className="site-picker-state">No curated sites match “{query}”. Try another name or add coordinates below.</p> : <div className="site-picker-groups">{categories.map(category => {
      const sites = matching.filter(site => site.category === category.id);
      return sites.length ? <fieldset key={category.id}><legend>{category.label}<span>{sites.length}</span></legend><div className="site-picker-options">{sites.map(site => <label key={site.id} className="site-picker-option"><input type="checkbox" checked={selectedIds.has(site.id)} disabled={atLimit && !selectedIds.has(site.id)} onChange={() => toggle(site)} /><span className="site-picker-option-copy"><strong>{site.name}</strong><small>{site.lat.toFixed(2)}°, {site.lon.toFixed(2)}° · {site.note}</small></span></label>)}</div></fieldset> : null;
    })}</div>}
    <form className="site-picker-custom" onSubmit={submitCustom} noValidate><h3>Add coordinates</h3><p>Custom sites must be between 90°S and 80°S.</p><div className="site-picker-fields"><label>Site name<input className="site-picker-input" value={name} onChange={event => setName(event.target.value)} maxLength={80} required /></label><label>Latitude (°)<input className="site-picker-input" inputMode="decimal" value={lat} onChange={event => setLat(event.target.value)} placeholder="−85.00" required /></label><label>Longitude (°)<input className="site-picker-input" inputMode="decimal" value={lon} onChange={event => setLon(event.target.value)} placeholder="45.00" required /></label></div><button className="site-picker-add" type="submit" disabled={atLimit}>Add site</button></form>
  </section>;
}
