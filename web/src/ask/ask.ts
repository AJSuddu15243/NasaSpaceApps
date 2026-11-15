/**
 * Ask AI — plain-language Q&A about whatever is on the workspace screen.
 * Talks to the same-origin server endpoint; credentials never enter the browser.
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
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(35_000)]) : AbortSignal.timeout(35_000),
    });
  } catch {
    if (signal?.aborted) throw signal.reason;
    throw new AskError('Solgaleo could not connect in time. Please try again.');
  }
  const body = await res.json().catch(() => null) as { answer?: string; error?: string } | null;
  if (!res.ok || typeof body?.answer !== 'string' || !body.answer.trim()) {
    throw new AskError(typeof body?.error === 'string' ? body.error : 'Solgaleo is temporarily unavailable. Please try again.');
  }
  return body.answer;
}
