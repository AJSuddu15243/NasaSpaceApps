import { GraphicsControl, useGraphics } from './lib/graphics';
import { Component, lazy, StrictMode, Suspense, useEffect, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { useShell } from './shell/store';
import { writeScenario } from './shell/scenario';
import { Button } from './shell/ui';
import { preloadTerrain } from './shell/preload';
import { LandingPage } from './landing/LandingPage';
import mark from './brand/assets/mark.svg';
import './styles.css';
// Optional WEB-2 stylesheet: an eager glob is empty until that workstream is present.
import.meta.glob('./design/styles.css', { eager: true });
import './shell/theme.css';
const Navigator = lazy(() => import('./shell/Navigator'));
const DocsPage = lazy(() => import('./docs/DocsPage').then(m => ({ default: m.DocsPage })));
function App() {
  const { path, scenario, navigate } = useShell();
  const graphics = useGraphics();
  const [share, setShare] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  useEffect(() => { if (path.startsWith('/app') && !graphics.lite) preloadTerrain(); }, [path, graphics.lite]);
  useEffect(() => { document.title = `${path.startsWith('/app') ? 'Workspace' : path === '/docs' ? 'Documentation' : 'Learn the Moon'} · Lunala`; }, [path]);
  async function copyLink() {
    const url = `${location.origin}/app${writeScenario(scenario)}`;
    try { await navigator.clipboard.writeText(url); setShare('Scenario link copied.'); setShareUrl(''); }
    catch { setShare('Copy this scenario link:'); setShareUrl(url); }
  }
  if (path === '/') return <><a className="skip-link" href="#main">Skip to content</a><LandingPage onOpen={() => navigate('/app')}/></>;
  return <><a className="skip-link" href="#main">Skip to content</a><header className="app-header"><a className="wordmark" href="/" onClick={e => { e.preventDefault(); navigate('/'); }}><img src={mark} alt=""/><span><b>Lunala</b><small>LUNAR LANDING SITE NAVIGATOR</small></span></a><div className="app-header-controls"><nav aria-label="Main navigation"><a href="/app" aria-current={path === '/app' || path === '/app/' ? 'page' : undefined} onClick={e => { if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) { e.preventDefault(); navigate('/app'); } }}>Workspace</a><a href="/docs" aria-current={path === '/docs' || path === '/docs/' ? 'page' : undefined} onClick={e => { if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) { e.preventDefault(); navigate('/docs'); } }}>Docs</a></nav><div className="app-header-tools"><GraphicsControl/><Button className="share-control" variant="outline" onClick={copyLink}>Share</Button></div></div></header>
    {share && <div className="share-notice"><p role="status">{share}</p>{shareUrl && <input aria-label="Scenario link" value={shareUrl} readOnly onFocus={event => event.target.select()}/>}<Button variant="ghost" onClick={() => { setShare(''); setShareUrl(''); }}>Dismiss</Button></div>}
    <Suspense fallback={<main id="main" className="workspace" role="status">Loading workspace…</main>}>{path === '/docs' || path === '/docs/' ? <DocsPage/> : path === '/app' || path === '/app/' ? <Navigator/> : <main id="main" className="workspace"><h1>Page not found</h1><p>This address is not part of the navigator.</p><Button onClick={() => navigate('/app')}>Open workspace</Button></main>}</Suspense>
    <footer className="app-footer"><span>Lunala · a public learning lab for lunar exploration</span><span>UTC throughout · LOLA terrain · JPL Horizons · Rust/WASM engine</span></footer>
  </>;
}
class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <main className="workspace"><h1>The interface could not load.</h1><p>Your scenario is still in the address bar.</p><Button onClick={() => location.reload()}>Reload workspace</Button></main> : this.props.children; }
}
createRoot(document.getElementById('root')!).render(<StrictMode><ErrorBoundary><App/></ErrorBoundary></StrictMode>);
