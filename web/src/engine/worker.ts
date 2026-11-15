// Module worker: one WASM instance per worker (SPEC guardrail 6), instantiated from a Module compiled once on the main thread.
import * as engine from './pkg/lunar_engine.js';
import { errorText, isRef, type WorkerRequest, type WorkerResponse } from './protocol';

type Fn = (...args: unknown[]) => unknown;
const NOT_CALLABLE = new Set(['default', 'initSync']);

/** Message handler, exported so tests can drive it without a real Worker. */
export function createHandler(post: (msg: WorkerResponse) => void): (msg: WorkerRequest) => void {
  let ready = false;
  const cache = new Map<string, unknown>();
  const exports = engine as unknown as Record<string, unknown>;
  return (msg) => {
    if (msg.type === 'init') {
      try {
        engine.initSync({ module: msg.module });
        ready = true;
        post({ type: 'ready' });
      } catch (e) {
        post({ type: 'init-error', error: errorText(e) });
      }
      return;
    }
    if (msg.type === 'set') {
      cache.set(msg.key, msg.value);
      return;
    }
    try {
      if (!ready) throw new Error('engine worker not initialised');
      const fn = exports[msg.fn];
      if (NOT_CALLABLE.has(msg.fn) || typeof fn !== 'function') throw new Error(`unknown engine function: ${msg.fn}`);
      const args = msg.args.map((a) => {
        if (!isRef(a)) return a;
        if (!cache.has(a.$ref)) throw new Error(`no cached input: ${a.$ref}`);
        return cache.get(a.$ref);
      });
      // shortcut: a Rust panic traps and may leave this instance unusable; re-instantiate on trap if panics show up in practice.
      post({ type: 'result', id: msg.id, ok: true, value: (fn as Fn)(...args) });
    } catch (e) {
      post({ type: 'result', id: msg.id, ok: false, error: errorText(e) });
    }
  };
}

interface Scope { onmessage: ((e: MessageEvent<WorkerRequest>) => void) | null; postMessage(msg: WorkerResponse): void }
if ('WorkerGlobalScope' in globalThis) {
  const scope = globalThis as unknown as Scope;
  const handle = createHandler((msg) => scope.postMessage(msg));
  scope.onmessage = (e) => handle(e.data);
}
