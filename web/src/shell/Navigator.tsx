import { useEffect, useRef, useState } from 'react';
import { PanelLeft, PanelRight } from 'lucide-react';
import { loadDemoData, type DemoData } from './data';
import { useShell } from './store';
import { Button } from './ui';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup, type ImperativePanelHandle } from '../design';
import { useMediaQuery } from './useMediaQuery';
import { ScenarioPanel } from './components/ScenarioPanel';
import { ViewPanel } from './components/ViewPanel';
import { ResultsPanel } from './components/ResultsPanel';
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

  useEffect(() => {
    const controller = new AbortController();
    setLoad({ status: 'loading' });
    loadDemoData(controller.signal).then(data => { if (!controller.signal.aborted) setLoad({ status: 'ready', data }); })
      .catch((error: unknown) => { if (!controller.signal.aborted) setLoad({ status: 'error', message: error instanceof Error ? error.message : 'Demo data could not load.' }); });
    return () => controller.abort();
  }, [attempt]);

  const panels = load.status === 'ready' && <>
    {scenario.sites.some(id => !load.data.sites.some(site => site.id === id)) && <p role="status" className="notice">Some linked sites are unavailable in this demo catalogue. Choose available sites or restore the demo scenario.</p>}
    {narrow ? <div className="workspace-stack">
      <ScenarioPanel scenario={scenario} data={load.data} change={setScenario} />
      <ViewPanel scenario={scenario} data={load.data} change={setScenario} />
      <ResultsPanel scenario={scenario} data={load.data} />
    </div> : <div className="workspace-panels">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="workspace-panel" ref={leftRef} defaultSize={21} minSize={15} maxSize={30} collapsible collapsedSize={0}
          onCollapse={() => setLeftCollapsed(true)} onExpand={() => setLeftCollapsed(false)}>
          <ScenarioPanel scenario={scenario} data={load.data} change={setScenario} onCollapse={() => leftRef.current?.collapse()} />
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="Resize sites panel" />
        <ResizablePanel className="workspace-panel" defaultSize={56} minSize={34}>
          <ViewPanel scenario={scenario} data={load.data} change={setScenario} />
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="Resize comparison panel" />
        <ResizablePanel className="workspace-panel" ref={rightRef} defaultSize={23} minSize={17} maxSize={36} collapsible collapsedSize={0}
          onCollapse={() => setRightCollapsed(true)} onExpand={() => setRightCollapsed(false)}>
          <ResultsPanel scenario={scenario} data={load.data} onCollapse={() => rightRef.current?.collapse()} />
        </ResizablePanel>
      </ResizablePanelGroup>
      {leftCollapsed && <button type="button" className="panel-expand panel-expand-left" onClick={() => leftRef.current?.expand()} aria-label="Show sites panel"><PanelLeft size={15} aria-hidden="true" /><span>Sites</span></button>}
      {rightCollapsed && <button type="button" className="panel-expand panel-expand-right" onClick={() => rightRef.current?.expand()} aria-label="Show comparison panel"><span>Compare</span><PanelRight size={15} aria-hidden="true" /></button>}
    </div>}
  </>;

  return <main id="main" className="workspace" tabIndex={-1}>
    <div className="workspace-heading"><div><p className="eyebrow">MISSION ANALYSIS / SCENARIO 001</p><h1>Compare the window.<br/><span>Read the horizon.</span></h1></div><div className="mode-switch" role="group" aria-label="Experience mode"><Button variant={scenario.mode === 'planner' ? 'secondary' : 'ghost'} aria-pressed={scenario.mode === 'planner'} onClick={() => setScenario({ mode: 'planner' })}>Planner</Button><Button variant={scenario.mode === 'explorer' ? 'secondary' : 'ghost'} aria-pressed={scenario.mode === 'explorer'} onClick={() => setScenario({ mode: 'explorer' })}>Explorer</Button></div></div>
    <div className="demo-banner"><strong><i/> Preview environment</strong><span>Synthetic terrain and results · no landing recommendation</span><time>{scenario.date.slice(0, 10)} UTC</time></div>
    {warnings.length > 0 && <div role="alert" className="notice">{warnings.map(w => <p key={w}>{w}</p>)}</div>}
    {scenario.mode === 'explorer' && <p className="explainer">Pick places and dates to compare how much sunlight they receive and how often they have a clear view of Earth for communication.</p>}
    {load.status === 'loading' && <div role="status" className="loading-workspace"><span>Loading demo catalogue…</span><div className="loading-blocks" aria-hidden="true"><div/><div/><div/></div></div>}
    {load.status === 'error' && <div className="load-error" role="alert"><h2>The workspace could not load.</h2><p>{load.message}</p><Button onClick={() => retry(value => value + 1)}>Retry loading</Button></div>}
    {panels}
  </main>;
}
