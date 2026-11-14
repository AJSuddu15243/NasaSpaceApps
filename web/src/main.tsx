import { Component, lazy, StrictMode, Suspense, useEffect, useState, type ComponentType, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { useShell } from './shell/store';
import { writeScenario } from './shell/scenario';
import { Button } from './shell/ui';
import { LandingPage } from './landing/LandingPage';
import mark from './brand/assets/mark.svg';
import './styles.css';
// Optional WEB-2 stylesheet: an eager glob is empty until that workstream is present.
import.meta.glob('./design/styles.css', { eager: true });
const Navigator = lazy(() => import('./shell/Navigator'));
const DocsPage = lazy(() => import('./docs/DocsPage').then(m => ({ default: m.DocsPage })));
const designModules = import.meta.env.DEV ? import.meta.glob<{ DesignPage: ComponentType }>('./design/DesignPage.tsx') : {};
const designLoader = Object.values(designModules)[0];
const Design = designLoader ? lazy(async () => ({ default: (await designLoader()).DesignPage })) : null;
function App() {
  const { path, scenario, navigate } = useShell();
  const [share, setShare] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  useEffect(() => { document.title = `${path.startsWith('/app') ? 'Workspace' : path === '/design' ? 'Design reference' : path === '/docs' ? 'Documentation' : 'Lunar Landing Site Navigator'} · Lunar Window`; }, [path]);
  async function copyLink() {
    const url = `${location.origin}/app${writeScenario(scenario)}`;
    try { await navigator.clipboard.writeText(url); setShare('Scenario link copied.'); setShareUrl(''); }
    catch { setShare('Copy this scenario link:'); setShareUrl(url); }
  }
  if (path === '/design' && Design) return <Suspense fallback={<p role="status">Loading design reference…</p>}><Design/></Suspense>;
  return <><a className="skip-link" href="#main">Skip to content</a><header className="app-header"><a className="wordmark" href="/" onClick={e => { e.preventDefault(); navigate('/'); }}><img src={mark} alt=""/><span><b>Lunar Window</b><small>LUNAR LANDING SITE NAVIGATOR</small></span></a><div className="system-status"><i/> SYNTHETIC DATA</div><nav aria-label="Main navigation"><a href="/app" aria-current={path === '/app' || path === '/app/' ? 'page' : undefined} onClick={e => { if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) { e.preventDefault(); navigate('/app'); } }}>Workspace</a><a href="/docs" aria-current={path === '/docs' || path === '/docs/' ? 'page' : undefined} onClick={e => { if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) { e.preventDefault(); navigate('/docs'); } }}>Docs</a>{Design && <a href="/design">Design</a>}<Button variant="outline" onClick={copyLink}>Share</Button></nav></header>
    {share && <div className="share-notice"><p role="status">{share}</p>{shareUrl && <input aria-label="Scenario link" value={shareUrl} readOnly onFocus={event => event.target.select()}/>}<Button variant="ghost" onClick={() => { setShare(''); setShareUrl(''); }}>Dismiss</Button></div>}
    <Suspense fallback={<main id="main" className="workspace" role="status">Loading workspace…</main>}>{path === '/' ? <LandingPage onOpen={() => navigate('/app')}/> : path === '/docs' || path === '/docs/' ? <DocsPage/> : path === '/app' || path === '/app/' ? <Navigator/> : <main id="main" className="workspace"><h1>Page not found</h1><p>This address is not part of the navigator.</p><Button onClick={() => navigate('/app')}>Open workspace</Button></main>}</Suspense>
    <footer className="app-footer"><span>NASA Space Apps project · independent team prototype</span><span>UTC throughout · synthetic demonstration data</span></footer>
  </>;
}
class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <main className="workspace"><h1>The interface could not load.</h1><p>Your scenario is still in the address bar.</p><Button onClick={() => location.reload()}>Reload workspace</Button></main> : this.props.children; }
}
createRoot(document.getElementById('root')!).render(<StrictMode><ErrorBoundary><App/></ErrorBoundary></StrictMode>);
