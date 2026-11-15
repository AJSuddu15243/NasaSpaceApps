import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { awaitNavigatorEntry } from '../shell/preload';

function pending() {
  let resolve!: () => void;
  const promise = new Promise<void>(done => { resolve = done; });
  return { promise, resolve };
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('navigator entrance failure contracts', () => {
  it('does not enter when the camera finishes before the route is ready', async () => {
    const ready = pending();
    const entered = vi.fn();
    const result = awaitNavigatorEntry(ready.promise, new AbortController().signal, 1250).then(entered);
    await vi.advanceTimersByTimeAsync(2000);
    expect(entered).not.toHaveBeenCalled();
    ready.resolve();
    await result;
    expect(entered).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not navigate after cancellation even if the old download completes', async () => {
    const ready = pending();
    const controller = new AbortController();
    const result = awaitNavigatorEntry(ready.promise, controller.signal, 1250);
    const rejected = expect(result).rejects.toMatchObject({ name: 'AbortError' });
    controller.abort();
    await rejected;
    ready.resolve();
    await vi.runAllTimersAsync();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('releases a stalled download instead of trapping the user in an entrance', async () => {
    const result = awaitNavigatorEntry(new Promise(() => {}), new AbortController().signal, 1250);
    const rejected = expect(result).rejects.toThrow('taking longer');
    await vi.advanceTimersByTimeAsync(15_000);
    await rejected;
    expect(vi.getTimerCount()).toBe(0);
  });
});

// Gap tests: a broken implementation could satisfy the attacks above while cutting
// off successful motion or swallowing a real download failure.
describe('entrance gaps', () => {
  it('does not cut the flight short when modules load instantly', async () => {
    const entered = vi.fn();
    const result = awaitNavigatorEntry(Promise.resolve(), new AbortController().signal, 1250).then(entered);
    await vi.advanceTimersByTimeAsync(1249);
    expect(entered).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    await result;
    expect(entered).toHaveBeenCalledOnce();
  });

  it('surfaces a download failure immediately and clears the motion timer', async () => {
    await expect(awaitNavigatorEntry(Promise.reject(new Error('offline')), new AbortController().signal, 1250)).rejects.toThrow('offline');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('supports reduced motion without skipping readiness', async () => {
    const ready = pending();
    const entered = vi.fn();
    const result = awaitNavigatorEntry(ready.promise, new AbortController().signal, 0).then(entered);
    await vi.advanceTimersByTimeAsync(0);
    expect(entered).not.toHaveBeenCalled();
    ready.resolve();
    await result;
    expect(entered).toHaveBeenCalledOnce();
  });

  it('rejects a signal already aborted before entry starts', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(awaitNavigatorEntry(Promise.resolve(), controller.signal, 0)).rejects.toMatchObject({ name: 'AbortError' });
    expect(vi.getTimerCount()).toBe(0);
  });
});
