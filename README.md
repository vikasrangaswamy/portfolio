# Portfolio

Personal portfolio of **Vikas Rangaswamy** — software engineer at Contentstack.

Live at **[vikasrangaswamy.com](https://vikasrangaswamy.com/)**.

## Stack

Vite + React 19 + TypeScript · MDX content authoring · Mermaid for architecture diagrams · CSS Modules with a warm earth-tone design system · Cloudflare Pages for hosting.

## Develop

```bash
npm install
npm run dev          # http://localhost:5173/
npm run typecheck    # tsc -b --noEmit
npm run build        # production build → dist/
npm run preview      # serve dist/ locally
```

## Structure

```
src/
├── routes/                 page components (Home, About, Experience, Projects, learning tracks)
├── components/             layout (Header/Footer/PageShell), ui, learnings
├── content/                authored content
│   ├── profile.ts          name, role, links
│   ├── experience.ts       work history (typed)
│   ├── skills.ts           skill chips
│   └── learnings/
│       ├── system-design/  3 MDX topics + manifest
│       ├── frontend/       1 MDX topic + manifest
│       ├── dsa/            13 MDX topics + manifest
│       └── leetcode/       16-category manifest + 8 solved-problem writeups
├── lib/                    Mermaid renderer, MDX components, useTheme
└── styles/                 tokens.css (light/dark), reset.css, global.css
```

## Related repos

- [system-design-experiments](https://github.com/vikasrangaswamy/system-design-experiments) — runnable code for the system-design learning track
- [frontend-experiments](https://github.com/vikasrangaswamy/frontend-experiments) — runnable code for the frontend learning track

## Deploy

Hosted on **Cloudflare Pages**, connected to this repo. A push to `main` triggers a Cloudflare build (`npm run build`, output `dist/`) and publishes automatically — including the daily bot commits from the "Sync stats" workflow that refresh `public/data/*.json`.
