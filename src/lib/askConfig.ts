/**
 * Endpoint for the "Ask" assistant — the deployed Cloudflare Worker.
 * After `wrangler deploy`, paste the printed *.workers.dev URL here.
 * Leave empty to disable the assistant gracefully (the UI shows a notice).
 *
 * For local dev against `wrangler dev`, set this to 'http://localhost:8787'.
 */
export const ASK_ENDPOINT = 'https://ask-vikas.vikasrangaswamy.workers.dev/ask'

export const ASK_TERMINAL_EVENT = 'open-ask-terminal'

/**
 * Open the Ask terminal. An optional `question` is seeded and asked immediately
 * (used by the nav bar — type, press Enter, the answer streams in the terminal).
 */
export function openAsk(question?: string) {
  window.dispatchEvent(
    new CustomEvent(ASK_TERMINAL_EVENT, { detail: question ? { question } : undefined }),
  )
}

/** Full questions — used for the self-typing placeholder in the input. */
export const ASK_SUGGESTIONS = [
  'What AI work has Vikas done?',
  'What does he work on these days?',
  "What's his AWS experience?",
] as const

/** Ready-made questions shown as chips in the terminal intro; tapping asks one. */
export const ASK_TOPICS = [
  'What AI & automation has he built?',
  'What did he build at Contentstack?',
  "What's his strongest skill?",
] as const

/** The assistant's opening line — it "speaks first" in the empty terminal. */
export const ASK_GREETING =
  "Hi — I'm Vikas's assistant. I've read his entire portfolio so you don't have to. Ask me anything about him."
