import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import './tour.css';

const STORAGE_KEY = 'lunar-window-tour-v2';
export const TOUR_STEPS = [
  { anchor: 'sites', title: 'Choose a place', text: 'Pick one of the three Artemis III regions, search the catalogue, or click anywhere on the Moon. The camera flies in and a holographic survey lifts off the surface.' },
  { anchor: 'layers', title: 'Read the heatmaps', text: 'Switch between sunlight, Earth contact (radio), ice traps, topography and slope. Every dot is a real 160 m patch of ground: move your cursor over the survey to read it.' },
  { anchor: 'timeline', title: 'Move the date', text: 'Drag the playhead or slip the launch by days. The Sun and Earth lanes show their elevation for the place you are looking at, and the shares count the hours the Sun is lit and Earth is in view over the real terrain horizon (Rust/WASM engine; flat horizon where no survey exists). All times are UTC.' },
  { anchor: 'mode', title: 'Set your priorities', text: 'Explorer gives plain-language mission presets. Planner gives exact weights, the slope limit and a CSV export. Both re-rank the landing areas instantly.' },
  { anchor: 'evidence', title: 'Compare and check the evidence', text: 'Shortlist up to four places and compare them side by side. Evidence lists every data source and checks our Sun and Earth positions against NASA JPL Horizons.' },
] as const;

type Rect = { top: number; left: number; width: number; height: number };

function seenTour(): boolean {
  try { return localStorage.getItem(STORAGE_KEY) === 'done'; } catch { return false; }
}

function place(r: Rect | null): CSSProperties {
  const W = Math.min(360, innerWidth - 24);
  if (!r || innerWidth < 640) return { left: 12, right: 12, bottom: 12 };
  const tall = r.height > innerHeight * 0.45;
  if (tall) {
    const left = r.left + r.width + 18 + W < innerWidth ? r.left + r.width + 18 : Math.max(12, r.left - W - 18);
    return { left, top: Math.min(Math.max(12, r.top + 40), innerHeight - 300), width: W };
  }
  const left = Math.min(Math.max(12, r.left + r.width / 2 - W / 2), innerWidth - W - 12);
  return r.top + r.height / 2 > innerHeight / 2 ? { left, bottom: innerHeight - r.top + 18, width: W } : { left, top: r.top + r.height + 18, width: W };
}

/** Presentation-only guidance: never changes the user's scenario. Skip / Esc / Back / Next / Replay. */
export function NavigatorTour({ replayKey = 0, enabled = true, onStep }: { replayKey?: number; enabled?: boolean; onStep?: (anchor: string) => void }) {
  const [mode, setMode] = useState<'closed' | 'offer' | 'tour'>(() => seenTour() ? 'closed' : 'offer');
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const previousReplay = useRef(replayKey);

  const close = useCallback(() => {
    try { localStorage.setItem(STORAGE_KEY, 'done'); } catch { /* still dismissible in private mode */ }
    setMode('closed');
    const target = restoreRef.current;
    if (target?.isConnected) target.focus({ preventScroll: true });
    else document.querySelector<HTMLElement>('#main')?.focus({ preventScroll: true });
  }, []);
  const start = useCallback(() => {
    const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    restoreRef.current = active?.closest('.navigator-tour') ? null : active;
    setStep(0); setMode('tour');
  }, []);

  useEffect(() => {
    if (replayKey === previousReplay.current) return;
    previousReplay.current = replayKey;
    start();
  }, [replayKey, start]);

  useLayoutEffect(() => { if (enabled && mode === 'tour') onStep?.(TOUR_STEPS[step].anchor); }, [step, enabled, mode, onStep]);

  useLayoutEffect(() => {
    if (!enabled || mode !== 'tour') { setRect(null); return; }
    const selector = `[data-tour="${TOUR_STEPS[step].anchor}"]`;
    const anchor = document.querySelector<HTMLElement>(selector);
    const update = () => {
      const currentAnchor = document.querySelector<HTMLElement>(selector);
      if (!currentAnchor) { setRect(null); return; }
      const r = currentAnchor.getBoundingClientRect();
      const top = Math.max(4, r.top - 6), left = Math.max(4, r.left - 6);
      const width = Math.min(innerWidth - 4, r.right + 6) - left, height = Math.min(innerHeight - 4, r.bottom + 6) - top;
      setRect(width > 0 && height > 0 ? { top, left, width, height } : null);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(anchor ?? document.querySelector('#main') ?? document.body);
    const mutation = new MutationObserver(update);
    mutation.observe(document.querySelector('#main') ?? document.body, { childList: true, subtree: true });
    const frame = requestAnimationFrame(update);
    addEventListener('resize', update);
    addEventListener('scroll', update, true);
    return () => { cancelAnimationFrame(frame); mutation.disconnect(); observer.disconnect(); removeEventListener('resize', update); removeEventListener('scroll', update, true); };
  }, [step, mode, enabled]);

  useEffect(() => { if (mode === 'tour') headingRef.current?.focus({ preventScroll: true }); }, [mode, step]);

  useEffect(() => {
    if (!enabled || mode === 'closed') return;
    const keys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); }
      if (mode === 'tour' && event.key === 'ArrowRight' && !(event.target instanceof HTMLInputElement)) setStep(s => Math.min(TOUR_STEPS.length - 1, s + 1));
      if (mode === 'tour' && event.key === 'ArrowLeft' && !(event.target instanceof HTMLInputElement)) setStep(s => Math.max(0, s - 1));
    };
    addEventListener('keydown', keys, true);
    return () => removeEventListener('keydown', keys, true);
  }, [mode, close, enabled]);

  if (!enabled || mode === 'closed') return null;
  const current = TOUR_STEPS[step];
  const last = step === TOUR_STEPS.length - 1;
  return createPortal(<>
    {mode === 'tour' && <div className="navigator-tour-spotlight" style={rect ?? { top: '50%', left: '50%', width: 0, height: 0 }} aria-hidden="true">{rect && <span>{step + 1}</span>}</div>}
    <aside className={`navigator-tour ${mode === 'offer' ? 'navigator-tour-offer' : ''}`} style={mode === 'tour' ? place(rect) : undefined} role={mode === 'tour' ? 'dialog' : 'region'} aria-modal={mode === 'tour' ? false : undefined} aria-labelledby="navigator-tour-title" aria-describedby="navigator-tour-description" data-testid="navigator-tour">
      <div className="navigator-tour-kicker"><span>{mode === 'offer' ? 'FIRST TIME HERE?' : `BRIEFING · ${step + 1} / ${TOUR_STEPS.length}`}</span><button type="button" onClick={close} aria-label="Skip tour">×</button></div>
      <h2 ref={headingRef} id="navigator-tour-title" tabIndex={-1}>{mode === 'offer' ? 'Mission briefing' : current.title}</h2>
      <p id="navigator-tour-description">{mode === 'offer' ? 'Five quick steps: choose a place, read the heatmaps, move the date, set priorities, and check the evidence. About 30 seconds. You can replay it any time.' : current.text}</p>
      {mode === 'tour' && !rect && <p className="navigator-tour-note">This control is hidden at this window size. You can continue.</p>}
      <div className="navigator-tour-actions">
        <button type="button" className="navigator-tour-secondary" onClick={mode === 'tour' && step > 0 ? () => setStep(s => s - 1) : close}>{mode === 'tour' && step > 0 ? 'Back' : 'Skip'}</button>
        <button type="button" className="navigator-tour-primary" onClick={mode === 'offer' ? start : last ? close : () => setStep(s => s + 1)}>{mode === 'offer' ? 'Start briefing' : last ? 'Start exploring' : 'Next'}</button>
      </div>
      {mode === 'tour' && <div className="navigator-tour-progress" aria-hidden="true">{TOUR_STEPS.map((s, i) => <i key={s.anchor} className={i <= step ? 'is-complete' : ''} />)}</div>}
    </aside>
  </>, document.body);
}
