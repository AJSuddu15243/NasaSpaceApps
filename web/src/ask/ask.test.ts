import { afterEach, expect, it, vi } from 'vitest';
import { askLunarAI } from './ask';

afterEach(() => vi.unstubAllGlobals());
it('sends only the question and context and validates the response', async () => {
  const fetcher = vi.fn().mockResolvedValue(Response.json({ answer: 'Sunlight supplies power.' }));
  vi.stubGlobal('fetch', fetcher);
  expect(await askLunarAI('Why?', 'Moon')).toBe('Sunlight supplies power.');
  expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({ question: 'Why?', context: 'Moon' });
  expect(fetcher.mock.calls[0][1].headers).toEqual({ 'content-type': 'application/json' });
  fetcher.mockResolvedValueOnce(Response.json({ answer: {} }));
  await expect(askLunarAI('Why?', 'Moon')).rejects.toThrow('temporarily unavailable');
  fetcher.mockResolvedValueOnce(new Response('<html>SPA fallback</html>'));
  await expect(askLunarAI('Why?', 'Moon')).rejects.toThrow('temporarily unavailable');
});
it('handles service errors, network failures and cancellation', async () => {
  const fetcher = vi.fn().mockResolvedValue(Response.json({ error: 'Please wait.' }, { status: 429 }));
  vi.stubGlobal('fetch', fetcher);
  await expect(askLunarAI('Why?', 'Moon')).rejects.toThrow('Please wait.');
  fetcher.mockRejectedValue(new Error('network'));
  await expect(askLunarAI('Why?', 'Moon')).rejects.toThrow('could not connect');
  const controller = new AbortController(); controller.abort();
  await expect(askLunarAI('Why?', 'Moon', controller.signal)).rejects.toMatchObject({ name: 'AbortError' });
});
