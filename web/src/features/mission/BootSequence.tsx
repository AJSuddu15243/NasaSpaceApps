import { useEffect, useState } from 'react';
import type { Status } from './useMissionData';

export interface BootLine { label: string; detail: string; status: Status }

/**
 * Cinematic start-up log. Every line resolves from a real load, never a timer; the overlay leaves once
 * everything is ready (or on click / Escape). Errors stay visible with a retry.
 */
export function BootSequence({ lines, onDone, onRetry }: { lines: BootLine[]; onDone: () => void; onRetry: () => void }) {
  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [leaving, setLeaving] = useState(false);
  const ready = lines.every(line => line.status === 'ready');
  const failed = lines.some(line => line.status === 'error');
  useEffect(() => {
    if (!ready) return;
    const hold = window.setTimeout(() => setLeaving(true), reduced ? 0 : 650);
    return () => clearTimeout(hold);
  }, [ready, reduced]);
  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(onDone, reduced ? 0 : 700);
    return () => clearTimeout(timer);
  }, [leaving, onDone, reduced]);
  useEffect(() => {
    const skip = (event: KeyboardEvent) => { if (event.key === 'Escape') setLeaving(true); };
    window.addEventListener('keydown', skip);
    return () => window.removeEventListener('keydown', skip);
  }, []);
  return <div className={`boot ${leaving ? 'boot-leaving' : ''}`} role="status" aria-live="polite" onClick={() => !failed && setLeaving(true)}>
    <div className="boot-ring" aria-hidden="true"><i/><i/><i/></div>
    <div className="boot-log">
      <p className="boot-title">LUNALA · MISSION CONTROL</p>
      {lines.map((line, i) => <p key={line.label} className={`boot-line boot-${line.status}`} style={{ animationDelay: `${i * 120}ms` }}>
        <span className="boot-mark" aria-hidden="true">{line.status === 'ready' ? '■' : line.status === 'error' ? '×' : '▢'}</span>
        <span>{line.label}</span><b>{line.status === 'ready' ? line.detail : line.status === 'error' ? 'FAILED' : 'LOADING'}</b>
      </p>)}
      {failed ? <button type="button" className="boot-retry" onClick={event => { event.stopPropagation(); onRetry(); }}>Retry loading</button>
        : <p className="boot-hint">{ready ? 'ALL SYSTEMS NOMINAL' : 'Click or press Esc to skip'}</p>}
      <button type="button" className="boot-retry" onClick={event => { event.stopPropagation(); if (reduced) onDone(); else setLeaving(true); }}>Continue to workspace</button>
    </div>
  </div>;
}
