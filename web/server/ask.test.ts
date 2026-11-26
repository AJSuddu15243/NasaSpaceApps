import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { checkRateLimit } from '@vercel/firewall';
import { handleAsk } from './ask';

vi.mock('@vercel/firewall', () => ({ checkRateLimit: vi.fn() }));
const upstream = vi.fn();
const key = 'test-private-key-never-return';
const origin = 'https://lunala.example';
function request(body: unknown = { question: 'Why sunlight?', context: 'Connecting Ridge' }, headers = {}) {
  return new Request(`${origin}/api/ask`, { method: 'POST',
    headers: { origin, 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });
}
beforeEach(() => {
  vi.stubEnv('VERCEL', '1');
  vi.stubEnv('NODE_ENV', 'production');
  vi.stubEnv('ASK_API_KEY', key);
  vi.stubEnv('ASK_BASE_URL', 'https://provider.example/v1/chat/completions');
  vi.stubEnv('ASK_MODEL', 'test-model');
  vi.stubGlobal('fetch', upstream);
  upstream.mockReset().mockResolvedValue(Response.json({ choices: [{ message: { content: 'Sunlight supplies power.' } }] }));
  vi.mocked(checkRateLimit).mockReset().mockResolvedValue({ rateLimited: false });
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe('Solgaleo server boundary', () => {
  it('keeps credentials in the upstream header and returns only the answer', async () => {
    const response = await handleAsk(request());
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(response.headers.get('access-control-allow-origin')).toBeNull();
    expect(await response.json()).toEqual({ answer: 'Sunlight supplies power.' });
    const [url, init] = upstream.mock.calls[0];
    expect(url.href).toBe('https://provider.example/v1/chat/completions');
    expect(init.headers.authorization).toBe(`Bearer ${key}`);
    expect(init.body).not.toContain(key);
    expect(JSON.parse(init.body).model).toBe('test-model');
    expect(init.redirect).toBe('error');
    expect(init.signal).toBeInstanceOf(AbortSignal);
    expect(checkRateLimit).toHaveBeenCalledExactlyOnceWith('solgaleo-ip', expect.objectContaining({ rateLimitKey: 'all' }));
  });
  it.each([null, [], {}, { question: '' }, { question: 'x'.repeat(2001) },
    { question: 'q', context: {} }, { question: 'q', context: 'x'.repeat(14001) },
    { question: 'q', url: 'https://attacker.example' }, { question: 'q', model: 'expensive' }])('rejects invalid or overridden input: %j', async body => {
    expect((await handleAsk(request(body))).status).toBe(400);
    expect(upstream).not.toHaveBeenCalled();
  });
  it('rejects oversized bodies even without Content-Length', async () => {
    expect((await handleAsk(request({ question: 'x'.repeat(66_000) }))).status).toBe(413);
    expect(upstream).not.toHaveBeenCalled();
  });
  it('rejects malformed JSON, unsupported content types, methods and cross-origin callers', async () => {
    expect((await handleAsk(new Request(`${origin}/api/ask`, { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: '{' }))).status).toBe(400);
    expect((await handleAsk(request(undefined, { 'content-type': 'text/plain' }))).status).toBe(415);
    expect((await handleAsk(new Request(`${origin}/api/ask`))).status).toBe(405);
    expect((await handleAsk(request(undefined, { origin: 'https://attacker.example' }))).status).toBe(403);
    expect((await handleAsk(request(undefined, { 'sec-fetch-site': 'cross-site' }))).status).toBe(403);
    const noOrigin = request(); noOrigin.headers.delete('origin');
    expect((await handleAsk(noOrigin)).status).toBe(403);
    expect(upstream).not.toHaveBeenCalled();
  });
  it.each(['', 'http://provider.example/chat/completions', 'https://user:pass@provider.example/chat/completions',
    'https://provider.example/chat/completions?key=x', 'https://provider.example/v1'])('refuses unsafe or incomplete endpoint configuration: %s', async endpoint => {
    vi.stubEnv('ASK_BASE_URL', endpoint);
    expect((await handleAsk(request())).status).toBe(503);
    expect(upstream).not.toHaveBeenCalled();
  });
  it('requires an explicitly configured key and model', async () => {
    for (const name of ['ASK_API_KEY', 'ASK_MODEL']) {
      vi.stubEnv(name, '');
      expect((await handleAsk(request())).status).toBe(503);
    }
    expect(upstream).not.toHaveBeenCalled();
  });
  it('blocks requests when the shared distributed limit is reached', async () => {
    vi.mocked(checkRateLimit).mockResolvedValueOnce({ rateLimited: true });
    const response = await handleAsk(request());
    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('60');
    expect(upstream).not.toHaveBeenCalled();
  });
  it('fails closed when firewall rules are missing or unavailable', async () => {
    vi.mocked(checkRateLimit).mockResolvedValue({ rateLimited: false, error: 'not-found' });
    expect((await handleAsk(request())).status).toBe(503);
    vi.mocked(checkRateLimit).mockRejectedValue(new Error(key));
    const response = await handleAsk(request());
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain(key);
    expect(upstream).not.toHaveBeenCalled();
  });
  it('never reflects provider errors or thrown exception details', async () => {
    upstream.mockResolvedValueOnce(Response.json({ error: { message: key } }, { status: 401 }));
    let response = await handleAsk(request());
    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain(key);
    upstream.mockRejectedValueOnce(new Error(key));
    response = await handleAsk(request());
    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain(key);
  });
  it('redacts accidental key echoes and handles empty or rate-limited model responses', async () => {
    upstream.mockResolvedValueOnce(Response.json({ choices: [{ message: { content: key } }] }));
    expect(await (await handleAsk(request())).text()).not.toContain(key);
    upstream.mockResolvedValueOnce(Response.json({ choices: [] }));
    expect((await handleAsk(request())).status).toBe(502);
    upstream.mockResolvedValueOnce(new Response('', { status: 429 }));
    expect((await handleAsk(request())).status).toBe(429);
  });
  it('cannot silently skip production limits when the SDK sees a development environment', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    expect((await handleAsk(request())).status).toBe(503);
    expect(checkRateLimit).not.toHaveBeenCalled();
    expect(upstream).not.toHaveBeenCalled();
  });
  it('cannot call the provider when AI is explicitly turned off, even with a configured key', async () => {
    vi.stubEnv('VITE_AI_ENABLED', 'false');
    expect((await handleAsk(request())).status).toBe(503);
    expect(upstream).not.toHaveBeenCalled();
    expect(checkRateLimit).not.toHaveBeenCalled();
  });
  it('only permits unmetered development on loopback URLs', async () => {
    vi.stubEnv('VERCEL', '');
    expect((await handleAsk(request())).status).toBe(503);
    const local = new Request('http://127.0.0.1/api/ask', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ question: 'q' }) });
    expect((await handleAsk(local)).status).toBe(200);
    expect(checkRateLimit).not.toHaveBeenCalled();
  });
});
