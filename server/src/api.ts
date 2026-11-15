import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
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
 * /api/ask proxies to GitHub Models (free tier) using GITHUB_TOKEN/GH_TOKEN.
 * Any OpenAI-compatible endpoint works via ASK_BASE_URL/ASK_MODEL overrides.
 */
const PORT = Number(process.env.PORT ?? 8787);
const ASK_URL = process.env.ASK_BASE_URL ?? 'https://models.github.ai/inference/chat/completions';
const ASK_MODEL = process.env.ASK_MODEL ?? 'openai/gpt-4o-mini';
// Any OpenAI-compatible key works: ASK_API_KEY, or GITHUB_TOKEN/GH_TOKEN for GitHub Models.
const ASK_KEY = process.env.ASK_API_KEY ?? process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;

const ASK_SYSTEM = `You are the Lunar Window assistant inside a NASA Space Apps mission-planning tool.
The user is looking at a live workspace: a 3D Moon with candidate Artemis III landing regions near the south pole,
terrain heatmaps, sunlight/Earth-visibility timelines, and mission comparison metrics.
Explain what is on screen and the underlying concepts (solar illumination, horizon masks, Earth line-of-sight,
launch windows, LOLA terrain, JPL ephemeris) in plain language for someone who is not a space engineer.
Be concise (under ~150 words), concrete, and honest: say when something is illustrative or pending real data.
Never invent numbers that are not in the provided context.`;

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
    if (req.method === 'POST' && path === '/api/ask') {
      const body = await readBody(req) as { question?: unknown; context?: unknown } | null;
      if (!body || typeof body.question !== 'string' || !body.question.trim()) {
        return send(res, 400, { error: 'expected { question: string, context?: string }' });
      }
      if (!ASK_KEY) return send(res, 503, { error: 'Ask AI needs a key: set ASK_API_KEY (or GITHUB_TOKEN for GitHub Models).' });
      const upstream = await fetch(ASK_URL, {
        method: 'POST',
        headers: { authorization: `Bearer ${ASK_KEY}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          model: ASK_MODEL,
          max_tokens: 500,
          temperature: 0.3,
          messages: [
            { role: 'system', content: ASK_SYSTEM },
            { role: 'user', content: `What the user is looking at:\n${typeof body.context === 'string' ? body.context : '(no context)'}\n\nQuestion: ${body.question}` },
          ],
        }),
        signal: AbortSignal.timeout(45_000),
      });
      const data = await upstream.json().catch(() => null) as { choices?: { message?: { content?: string } }[]; error?: { message?: string } } | null;
      const answer = data?.choices?.[0]?.message?.content?.trim();
      if (!upstream.ok || !answer) return send(res, 502, { error: data?.error?.message ?? `model request failed (${upstream.status})` });
      return send(res, 200, { answer });
    }
    if (req.method === 'DELETE' && path.startsWith('/api/scenarios/')) {
      await deleteScenario(decodeURIComponent(path.slice('/api/scenarios/'.length)));
      return send(res, 204);
    }
    return send(res, 404, { error: 'not found' });
  } catch (error) {
    return send(res, 500, { error: error instanceof Error ? error.message : 'internal error' });
  }
});

server.listen(PORT, () => console.log(`scenarios api → http://localhost:${PORT}/api/scenarios`));
