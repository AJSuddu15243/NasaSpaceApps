/**
 * Ask AI — plain-language Q&A about whatever is on the workspace screen.
 * Talks to the local scenarios API (server/src/api.ts → GitHub Models free tier).
 * When the API is not running the caller gets a readable error, never a crash.
 */

const API = (import.meta.env.VITE_API_URL as string | undefined) ?? '';

export class AskError extends Error {}

export async function askLunarAI(question: string, context: string, signal?: AbortSignal): Promise<string> {
  let res: Response;
  try {
    res = await fetch(`${API}/api/ask`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ question, context }),
      signal,
    });
  } catch {
    throw new AskError('The assistant is offline. Start the API with `cd server && pnpm api` (needs GITHUB_TOKEN).');
  }
  const body = await res.json().catch(() => null) as { answer?: string; error?: string } | null;
  if (!res.ok || !body?.answer) throw new AskError(body?.error ?? `Assistant error (${res.status}).`);
  return body.answer;
}
