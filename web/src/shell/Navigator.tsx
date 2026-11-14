import { useEffect, useRef, useState } from 'react';
import { Link2, PanelLeft, PanelRight } from 'lucide-react';
import { loadDemoData, type DemoData } from './data';
import { useShell } from './store';
import { syncRemoteScenarios } from '../scenarios/store';
import { Button } from './ui';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup, type ImperativePanelHandle } from '../design';
import { useMediaQuery } from './useMediaQuery';
import { ScenarioPanel } from './components/ScenarioPanel';
import { ViewPanel } from './components/ViewPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { TooltipProvider } from '../design';
import './workspace.css';

type LoadState = { status: 'loading' } | { status: 'ready'; data: DemoData } | { status: 'error'; message: string };

const NARROW = '(max-width: 1020px)';

export default function Navigator() {
  const { scenario, warnings, setScenario } = useShell();
  const [load, setLoad] = useState<LoadState>({ status: 'loading' });
  const [attempt, retry] = useState(0);
  const narrow = useMediaQuery(NARROW);
  const leftRef = useRef<ImperativePanelHandle>(null);
  const rightRef = useRef<ImperativePanelHandle>(null);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  useEffect(() => { void syncRemoteScenarios(); }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoad({ status: 'loading' });
    loadDemoData(controller.signal).then(data => { if (!controller.signal.aborted) setLoad({ status: 'ready', data }); })
      .catch((error: unknown) => { if (!controller.signal.aborted) setLoad({ status: 'error', message: error instanceof Error ? error.message : 'Demo data could not load.' }); });
    return () => controller.abort();
  }, [attempt]);

  const panels = load.status === 'ready' && <>
    {scenario.sites.some(id => !load.data.sites.some(site => site.id === id)) && <div className="ws-notices"><p role="status" className="notice">Some linked sites are unavailable in this demo catalogue. Choose available sites or restore the demo scenario.</p></div>}
    {narrow ? <div className="workspace-stack">
      <ScenarioPanel scenario={scenario} data={load.data} change={setScenario} />
      <ViewPanel scenario={scenario} data={load.data} change={setScenario} />
      <ResultsPanel scenario={scenario} data={load.data} />
    </div> : <div className="workspace-panels">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="workspace-panel" ref={leftRef} defaultSize={20} minSize={15} maxSize={28} collapsible collapsedSize={0}
          onCollapse={() => setLeftCollapsed(true)} onExpand={() => setLeftCollapsed(false)}>
          <ScenarioPanel scenario={scenario} data={load.data} change={setScenario} onCollapse={() => leftRef.current?.collapse()} />
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="Resize sites panel" />
        <ResizablePanel className="workspace-panel" defaultSize={60} minSize={42}>
          <ViewPanel scenario={scenario} data={load.data} change={setScenario} />
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="Resize comparison panel" />
        <ResizablePanel className="workspace-panel" ref={rightRef} defaultSize={20} minSize={15} maxSize={30} collapsible collapsedSize={0}
          onCollapse={() => setRightCollapsed(true)} onExpand={() => setRightCollapsed(false)}>
          <ResultsPanel scenario={scenario} data={load.data} onCollapse={() => rightRef.current?.collapse()} />
        </ResizablePanel>
      </ResizablePanelGroup>
      {leftCollapsed && <button type="button" className="panel-expand panel-expand-left" onClick={() => leftRef.current?.expand()} aria-label="Show sites panel"><PanelLeft size={15} aria-hidden="true" /><span>Sites</span></button>}
      {rightCollapsed && <button type="button" className="panel-expand panel-expand-right" onClick={() => rightRef.current?.expand()} aria-label="Show comparison panel"><span>Compare</span><PanelRight size={15} aria-hidden="true" /></button>}
    </div>}
  </>;

  return <main id="main" className="workspace" tabIndex={-1}>
    <div className="ws-topbar">
      <div>
        <p className="eyebrow">MISSION ANALYSIS</p>
        <h1>Compare the window. Read the horizon.</h1>
      </div>
      <div className="ws-topbar-right">
        <ShareButton />
        <span className="ws-date">{scenario.date.slice(0, 10)} UTC</span>
        <div className="ws-mode" role="group" aria-label="Experience mode">
          <button type="button" aria-pressed={scenario.mode === 'planner'} onClick={() => setScenario({ mode: 'planner' })}>Planner</button>
          <button type="button" aria-pressed={scenario.mode === 'explorer'} onClick={() => setScenario({ mode: 'explorer' })}>Explorer</button>
        </div>
      </div>
    </div>
    <div className="ws-banner"><strong><i/> Preview environment</strong><span className="ws-banner-note">Synthetic terrain and results · no landing recommendation</span></div>
    {warnings.length > 0 && <div role="alert" className="notice ws-notices">{warnings.map(w => <p key={w}>{w}</p>)}</div>}
    {scenario.mode === 'explorer' && <p className="ws-explainer">Pick places and dates to compare how much sunlight they receive and how often they have a clear view of Earth for communication.</p>}
    {load.status === 'loading' && <div role="status" className="loading-workspace"><span>Loading demo catalogue…</span></div>}
    {load.status === 'error' && <div className="load-error" role="alert"><h2>The workspace could not load.</h2><p>{load.message}</p><Button onClick={() => retry(value => value + 1)}>Retry loading</Button></div>}
    <TooltipProvider delayDuration={250}>{panels}</TooltipProvider>
  </main>;
}

function ShareButton() {
  const [copied, setCopied] = useState(false);
  async function share() {
    const url = `${window.location.origin}/app${window.location.search}`;
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { window.prompt('Copy this scenario link:', url); }
  }
  return <button type="button" className="ws-share" onClick={share} aria-label={copied ? 'Scenario link copied' : 'Copy scenario link'}>
    <Link2 size={13} aria-hidden="true" />{copied ? 'Copied' : 'Share'}
  </button>;
}
