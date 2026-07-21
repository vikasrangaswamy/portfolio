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

export type SitemapEntry = {
  path: string
  changefreq: string
  priority: number
  /**
   * SEO title segment for this route, combined as "<title> · <site.name>"
   * (matches src/lib/useSeo.ts). Omit for the home page, which uses site.title.
   */
  title?: string
  /** Meta description for this route. Falls back to site.description. */
  description?: string
}

/**
 * Routes for sitemap.xml AND per-route static prerendering. The build (the
 * `portfolio-seo` plugin in vite.config.ts) emits one dist/<path>/index.html
 * per entry with the correct canonical / og:url / title / description baked
 * into the RAW HTML — so crawlers get the right per-page signals without having
 * to render JavaScript. Project detail pages are derived from projectsMeta, so
 * adding a project updates both the sitemap and the prerender automatically.
 */
export const ROUTES: SitemapEntry[] = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  {
    path: '/about',
    changefreq: 'monthly',
    priority: 0.8,
    title: 'About',
    description:
      'About Vikas Rangaswamy — a software engineer at Contentstack in Bangalore working on automation, AI connectors, and agentic systems, plus enterprise integrations and SaaS apps.',
  },
  {
    path: '/experience',
    changefreq: 'monthly',
    priority: 0.8,
    title: 'Experience',
    description:
      "Vikas Rangaswamy's work history — engineering roles at Contentstack building AI connectors, agentic automation, and Shopify↔CMS integrations, with earlier work in 5G and marketplace apps.",
  },
  {
    path: '/projects',
    changefreq: 'monthly',
    priority: 0.9,
    title: 'Projects',
    description:
      'Projects by Vikas Rangaswamy — production algorithmic trading strategies, each with a writeup of the problem, the strategy, the architecture, and the tradeoffs.',
  },
  ...projectsMeta.map((p) => ({
    path: `/projects/${p.slug}`,
    changefreq: 'monthly',
    priority: 0.7,
    title: p.title,
    description: p.summary,
  })),
  {
    path: '/stats',
    changefreq: 'daily',
    priority: 0.7,
    title: 'Stats',
    description:
      'Live coding activity for Vikas Rangaswamy — GitHub contributions and LeetCode practice, synced daily.',
  },
  {
    path: '/colophon',
    changefreq: 'monthly',
    priority: 0.5,
    title: 'Colophon',
    description:
      'How vikasrangaswamy.com works — short writeups on the AI Ask assistant, the daily LeetCode sync, and the GitHub contributions widget.',
  },
  {
    path: '/colophon/ask-assistant',
    changefreq: 'monthly',
    priority: 0.5,
    title: 'Ask assistant',
    description:
      'How the AI Ask assistant on vikasrangaswamy.com works — a Cloudflare Worker that streams grounded answers from a summary of the portfolio.',
  },
  {
    path: '/colophon/leetcode-sync',
    changefreq: 'monthly',
    priority: 0.5,
    title: 'LeetCode sync',
    description:
      'How the LeetCode stats on vikasrangaswamy.com stay current — a daily GitHub Action commits fresh JSON, with no backend at all.',
  },
  {
    path: '/colophon/github-widget',
    changefreq: 'monthly',
    priority: 0.5,
    title: 'GitHub widget',
    description:
      'How the GitHub contributions widget on vikasrangaswamy.com works — a daily server-side sync into committed JSON, read straight from the static build.',
  },
]
