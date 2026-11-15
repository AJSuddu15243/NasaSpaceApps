import { useEffect, useId, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { BookOpen, GripHorizontal, RotateCcw, Sparkles, X } from 'lucide-react';
import ActionSearchBar, { type CommandItem } from '../components/kokonutui/action-search-bar';
import { askLunarAI, AskError } from './ask';
import { useShell } from '../shell/store';
import { usePanelDrag } from './usePanelDrag';
import './ask.css';

const SUGGESTIONS = [
  'What am I looking at right now?',
  'Why does sunlight matter for a landing site?',
  'What is a horizon mask?',
  'How does moving the date change the answer?',
] as const;

/**
 * Floating "Ask AI" card. `context` is a plain-text snapshot of the screen the user is looking at.
 * The input is the Kokonut UI action-search-bar command palette: suggestion rows, a live
 * "Ask AI: <typed>" row, and workspace actions — answers render below it.
 */
export function AskPanel({ context, onClose, onReplay }: { context: string; onClose: () => void; onReplay?: () => void }) {
  const { navigate } = useShell();
  const { panelRef, style, handleProps } = usePanelDrag();
  const moveHelp = useId();
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const queryRef = useRef('');
  const activeRequest = useRef<AbortController | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => () => activeRequest.current?.abort(), []);

  const ask = async (text: string) => {
    const q = text.trim();
    if (!q) return;
    if (q.length > 2000) { setError('Keep your question under 2,000 characters.'); return; }
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setLoading(true);
    setError(''); setAnswer('');
    try {
      const result = await askLunarAI(q, context, controller.signal);
      if (!controller.signal.aborted) setAnswer(result);
    } catch (e) {
      if (!controller.signal.aborted) setError(e instanceof AskError ? e.message : 'The assistant could not answer. Try again.');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  };

  const items = useMemo<CommandItem[]>(() => {
    const list: CommandItem[] = SUGGESTIONS.map((s, i) => ({
      id: `q-${i}`, label: s, icon: <Sparkles className="size-4" />, group: 'Questions', keywords: ['ask', 'ai', 'explain'],
    }));
    const typed = query.trim();
    if (typed && !SUGGESTIONS.includes(typed as (typeof SUGGESTIONS)[number])) {
      list.push({ id: 'ask-anything', label: `Ask AI: “${typed}”`, icon: <Sparkles className="size-4" />, group: 'Ask AI', keywords: ['question', 'assistant'] });
    }
    list.push(
      { id: 'docs', label: 'Open documentation', icon: <BookOpen className="size-4" />, group: 'Actions', keywords: ['docs', 'guide', 'help'] },
      ...(onReplay ? [{ id: 'replay', label: 'Replay mission briefing', icon: <RotateCcw className="size-4" />, group: 'Actions', keywords: ['tour', 'intro'] } as CommandItem] : []),
    );
    return list;
  }, [query, onReplay]);

  const onSelect = (item: CommandItem) => {
    if (item.id === 'docs') { navigate('/docs'); return; }
    if (item.id === 'replay') { onReplay?.(); return; }
    if (item.id === 'ask-anything') return ask(queryRef.current);
    return ask(item.label);
  };

  return <section ref={panelRef} style={style} className="hud ask-panel" aria-label="Solgaleo assistant">
    <header className="ask-head">
      <button type="button" className="ask-drag-handle" aria-label="Move Solgaleo assistant" aria-describedby={moveHelp} {...handleProps}>
        <span className="ask-title"><Sparkles size={14} /> Solgaleo</span><GripHorizontal size={16} aria-hidden="true" />
      </button>
      <button type="button" aria-label="Close assistant" onClick={onClose}><X size={15} /></button>
    </header>
    <span id={moveHelp} className="sr-only">Drag to move. Use arrow keys to reposition, Shift for larger steps, or Home to reset.</span>
    <p className="ask-context">Lunar copilot · knows what is on your screen — sites, date, view and telemetry.</p>
    <ActionSearchBar
      items={items}
      label="Solgaleo"
      placeholder="Ask about the Moon, terrain, sunlight…"
      onQueryChange={q => { queryRef.current = q; setQuery(q); }}
      onSelect={onSelect}
      defaultOpen
    />
    {(loading || answer || error) && <div className="ask-answer" role="status" aria-live="polite" aria-busy={loading}>
      {loading && <p>Solgaleo is checking your workspace…</p>}
      {error && <p className="ask-error">{error}</p>}
      {answer && <div className="ask-text"><ReactMarkdown skipHtml disallowedElements={['img', 'a']} unwrapDisallowed>{answer}</ReactMarkdown></div>}
    </div>}
  </section>;
}
