import { useEffect, useState } from 'react';
import { loadDemoData, type DemoData } from './data';
import { useShell } from './store';
import { Button } from './ui';
import { ScenarioPanel } from './components/ScenarioPanel';
import { ViewPanel } from './components/ViewPanel';
import { ResultsPanel } from './components/ResultsPanel';
type LoadState = { status: 'loading' } | { status: 'ready'; data: DemoData } | { status: 'error'; message: string };
export default function Navigator() {
  const { scenario, warnings, setScenario } = useShell();
  const [load, setLoad] = useState<LoadState>({ status: 'loading' });
  const [attempt, retry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoad({ status: 'loading' });
    loadDemoData(controller.signal).then(data => { if (!controller.signal.aborted) setLoad({ status: 'ready', data }); })
      .catch((error: unknown) => { if (!controller.signal.aborted) setLoad({ status: 'error', message: error instanceof Error ? error.message : 'Demo data could not load.' }); });
    return () => controller.abort();
  }, [attempt]);
  return <main id="main" className="workspace" tabIndex={-1}>
    <div className="workspace-heading"><div><p className="eyebrow">LANDING SITE WORKSPACE</p><h1>One window. Different horizons.</h1></div><div className="mode-switch" role="group" aria-label="Experience mode"><Button variant={scenario.mode === 'planner' ? 'secondary' : 'ghost'} aria-pressed={scenario.mode === 'planner'} onClick={() => setScenario({ mode: 'planner' })}>Planner</Button><Button variant={scenario.mode === 'explorer' ? 'secondary' : 'ghost'} aria-pressed={scenario.mode === 'explorer'} onClick={() => setScenario({ mode: 'explorer' })}>Explorer</Button></div></div>
    <div className="demo-banner"><strong>Interface preview</strong><span>All sites, terrain and results here are synthetic. No landing recommendation is being made.</span></div>
    {warnings.length > 0 && <div role="alert" className="notice">{warnings.map(w => <p key={w}>{w}</p>)}</div>}
    {scenario.mode === 'explorer' && <p className="explainer">Pick places and dates to compare how much sunlight they receive and how often they have a clear view of Earth for communication.</p>}
    {load.status === 'loading' && <div role="status" className="loading-workspace"><span>Loading demo catalogue…</span><div className="loading-blocks" aria-hidden="true"><div/><div/><div/></div></div>}
    {load.status === 'error' && <div className="load-error" role="alert"><h2>The workspace could not load.</h2><p>{load.message}</p><Button onClick={() => retry(value => value + 1)}>Retry loading</Button></div>}
    {load.status === 'ready' && <>
      {scenario.sites.some(id => !load.data.sites.some(site => site.id === id)) && <p role="status" className="notice">Some linked sites are unavailable in this demo catalogue. Choose available sites or restore the demo scenario.</p>}
      <div className="workspace-grid"><ScenarioPanel scenario={scenario} data={load.data} change={setScenario}/><ViewPanel scenario={scenario} change={setScenario}/><ResultsPanel scenario={scenario} data={load.data}/></div>
    </>}
  </main>;
}
