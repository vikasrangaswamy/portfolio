import { CONTEXT, CONTACT } from './context'

export interface Env {
  AI: Ai
  RL: KVNamespace
}

const MODEL = '@cf/meta/llama-3.1-8b-instruct'

const ALLOWED_ORIGINS = new Set([
  'https://vikasrangaswamy.github.io',
  'http://localhost:5173',
  'http://localhost:4173', // vite preview
])

// Rate limits (KV-backed; eventually consistent — fine at portfolio scale).
const PER_IP_PER_MIN = 8
const PER_IP_PER_DAY = 40
const GLOBAL_PER_DAY = 800 // keep well under the free Workers AI daily allowance
const MAX_QUESTION_CHARS = 500
const MAX_TOKENS = 300

const SYSTEM_PROMPT = `You are the assistant on Vikas Rangaswamy's portfolio site. Answer visitors' questions about Vikas using ONLY the context below.

Rules:
- Answer ONLY from the context, and keep it high-level — his skills, technologies, roles, and projects.
- If the answer isn't in the context, or it's a private/specific detail (salary, exact internal specifics, anything not stated), do NOT guess. Say you don't have that here and suggest reaching out to Vikas directly: ${CONTACT.email} or LinkedIn ${CONTACT.linkedin}.
- Be concise: 2–4 sentences, plain text, no markdown headings.
- Refer to Vikas in the third person ("Vikas has…", "He builds…").
- If asked something unrelated to Vikas, politely decline and point to his contact above.
- Never invent facts, dates, employers, or numbers. Be warm and direct, not salesy.

Context:
${CONTEXT}`

function corsHeaders(origin: string | null): Record<string, string> {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://vikasrangaswamy.github.io'
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

function json(body: unknown, status: number, cors: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  })
}

/** Increment a KV counter with a TTL; returns the new count. Not atomic, but
 *  good enough to throttle abuse on a low-traffic site. */
async function bump(kv: KVNamespace, key: string, ttlSeconds: number): Promise<number> {
  const current = Number((await kv.get(key)) ?? '0')
  const next = current + 1
  await kv.put(key, String(next), { expirationTtl: ttlSeconds })
  return next
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin')
    const cors = corsHeaders(origin)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, cors)
    }

    // --- Parse + validate ---
    let question = ''
    try {
      const body = (await request.json()) as { question?: unknown }
      question = typeof body.question === 'string' ? body.question.trim() : ''
    } catch {
      return json({ error: 'Bad request' }, 400, cors)
    }
    if (!question) return json({ error: 'Empty question' }, 400, cors)
    if (question.length > MAX_QUESTION_CHARS) {
      return json({ error: 'Question too long' }, 400, cors)
    }

    // --- Rate limiting ---
    const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown'
    const now = new Date()
    const day = now.toISOString().slice(0, 10)
    const minute = now.toISOString().slice(0, 16)
    try {
      const [perMin, perDay, global] = await Promise.all([
        bump(env.RL, `m:${ip}:${minute}`, 70),
        bump(env.RL, `d:${ip}:${day}`, 86400),
        bump(env.RL, `g:${day}`, 86400),
      ])
      if (perMin > PER_IP_PER_MIN || perDay > PER_IP_PER_DAY) {
        return json({ error: 'rate_limited', message: "You're asking fast — give it a minute." }, 429, cors)
      }
      if (global > GLOBAL_PER_DAY) {
        return json({ error: 'budget', message: 'The assistant is resting for today — explore the site directly in the meantime.' }, 429, cors)
      }
    } catch {
      // If KV hiccups, don't hard-fail the request — just proceed.
    }

    // --- Generate (streamed) ---
    try {
      const stream = (await env.AI.run(MODEL, {
        stream: true,
        max_tokens: MAX_TOKENS,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: question },
        ],
      })) as unknown as ReadableStream

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-store',
          ...cors,
        },
      })
    } catch {
      return json({ error: 'model_error', message: 'The assistant had trouble — try again.' }, 502, cors)
    }
  },
}
