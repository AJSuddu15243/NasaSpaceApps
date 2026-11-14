import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { createPool, poolSize, type WorkerLike } from './pool';
import { ref, type WorkerRequest, type WorkerResponse } from './protocol';
import { createHandler } from './worker';

const wasmModule = new WebAssembly.Module(readFileSync(new URL('./pkg/lunar_engine_bg.wasm', import.meta.url)));

/** Runs the real worker handler (real WASM instance) behind an async message boundary. */
class HandlerWorker implements WorkerLike {
  onmessage: ((e: MessageEvent<WorkerResponse>) => void) | null = null;
  onerror: ((e: ErrorEvent) => void) | null = null;
  private handle = createHandler((m) => queueMicrotask(() => this.onmessage?.({ data: m } as MessageEvent<WorkerResponse>)));
  postMessage(msg: WorkerRequest) { queueMicrotask(() => this.handle(msg)); }
  terminate() {}
}

/** Replies to init (unless silent) and holds every call until the test answers it. */
class ManualWorker implements WorkerLike {
  onmessage: ((e: MessageEvent<WorkerResponse>) => void) | null = null;
  onerror: ((e: ErrorEvent) => void) | null = null;
  sent: WorkerRequest[] = [];
  terminated = false;
  constructor(private initReply: WorkerResponse | null = { type: 'ready' }) {}
  postMessage(msg: WorkerRequest) {
    this.sent.push(msg);
    const reply = this.initReply;
    if (msg.type === 'init' && reply) queueMicrotask(() => this.emit(reply));
  }
  calls() { return this.sent.flatMap((m) => (m.type === 'call' ? [m] : [])); }
  answer(id: number, value: unknown) { this.emit({ type: 'result', id, ok: true, value }); }
  emit(m: WorkerResponse) { this.onmessage?.({ data: m } as MessageEvent<WorkerResponse>); }
  terminate() { this.terminated = true; }
}

const manualPool = async (n: number) => {
  const workers: ManualWorker[] = [];
  const pool = await createPool({ module: wasmModule, size: n, makeWorker: () => { const w = new ManualWorker(); workers.push(w); return w; } });
  return { pool, workers };
};

describe('engine pool', () => {
  it('sizes to hardwareConcurrency - 1, clamped to 1..4', () => {
    expect([1, 2, 3, 16, 0, Number.NaN].map((h) => poolSize(h))).toEqual([1, 1, 2, 4, 1, 1]);
  });

  it('round-trips through real WASM workers, with inputs cached on every worker', async () => {
    const pool = await createPool({ module: wasmModule, size: 2, makeWorker: () => new HandlerWorker() });
    const bytes = new Uint8Array([1, 2, 3, 250]);
    pool.set('bytes', bytes);
    const direct = await pool.call<string>('output_hash', [bytes]);
    expect(direct).toMatch(/^[0-9a-f]{16}$/);
    // Two concurrent calls land on two different workers, so both caches were filled by the broadcast.
    const viaRef = await Promise.all([pool.call('output_hash', [ref('bytes')]), pool.call('output_hash', [ref('bytes')])]);
    expect(viaRef).toEqual([direct, direct]);
    pool.terminate();
  });

  it('turns worker-side errors into rejections', async () => {
    const pool = await createPool({ module: wasmModule, size: 1, makeWorker: () => new HandlerWorker() });
    await expect(pool.call('no_such_export', [])).rejects.toThrow('unknown engine function');
    await expect(pool.call('initSync', [])).rejects.toThrow('unknown engine function');
    await expect(pool.call('output_hash', [ref('missing')])).rejects.toThrow('no cached input: missing');
    pool.terminate();
  });

  it('dispatches to the least-busy worker', async () => {
    const { pool, workers } = await manualPool(3);
    const first = [pool.call('f', [0]), pool.call('f', [1]), pool.call('f', [2])];
    expect(workers.map((w) => w.calls().length)).toEqual([1, 1, 1]);
    workers[1].answer(workers[1].calls()[0].id, 'b');
    await expect(first[1]).resolves.toBe('b');
    first.push(pool.call('f', [3]));
    expect(workers.map((w) => w.calls().length)).toEqual([1, 2, 1]);
    pool.terminate();
    await Promise.allSettled(first);
  });

  it('drops a stale generation (latest wins) even if it finishes last', async () => {
    const { pool, workers } = await manualPool(2);
    const old = pool.latest('grid', 'grid_scores', ['old']);
    const fresh = pool.latest('grid', 'grid_scores', ['new']);
    const [a, b] = [workers[0].calls()[0], workers[1].calls()[0]];
    workers[1].answer(b.id, 'new result');
    workers[0].answer(a.id, 'old result');
    await expect(fresh).resolves.toBe('new result');
    await expect(old).resolves.toBeNull();
    pool.terminate();
  });

  it('rejects and terminates when workers miss the startup timeout or fail init', async () => {
    const silent: ManualWorker[] = [];
    await expect(createPool({ module: wasmModule, size: 2, startupTimeoutMs: 20, makeWorker: () => { const w = new ManualWorker(null); silent.push(w); return w; } }))
      .rejects.toThrow('not ready after 20 ms');
    expect(silent.every((w) => w.terminated)).toBe(true);
    await expect(createPool({ module: wasmModule, size: 1, makeWorker: () => new ManualWorker({ type: 'init-error', error: 'bad module' }) }))
      .rejects.toThrow('bad module');
  });

  it('terminate rejects in-flight and later calls', async () => {
    const { pool, workers } = await manualPool(1);
    const inflight = pool.call('f', []);
    pool.terminate();
    await expect(inflight).rejects.toThrow('terminated');
    await expect(pool.call('f', [])).rejects.toThrow('terminated');
    expect(workers[0].terminated).toBe(true);
  });
});
