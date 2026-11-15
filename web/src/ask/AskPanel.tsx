import { useRef, useState } from 'react';
import { SendHorizonal, Sparkles, X } from 'lucide-react';
import { askLunarAI, AskError } from './ask';
import './ask.css';

const SUGGESTIONS = [
  'What am I looking at right now?',
  'Why does sunlight matter for a landing site?',
  'What is a horizon mask?',
  'How does moving the date change the answer?',
] as const;

/** Floating "Ask AI" card. `context` is a plain-text snapshot of the screen the user is looking at. */
export function AskPanel({ context, onClose }: { context: string; onClose: () => void }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const abort = useRef<AbortController | null>(null);

  const ask = async (text: string) => {
    const q = text.trim();
    if (!q || busy) return;
    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;
    setBusy(true); setError(''); setAnswer('');
    try {
      setAnswer(await askLunarAI(q, context, controller.signal));
    } catch (e) {
      if (!controller.signal.aborted) setError(e instanceof AskError ? e.message : 'The assistant could not answer. Try again.');
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  };

  return <section className="hud ask-panel" aria-label="Ask AI">
    <header className="ask-head">
      <span className="ask-title"><Sparkles size={14} /> Ask AI</span>
      <button type="button" aria-label="Close assistant" onClick={onClose}><X size={15} /></button>
    </header>
    <p className="ask-context">Knows what is on your screen — sites, date, view and telemetry.</p>
    {!answer && !busy && <div className="ask-chips">
      {SUGGESTIONS.map(s => <button type="button" key={s} onClick={() => { setQuestion(s); void ask(s); }}>{s}</button>)}
    </div>}
    <form className="ask-form" onSubmit={e => { e.preventDefault(); void ask(question); }}>
      <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask about the Moon, terrain, sunlight…" aria-label="Ask a question" disabled={busy} />
      <button type="submit" aria-label="Send question" disabled={busy || !question.trim()}><SendHorizonal size={15} /></button>
    </form>
    {(busy || answer || error) && <div className="ask-answer" role="status" aria-live="polite">
      {busy && <p className="ask-thinking">Thinking…</p>}
      {error && <p className="ask-error">{error}</p>}
      {answer && <p className="ask-text">{answer}</p>}
    </div>}
  </section>;
}
