// Web Worker pool over the Rust/WASM engine (ENG-9). Compiles the .wasm once here and posts the Module to each worker.
import wasmUrl from './pkg/lunar_engine_bg.wasm?url';
import type { WorkerRequest, WorkerResponse } from './protocol';

export interface WorkerLike {
  postMessage(msg: WorkerRequest, transfer?: Transferable[]): void;
  onmessage: ((e: MessageEvent<WorkerResponse>) => void) | null;
  onerror: ((e: ErrorEvent) => void) | null;
  terminate(): void;
}

export interface PoolOptions {
  module?: WebAssembly.Module;
  size?: number;
  makeWorker?: () => WorkerLike;
  startupTimeoutMs?: number;
}

export interface EnginePool {
  readonly size: number;
  /** Run `fn` (a pkg export name) on the least-busy worker. Args may hold `ref(key)` for inputs cached with `set`. */
  call<T = unknown>(fn: string, args: unknown[], transfer?: Transferable[]): Promise<T>;
  /** Latest-wins: resolves null (never rejects) if a newer request on the same channel started meanwhile. */
  latest<T = unknown>(channel: string, fn: string, args: unknown[]): Promise<T | null>;
  /** Broadcast an input to every worker's cache; calls posted after this see it (per-worker message order). */
  set(key: string, value: unknown): void;
  terminate(): void;
}

/** hardwareConcurrency - 1, clamped to 1..4 (ENG-9). */
export const poolSize = (hwc: number | undefined = globalThis.navigator?.hardwareConcurrency): number =>
  Math.min(4, Math.max(1, (hwc || 2) - 1));

export const compileEngine = (): Promise<WebAssembly.Module> => WebAssembly.compileStreaming(fetch(wasmUrl));

const browserWorker = (): WorkerLike => new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });

interface Slot { worker: WorkerLike; busy: number }
interface Pending { slot: Slot; resolve: (v: unknown) => void; reject: (e: Error) => void }

export async function createPool(opts: PoolOptions = {}): Promise<EnginePool> {
  const module = opts.module ?? (await compileEngine());
  const make = opts.makeWorker ?? browserWorker;
  const slots: Slot[] = Array.from({ length: opts.size ?? poolSize() }, () => ({ worker: make(), busy: 0 }));
  const pending = new Map<number, Pending>();
  const gens = new Map<string, number>();
  let nextId = 0;
  let dead = false;

  const take = (id: number): Pending | undefined => {
    const p = pending.get(id);
    if (p) { pending.delete(id); p.slot.busy--; }
    return p;
  };
  const failAll = (slot: Slot | null, err: Error) => {
    for (const [id, p] of [...pending]) if (!slot || p.slot === slot) take(id)?.reject(err);
  };
  const terminate = () => {
    dead = true;
    for (const s of slots) s.worker.terminate();
    failAll(null, new Error('engine pool terminated'));
  };

  const ready = Promise.all(slots.map((slot) => new Promise<void>((resolve, reject) => {
    slot.worker.onmessage = ({ data: m }) => {
      if (m.type === 'ready') resolve();
      else if (m.type === 'init-error') reject(new Error(`engine worker init failed: ${m.error}`));
      else {
        const p = take(m.id);
        if (p && m.ok) p.resolve(m.value);
        else if (p && !m.ok) p.reject(new Error(m.error));
      }
    };
    slot.worker.onerror = (e) => {
      const err = new Error(`engine worker error: ${e.message}`);
      reject(err);
      failAll(slot, err);
    };
    slot.worker.postMessage({ type: 'init', module });
  })));

  const ms = opts.startupTimeoutMs ?? 15_000;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`engine workers not ready after ${ms} ms`)), ms);
  });
  try {
    await Promise.race([ready, timeout]);
  } catch (e) {
    terminate();
    throw e;
  } finally {
    clearTimeout(timer);
  }

  const call = <T>(fn: string, args: unknown[], transfer: Transferable[] = []): Promise<T> =>
    new Promise<T>((resolve, reject) => {
      if (dead) return reject(new Error('engine pool terminated'));
      const slot = slots.reduce((best, s) => (s.busy < best.busy ? s : best));
      const id = nextId++;
      slot.busy++;
      pending.set(id, { slot, resolve: resolve as (v: unknown) => void, reject });
      try {
        slot.worker.postMessage({ type: 'call', id, fn, args }, transfer);
      } catch (e) {
        take(id);
        reject(e instanceof Error ? e : new Error(String(e)));
      }
    });

  return {
    size: slots.length,
    call,
    latest<T>(channel: string, fn: string, args: unknown[]) {
      const gen = (gens.get(channel) ?? 0) + 1;
      gens.set(channel, gen);
      const current = () => gens.get(channel) === gen;
      return call<T>(fn, args).then(
        (v) => (current() ? v : null),
        (e: unknown) => { if (current()) throw e; return null; },
      );
    },
    set(key, value) {
      if (dead) throw new Error('engine pool terminated');
      for (const s of slots) s.worker.postMessage({ type: 'set', key, value });
    },
    terminate,
  };
}
