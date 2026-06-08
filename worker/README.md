# ask-vikas — portfolio AI assistant (Cloudflare Worker)

A tiny Cloudflare Worker that powers the "Ask" terminal on the portfolio. It
holds the model call (Workers AI, free tier), stuffs Vikas's portfolio summary
(`src/context.ts`) into the prompt, and streams a grounded answer back. No API
key lives in the website.

## One-time setup

```bash
npm i -g wrangler          # or: npx wrangler ...
wrangler login             # opens the browser; sign in to a FREE Cloudflare account

cd worker
npm install

# Create the rate-limit KV namespace, then paste the printed id into wrangler.toml
wrangler kv namespace create RL

# Deploy
wrangler deploy
```

`wrangler deploy` prints a URL like `https://ask-vikas.<your-subdomain>.workers.dev`.
Copy it into the site at `src/lib/askConfig.ts` (`ASK_ENDPOINT`).

> Do **not** add a payment method to the Cloudflare account. Workers AI then runs
> purely on the free daily allowance — over-limit requests just error (handled
> gracefully), so it can never cost money.

## Local dev

```bash
wrangler dev        # serves on http://localhost:8787
curl -XPOST http://localhost:8787/ask \
  -H 'Content-Type: application/json' \
  -d '{"question":"does he do algorithmic trading?"}'
```

To test the site against local: set `ASK_ENDPOINT` in `src/lib/askConfig.ts` to
`http://localhost:8787` while developing.

## What it does

- `POST /ask` with `{ "question": "..." }` → `text/event-stream` of the answer.
- CORS locked to the GitHub Pages origin + localhost.
- Rate limited per-IP (8/min, 40/day) + a global daily cap, via KV.
- Rejects empty / >500-char questions; `max_tokens` 300.
- Model: `@cf/meta/llama-3.1-8b-instruct` (swap to `@cf/meta/llama-3.2-3b-instruct`
  in `src/index.ts` if you want cheaper/faster).

## Keeping the context fresh

`src/context.ts` is a hand-written summary mirroring `src/content/*` on the site.
When you materially change your experience/projects/skills, update it here too.
