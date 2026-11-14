import { useEffect, useState, type ReactNode } from 'react';
import type { Site } from './contracts/sites.ts';
import { mockSiteMetrics } from './engine/mock.ts';
import { useAppStore } from './state/store.ts';
import { routeForPath } from './routing.ts';

export function AppShell({ sitesPanel, scenarioPanel, scenePanel, comparePanel }: {
  sitesPanel: ReactNode; scenarioPanel: ReactNode; scenePanel: ReactNode; comparePanel: ReactNode;
}) {
  return <div className="app-frame">
    <header className="app-header"><a className="app-brand" href="/">Lunar Landing Site Navigator</a><span>Mission planning preview</span></header>
    <div className="app-columns">
      <aside className="app-left" aria-label="Sites and scenario"><section>{sitesPanel}</section><section>{scenarioPanel}</section></aside>
      <main className="app-center" aria-label="Lunar view">{scenePanel}</main>
      <aside className="app-right" aria-label="Site comparison">{comparePanel}</aside>
    </div>
  </div>;
}

function Landing() {
  return <main className="landing-shell"><p>NASA Space Apps · Lunar south pole</p><h1>Compare landing sites across time.</h1><p>Explore sunlight, terrain, temperature and Earth contact in one planning view.</p><a href="/app">Open the navigator</a></main>;
}

function Navigator() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const siteIds = useAppStore(state => state.siteIds);
  const setSiteIds = useAppStore(state => state.setSiteIds);
  const dateIso = useAppStore(state => state.dateIso);
  const windowHours = useAppStore(state => state.windowHours);
  const mode = useAppStore(state => state.mode);
  const setMode = useAppStore(state => state.setMode);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/data/mock/sites.json', { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json() as Promise<Site[]>;
    }).then(setSites).catch(cause => {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : 'Unknown error');
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);
  const metrics = mockSiteMetrics();
  return <AppShell
    sitesPanel={<><h2>Sites</h2>{loading ? <p role="status">Loading sites…</p> : error ? <p role="alert">Could not load sites: {error}</p> : <><p className="muted">Illustrative sites. Select up to four.</p>{sites.map(site => <label className="site-option" key={site.id}><input type="checkbox" checked={siteIds.includes(site.id)} disabled={siteIds.length >= 4 && !siteIds.includes(site.id)} onChange={() => setSiteIds(siteIds.includes(site.id) ? siteIds.filter(id => id !== site.id) : [...siteIds, site.id])} />{site.name}</label>)}</>}</>}
    scenarioPanel={<><h2>Scenario</h2><p className="muted">{new Date(dateIso).toUTCString()}</p><p className="muted">Window: {windowHours} h</p><div className="mode-buttons"><button type="button" aria-pressed={mode === 'planner'} onClick={() => setMode('planner')}>Planner</button><button type="button" aria-pressed={mode === 'explorer'} onClick={() => setMode('explorer')}>Explorer</button></div><p className="muted">Scenario controls mount here.</p></>}
    scenePanel={<div className="scene-placeholder"><p>South pole view</p><h2>Terrain scene mounts here</h2><p>3D, panorama and map views share this panel.</p></div>}
    comparePanel={<><h2>Compare sites</h2>{siteIds.length === 0 ? <p className="muted">Select sites to compare conditions.</p> : <><p className="muted">Mock engine output · not mission data</p><p>Sunlit: <strong>{metrics.pct_lit}%</strong></p><p>Earth contact: <strong>{metrics.pct_earth_visible}%</strong></p><p className="muted">Compare cards mount here.</p></>}</>}
  />;
}

export default function App() { return routeForPath(window.location.pathname) === 'app' ? <Navigator /> : <Landing />; }
