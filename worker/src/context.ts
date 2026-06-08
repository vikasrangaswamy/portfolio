/**
 * The grounding context for the assistant — a concise prose summary of the
 * portfolio. The model is instructed to answer ONLY from this.
 *
 * Keep it in sync with the site content (src/content/*). It's small on
 * purpose (~1.5k tokens) so the whole thing fits in every prompt — no
 * retrieval needed. Regenerate by hand when the portfolio content changes.
 */
export const CONTEXT = `
# About Vikas Rangaswamy

Vikas Rangaswamy is a Software Engineer at Contentstack, based in Bangalore, India.
Full-stack engineer building SaaS marketplace apps and enterprise integrations.
Core stack: React, Node.js, TypeScript, Python, AWS.

In his words: He builds marketplace apps and integrations that connect a headless
CMS (Contentstack) to the rest of the SaaS world — translation platforms,
e-commerce, automation tooling. Most of his work sits at the seam between product
UX and infrastructure: a React surface a content author actually wants to use,
backed by serverless APIs, webhook plumbing, encrypted credentials, and the
reliability work that keeps integrations from breaking. Outside work he writes
algorithmic trading bots in Python for MetaTrader 5 and studies system design.

Links: GitHub github.com/vikasrangaswamy, LinkedIn linkedin.com/in/vikasrangaswamy.
Currently building: MT5 algorithmic trading EAs in Python.

# Experience

## Software Engineer I — Contentstack (Mar 2025 – Present), Bangalore
- Sole developer of the Marketplace XTM App connecting Contentstack with XTM Cloud
  for translation management — adopted by 20+ enterprise clients.
- Built the full stack: React UI, Node.js API, Contentstack + XTM Cloud
  integrations, and AWS infrastructure.
- Designed a serverless API with encrypted credentials, async callback handling,
  and rate limiting to keep translations reliable under bursty load.
- Tech: React, Node.js, TypeScript, AWS Lambda, KMS, Contentstack, XTM Cloud.

## Associate Software Engineer — Contentstack (Jul 2023 – Mar 2025), Bangalore
- Owned key features of the Shopify ↔ Contentstack integration app, syncing CMS
  content into Shopify metafields and metaobjects on Remix.
- Built the Contentstack OAuth flow, merchant-facing connect/sync UI in Shopify
  Polaris, and the webhook handling layer.
- Implemented the initial bulk sync pipeline and MongoDB session storage.
- Tech: Remix, React, Node.js, MongoDB, Shopify Polaris, OAuth 2.0, Webhooks.

## Associate Software Engineer Intern — Contentstack (Jan 2023 – Jul 2023), Bangalore
- Built a Custom Reference Field Marketplace app from scratch, letting content
  authors attach and manage reference entries directly inside Contentstack entries.
- Tech: React, TypeScript, Contentstack Marketplace SDK.

## Project Associate — IIT Madras 5G Testbed (Jul 2022 – Sep 2022), Chennai
- Led software integration for custom User Equipment using a Telit FN980 cellular
  modem with Raspberry Pi.
- Implemented PCIe communication and AT-command control for modem interactions in
  a 5G environment.
- Tech: Python, C, Linux, PCIe, AT commands.

# Skills
- Languages: JavaScript, TypeScript, Python, Java, C
- Frontend: React, Remix, Shopify Polaris
- Backend & APIs: Node.js, Express, MongoDB, REST, GraphQL, Webhooks, OAuth 2.0
- Cloud & AWS: Lambda, KMS, Batch, EFS, S3
- Platforms & Integrations: Contentstack, Shopify (embedded apps, Admin GraphQL), MetaTrader 5
- AI & Automation: Contentstack Automate, n8n
- Tools: Git, GitHub, Jira, Chrome DevTools

# Projects (algorithmic trading — Python, MetaTrader 5)
Yes, Vikas does algorithmic trading. He has built three MT5 Expert Advisors in Python:
- Bidirectional Grid Hedge: an ATR-spaced grid of pending hedge orders that profits
  on movement in either direction, with auto-close when net P/L crosses one grid value.
  Tech: Python, algorithmic trading, risk management, hedging.
- High/Low Breakout Scalper: pending breakout stops at recent swing highs and lows,
  gated by an ADX trend filter, trailed and unwound on session boundaries.
  Tech: Python, algorithmic trading, risk management, trend following.
- Impulse Candle Scalper: detects ATR-relative impulse candles after the close and
  rides the continuation with a pending-stop-or-market fallback.
  Tech: Python, algorithmic trading, risk management, momentum.

# Learning notes on the site
- System Design studies: URL Shortener (caching, ID encoding, read/write skew),
  AWS Batch (Fargate jobs), AWS Lambda (when serverless fits).
- Colophon ("how this site works"): the live LeetCode stats sync (GitHub Actions
  cron + GraphQL) and the client-fetched GitHub stats widget.
- LeetCode: he keeps a daily problem-solving habit; the site shows a live
  submission heatmap and streak synced from his LeetCode profile.
`.trim()
