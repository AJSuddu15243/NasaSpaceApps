import { useSyncExternalStore } from 'react';
import { readScenario, writeScenario, type Scenario } from './scenario';
export interface ShellSnapshot { scenario: Scenario; warnings: string[]; path: string }
export interface BrowserPort {
  location: Pick<Location, 'search' | 'pathname' | 'hash'>;
  history: Pick<History, 'pushState' | 'replaceState'>;
  addEventListener(type: 'popstate', listener: () => void): void;
  removeEventListener(type: 'popstate', listener: () => void): void;
}
export function createShellStore(browser: BrowserPort) {
  const read = (): ShellSnapshot => ({ ...readScenario(browser.location.search), path: browser.location.pathname });
  let snapshot = read();
  const listeners = new Set<() => void>();
  const publish = () => { snapshot = read(); listeners.forEach(listener => listener()); };
  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) {
      if (listeners.size === 0) { browser.addEventListener('popstate', publish); snapshot = read(); }
      listeners.add(listener);
      return () => { listeners.delete(listener); if (!listeners.size) browser.removeEventListener('popstate', publish); };
    },
    set(patch: Partial<Scenario>, replace = false) {
      const next = readScenario(writeScenario({ ...snapshot.scenario, ...patch })).scenario;
      const search = writeScenario(next);
      if (search === browser.location.search) return;
      browser.history[replace ? 'replaceState' : 'pushState'](null, '', `${snapshot.path}${search}${browser.location.hash}`);
      publish();
    },
    navigate(path: '/' | '/app' | '/docs') {
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
