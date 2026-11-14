import { create } from 'zustand';
import { parseScenario, serializeScenario, type Mode, type ScenarioState, type Weights } from './url.ts';

interface AppState extends ScenarioState {
  setSiteIds: (siteIds: string[]) => void;
  setDateIso: (dateIso: string) => void;
  setWindowHours: (windowHours: number) => void;
  setWeights: (weights: Weights) => void;
  setMode: (mode: Mode) => void;
  hydrateFromUrl: () => void;
}

const fallbackDate = new Date().toISOString();
const initial = parseScenario(typeof window === 'undefined' ? '' : window.location.search, fallbackDate);
export const useAppStore = create<AppState>(set => ({
  ...initial,
  setSiteIds: siteIds => set({ siteIds: [...new Set(siteIds)].slice(0, 4) }),
  setDateIso: dateIso => set({ dateIso }),
  setWindowHours: windowHours => set({ windowHours }),
  setWeights: weights => set({ weights }),
  setMode: mode => set({ mode }),
  hydrateFromUrl: () => set(parseScenario(window.location.search, fallbackDate)),
}));

if (typeof window !== 'undefined') {
  let last = serializeScenario(initial);
  useAppStore.subscribe(state => {
    const next = serializeScenario(state);
    if (next === last) return;
    last = next;
    window.history.replaceState(null, '', `${window.location.pathname}?${next}${window.location.hash}`);
  });
  window.addEventListener('popstate', () => {
    const next = parseScenario(window.location.search, fallbackDate);
    last = serializeScenario(next);
    useAppStore.getState().hydrateFromUrl();
  });
}
