# CLAUDE.md

Guidance for AI agents (and humans) working in this repo. Read this first.

## What this is

Personal portfolio for Vikas Rangaswamy. Vite + React 19 + TypeScript, MDX
content, CSS Modules (warm earth-tone design system, light/dark). Hosted on
**Cloudflare Pages** (auto-builds on push to `main`). A tiny Cloudflare Worker
in `worker/` powers the "Ask" assistant.

## Commands

```bash
npm run dev         # local dev
npm run typecheck   # tsc -b --noEmit — run this before finishing any change
npm run build       # production build → dist/
```

Always run `npm run typecheck` after edits. (Note: the committed `node_modules`
may hold a platform-specific native build binary; if `npm run build` fails on a
binding error, that's an environment mismatch, not your change — typecheck is
the reliable signal.)

## Cross-cutting concerns — "change one place, update these too"

This is the important part. Several facts are intentionally centralized; when
you touch one of these, update the linked spots in the SAME change.

### Site URL / name / title / description / routes
- **Source of truth: `src/site.config.ts`.** Change the domain, name, title,
  description, or add/remove pages HERE.
- It automatically propagates to: `index.html` meta (via the `portfolio-seo`
  plugin in `vite.config.ts`, which fills `%SITE_URL%` / `%SITE_TITLE%`),
  `sitemap.xml` + `robots.txt` (generated into the build from `ROUTES`), and
  per-route titles (`src/lib/useSeo.ts` imports `site`).
- **Not auto-linked (update by hand):** the Worker CORS allow-list in
  `worker/src/index.ts` (`ALLOWED_ORIGINS` + the `corsHeaders` default) — it's
  a separate package and can't import `site.config`. After changing it, the
  Worker must be redeployed: `cd worker && wrangler deploy`.
- Adding a **new route/page** → add it to `ROUTES` in `src/site.config.ts`
  (project detail pages are auto-derived from `projectsMeta`), add the `<Route>`
  in `src/App.tsx`, and add it to the nav in `src/components/layout/Header.tsx`
  if it should appear there.

### Home widgets ↔ Stats page ↔ colophon
- The four home tiles live in `src/components/widgets/`. The two data tiles
  (`GitHubWidget`, `LeetCodeWidget`) both read committed JSON from
  `public/data/*.json` and link to `/stats?tab=…`.
- A widget's `WidgetInfoLink slug="…"` MUST match a `slug` in
  `src/content/colophon/index.ts`. If you change a widget's behavior, update its
  colophon writeup (`src/content/colophon/<slug>.mdx`) so the "how it works"
  page stays accurate.

### Stats data pipeline
- `scripts/fetch-leetcode-stats.mjs` → `public/data/leetcode.json`
- `scripts/fetch-github-contributions.mjs` → `public/data/github.json`
- Both run daily via `.github/workflows/leetcode-sync.yml` ("Sync stats"), which
  commits the JSON; Cloudflare Pages auto-builds on that push.
- If you change a JSON's **shape**, update all readers: the fetch script, the
  matching widget (`src/components/widgets/`), `src/routes/Stats.tsx`, and the
  shared helpers in `src/lib/activity.ts`.

### Diagrams
- All architecture diagrams use `<FlowDiagram>` (`src/components/diagrams/`) fed
  by a `*.flow.ts` spec next to each `*.mdx`. Behavior/animation changes there
  apply to every diagram (projects, system-design, colophon).

## Conventions

- Colors/spacing/typography come from CSS variables in `src/styles/tokens.css`
  (light + dark). Don't hardcode hex values in components — use the tokens.
- Content lives in `src/content/` (typed `.ts` + `.mdx`), separate from
  components. `profile.ts` holds identity/social links.
- Grep for `@sync` before finishing — it marks spots that must be kept in step
  with another file when the two can't share code directly.

## Hosting notes (Cloudflare Pages)

- SPA routing: `public/_redirects` (`/* /index.html 200`). Response headers:
  `public/_headers`.
- `base` is `/` (root domain). It was `/portfolio/` on the old GitHub Pages
  host — don't reintroduce a sub-path base.
