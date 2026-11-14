// Messages between pool.ts (main thread) and worker.ts. Everything here must be structured-cloneable.
// `fn` is any export name of web/src/engine/pkg, so this file does not pin the engine's export list.

/** An argument that the worker swaps for a value cached earlier with `set` (ephem table, grid bytes). */
export interface CacheRef { $ref: string }
export const ref = (key: string): CacheRef => ({ $ref: key });
export const isRef = (a: unknown): a is CacheRef =>
  typeof a === 'object' && a !== null && typeof (a as Partial<CacheRef>).$ref === 'string';

export type WorkerRequest =
  | { type: 'init'; module: WebAssembly.Module }
  | { type: 'set'; key: string; value: unknown }
  | { type: 'call'; id: number; fn: string; args: unknown[] };

export type WorkerResponse =
  | { type: 'ready' }
  | { type: 'init-error'; error: string }
  | { type: 'result'; id: number; ok: true; value: unknown }
  | { type: 'result'; id: number; ok: false; error: string };

export const errorText = (e: unknown): string => (e instanceof Error ? e.message : String(e));
