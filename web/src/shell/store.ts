import { useSyncExternalStore } from 'react';
import { readScenario, writeScenario, type Scenario } from './scenario';
import { getScenario } from '../scenarios/store';
export interface ShellSnapshot { scenario: Scenario; warnings: string[]; path: string }
export interface BrowserPort {
  location: Pick<Location, 'search' | 'pathname' | 'hash'>;
  history: Pick<History, 'pushState' | 'replaceState'>;
  addEventListener(type: 'popstate', listener: () => void): void;
  removeEventListener(type: 'popstate', listener: () => void): void;
}
export function createShellStore(browser: BrowserPort) {
  const read = (): ShellSnapshot => {
    let search = browser.location.search;
    const warnings: string[] = [];
    // `/app?scenario=<slug>` hydrates a saved scenario; explicit params override it.
    const slug = new URLSearchParams(search).get('scenario');
    if (slug) {
      const stored = getScenario(slug);
      if (stored) {
        const merged = new URLSearchParams(writeScenario(stored.scenario).slice(1));
        new URLSearchParams(search).forEach((value, key) => { if (key !== 'scenario' && key !== 'v') merged.set(key, value); });
        search = `?${merged.toString()}`;
      } else warnings.push(`Saved scenario "${slug}" was not found on this device.`);
    }
    const parsed = readScenario(search);
    return { scenario: parsed.scenario, warnings: [...parsed.warnings, ...warnings], path: browser.location.pathname };
  };
  let snapshot = read();
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach(listener => listener());
  // Safari throws after ~100 replaceState calls in 10 s (Firefox ~200), so slider drags coalesce URL writes.
  const REPLACE_MS = 250;
  let pending: ReturnType<typeof setTimeout> | undefined;
  const cancelPending = () => { clearTimeout(pending); pending = undefined; };
  const url = () => `${snapshot.path}${writeScenario(snapshot.scenario)}${browser.location.hash}`;
  const publish = () => { cancelPending(); snapshot = read(); notify(); };
  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) {
      if (listeners.size === 0) { browser.addEventListener('popstate', publish); snapshot = read(); }
      listeners.add(listener);
      return () => { listeners.delete(listener); if (!listeners.size) browser.removeEventListener('popstate', publish); };
    },
    set(patch: Partial<Scenario>, replace = false) {
      const next = readScenario(writeScenario({ ...snapshot.scenario, ...patch })).scenario;
      if (writeScenario(next) === writeScenario(snapshot.scenario)) return;
      snapshot = { ...snapshot, scenario: next, warnings: [] };
      if (replace) pending ??= setTimeout(() => { pending = undefined; browser.history.replaceState(null, '', url()); }, REPLACE_MS);
      else { cancelPending(); browser.history.pushState(null, '', url()); }
      notify();
    },
    navigate(path: '/' | '/app' | '/docs') {
      cancelPending();
      browser.history.pushState(null, '', `${path}${writeScenario(snapshot.scenario)}`);
      publish();
    },
  };
}
let currentStore: ReturnType<typeof createShellStore> | undefined;
export function shellStore() { return currentStore ??= createShellStore(window); }
export function useShell() {
  const store = shellStore();
  return { ...useSyncExternalStore(store.subscribe, store.getSnapshot), setScenario: store.set, navigate: store.navigate };
}
