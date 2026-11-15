import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { Readable } from 'node:stream';
import { handleAsk } from '../../web/server/ask.ts';
import { deleteScenario, getScenario, listScenarios, saveScenario, type ScenarioRecord } from './scenarios.ts';

/**
 * Minimal scenarios API. No framework: ~60 lines of node:http is enough for
 * four routes, and it keeps the server dependency-free beyond drizzle/postgres.
 *
 *   GET    /api/scenarios          → ScenarioRecord[]
 *   GET    /api/scenarios/:slug    → ScenarioRecord | 404
 *   POST   /api/scenarios          → { name, payload } → ScenarioRecord
 *   DELETE /api/scenarios/:slug    → 204
 *   POST   /api/ask                → { question, context } → { answer }
 *
 * /api/ask shares the protected handler deployed to Vercel.
 * Set ASK_API_KEY, ASK_BASE_URL and ASK_MODEL in server/.env for local use.
 */
const PORT = Number(process.env.PORT ?? 8787);
function send(res: ServerResponse, status: number, body?: unknown) {
  res.writeHead(status, {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type',
  });
  res.end(body === undefined ? undefined : JSON.stringify(body));
}

async function readBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { return null; }
}

function isPayload(value: unknown): value is ScenarioRecord['payload'] {
  if (typeof value !== 'object' || value === null) return false;
  const p = value as Record<string, unknown>;
  return Array.isArray(p.sites) && typeof p.date === 'string' && typeof p.hours === 'number';
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const path = url.pathname;

  if (path === '/api/ask') {
    const headers = new Headers();
    for (const [name, value] of Object.entries(req.headers)) {
      if (value !== undefined) headers.set(name, Array.isArray(value) ? value.join(', ') : value);
    }
    const controller = new AbortController();
    const abort = () => { if (!res.writableEnded) controller.abort(); };
    res.on('close', abort);
    try {
      const request = new Request(`http://${req.headers.host ?? 'localhost:8787'}/api/ask`, {
        method: req.method, headers, signal: controller.signal,
        ...(!['GET', 'HEAD'].includes(req.method ?? 'GET') ? { body: Readable.toWeb(req), duplex: 'half' } : {}),
      } as RequestInit);
      const response = await handleAsk(request);
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(await response.text());
    } catch {
      res.writeHead(500, { 'content-type': 'application/json', 'cache-control': 'no-store' });
      res.end(JSON.stringify({ error: 'Solgaleo is temporarily unavailable.' }));
    } finally {
      res.off('close', abort);
    }
    return;
  }
  if (req.method === 'OPTIONS') return send(res, 204);
  try {
    if (req.method === 'GET' && path === '/api/scenarios') return send(res, 200, await listScenarios());
    if (req.method === 'GET' && path.startsWith('/api/scenarios/')) {
      const record = await getScenario(decodeURIComponent(path.slice('/api/scenarios/'.length)));
      return record ? send(res, 200, record) : send(res, 404, { error: 'not found' });
    }
    if (req.method === 'POST' && path === '/api/scenarios') {
      const body = await readBody(req) as { name?: unknown; payload?: unknown } | null;
      if (!body || typeof body.name !== 'string' || !isPayload(body.payload)) {
        return send(res, 400, { error: 'expected { name: string, payload: { sites, date, hours, ... } }' });
      }
      return send(res, 201, await saveScenario(body.name, body.payload));
    }
    if (req.method === 'DELETE' && path.startsWith('/api/scenarios/')) {
      await deleteScenario(decodeURIComponent(path.slice('/api/scenarios/'.length)));
      return send(res, 204);
    }
    return send(res, 404, { error: 'not found' });
  } catch {
    return send(res, 500, { error: 'internal error' });
  }
});

server.listen(PORT, '127.0.0.1', () => console.log(`scenarios api → http://localhost:${PORT}/api/scenarios`));
