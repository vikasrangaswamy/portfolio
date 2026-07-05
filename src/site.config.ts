import { projectsMeta } from './content/projects/meta'

/**
 * Single source of truth for site-wide / deployment constants.
 *
 * Change the domain, title, or description HERE and it propagates everywhere:
 *  - index.html meta (canonical, Open Graph, Twitter, JSON-LD) — injected at
 *    build via the `portfolio-seo` plugin in vite.config.ts (placeholders
 *    %SITE_URL% / %SITE_TITLE%).
 *  - sitemap.xml + robots.txt — generated into the build output from ROUTES.
 *  - Per-route <title>/description in the SPA — src/lib/useSeo.ts imports this.
 *
 * NOTE: the Worker's CORS allow-list (worker/src/index.ts) is a separate
 * package and can't import this; update it by hand when the domain changes.
 */
export const site = {
  url: 'https://vikasrangaswamy.com', // no trailing slash
  name: 'Vikas Rangaswamy',
  title: 'Vikas Rangaswamy — Software Engineer at Contentstack',
  description:
    'Vikas Rangaswamy — software engineer at Contentstack in Bangalore, building automation, AI connectors, and agentic systems, plus enterprise integrations and SaaS marketplace apps.',
  ogImage: '/og-image.png',
} as const

export type SitemapEntry = { path: string; changefreq: string; priority: number }

/**
 * Routes for sitemap.xml. Project detail pages are derived from projectsMeta,
 * so adding a project updates the sitemap automatically. Add other new pages
 * here by hand.
 */
export const ROUTES: SitemapEntry[] = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/about', changefreq: 'monthly', priority: 0.8 },
  { path: '/experience', changefreq: 'monthly', priority: 0.8 },
  { path: '/projects', changefreq: 'monthly', priority: 0.9 },
  ...projectsMeta.map((p) => ({
    path: `/projects/${p.slug}`,
    changefreq: 'monthly',
    priority: 0.7,
  })),
  { path: '/stats', changefreq: 'daily', priority: 0.7 },
  { path: '/colophon', changefreq: 'monthly', priority: 0.5 },
  { path: '/colophon/ask-assistant', changefreq: 'monthly', priority: 0.5 },
  { path: '/colophon/leetcode-sync', changefreq: 'monthly', priority: 0.5 },
  { path: '/colophon/github-widget', changefreq: 'monthly', priority: 0.5 },
]
