import { useSyncExternalStore } from 'react';

export type GraphicsMode = 'auto' | 'lite' | 'cinematic';
const KEY = 'lunala-graphics';
let session: GraphicsMode | undefined;
const listeners = new Set<() => void>();
const mode = (): GraphicsMode => {
  if (session) return session;
  try { const value = localStorage.getItem(KEY); return value === 'lite' || value === 'cinematic' ? value : 'auto'; }
  catch { return 'auto'; }
};
const subscribe = (listener: () => void) => {
  listeners.add(listener); window.addEventListener('storage', listener);
  return () => { listeners.delete(listener); window.removeEventListener('storage', listener); };
};
export function lowPowerDevice(hints: { hardwareConcurrency?: number; deviceMemory?: number; connection?: { saveData?: boolean } }) {
  return !!hints.connection?.saveData || (hints.deviceMemory !== undefined && hints.deviceMemory <= 4)
    || (hints.hardwareConcurrency !== undefined && hints.hardwareConcurrency <= 4);
}
export function useGraphics() {
  const value = useSyncExternalStore(subscribe, mode, () => 'auto' as const);
  const lite = value === 'lite' || (value === 'auto' && lowPowerDevice(navigator));
  return { mode: value, lite, continuous: value === 'cinematic', dpr: lite ? 1 : value === 'cinematic' ? 1.5 : 1.25 };
}
export function GraphicsControl() {
  const { mode: value } = useGraphics();
  return <label className="graphics-control">Graphics <select aria-label="Graphics quality" value={value} onChange={event => {
    session = event.target.value as GraphicsMode;
    try { localStorage.setItem(KEY, session); } catch { /* Session setting works without storage. */ }
    listeners.forEach(listener => listener());
  }}><option value="auto">Auto</option><option value="lite">Lite</option><option value="cinematic">Cinematic</option></select></label>;
}
