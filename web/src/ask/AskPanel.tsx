import { useMemo, useRef, useState } from 'react';
import { BookOpen, RotateCcw, Sparkles, X } from 'lucide-react';
import ActionSearchBar, { type CommandItem } from '../components/kokonutui/action-search-bar';
import { askLunarAI, AskError } from './ask';
import { useShell } from '../shell/store';
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
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const queryRef = useRef('');

  const ask = async (text: string) => {
    const q = text.trim();
    if (!q) return;
    setError(''); setAnswer('');
    try {
      setAnswer(await askLunarAI(q, context));
    } catch (e) {
      setError(e instanceof AskError ? e.message : 'The assistant could not answer. Try again.');
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

  return <section className="hud ask-panel" aria-label="Solgaleo assistant">
    <header className="ask-head">
      <span className="ask-title"><Sparkles size={14} /> Solgaleo</span>
      <button type="button" aria-label="Close assistant" onClick={onClose}><X size={15} /></button>
    </header>
    <p className="ask-context">Lunar copilot · knows what is on your screen — sites, date, view and telemetry.</p>
    <ActionSearchBar
      items={items}
      label="Solgaleo"
      placeholder="Ask about the Moon, terrain, sunlight…"
      onQueryChange={q => { queryRef.current = q; setQuery(q); }}
      onSelect={onSelect}
      defaultOpen
    />
    {(answer || error) && <div className="ask-answer" role="status" aria-live="polite">
      {error && <p className="ask-error">{error}</p>}
      {answer && <p className="ask-text">{answer}</p>}
    </div>}
  </section>;
}
