import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import rehypePrettyCode from 'rehype-pretty-code'
import { site, ROUTES } from './src/site.config'
import { profile } from './src/content/profile'

/**
 * Single-source SEO: fills the %SITE_*% placeholders in index.html and
 * generates sitemap.xml + robots.txt into the build output — all from
 * src/site.config.ts, so the domain/title/routes live in exactly one place.
 */
function portfolioSeo(): Plugin {
  const sitemap = () => {
    // Stamp every URL with the build date so crawlers see a real <lastmod>.
    // The site is rebuilt on each content push (Cloudflare Pages), so the build
    // date is an honest "last changed" signal.
    const lastmod = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
    return (
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      ROUTES.map((r) => {
        const loc = r.path === '/' ? `${site.url}/` : `${site.url}${r.path}`
        return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority.toFixed(1)}</priority>\n  </url>`
      }).join('\n') +
      `\n</urlset>\n`
    )
  }

  // Search engines and AI answer engines both welcome — explicit Allow for the
  // major AI crawlers so none are accidentally excluded.
  const robots = () => {
    const agents = [
      '*',
      'GPTBot',
      'OAI-SearchBot',
      'ChatGPT-User',
      'ClaudeBot',
      'Claude-Web',
      'PerplexityBot',
      'Google-Extended',
      'Applebot-Extended',
    ]
    return (
      agents.map((a) => `User-agent: ${a}\nAllow: /`).join('\n\n') +
      `\n\nSitemap: ${site.url}/sitemap.xml\n`
    )
  }

  // llms.txt — a concise, LLM-friendly summary + links (emerging GEO convention).
  const llms = () =>
    `# ${site.name}\n\n> ${site.description}\n\n` +
    `## Site\n` +
    `- Home: ${site.url}/\n` +
    `- About: ${site.url}/about\n` +
    `- Experience: ${site.url}/experience\n` +
    `- Projects: ${site.url}/projects\n` +
    `- Stats (GitHub + LeetCode activity): ${site.url}/stats\n\n` +
    `## Profiles\n` +
    `- GitHub: ${profile.github}\n` +
    `- LinkedIn: ${profile.linkedin}\n`

  // Per-route static HTML. The SPA serves one index.html for every path, so
  // every subpage shipped the HOMEPAGE's canonical/og:url/title in the raw
  // HTML — which made Google treat them all as duplicates of the homepage
  // ("Alternate page with proper canonical tag") and skip indexing them. Here
  // we stamp a copy of the built index.html per route with that route's own
  // canonical/og:url/title/description, written to dist/<path>/index.html.
  // Cloudflare Pages serves the matching static file directly (the SPA
  // `/* -> /index.html` fallback only fires for paths without a real file), so
  // crawlers now get correct per-page signals with zero JavaScript.
  const escAttr = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')

  const prerender = (dir: string) => {
    const template = readFileSync(join(dir, 'index.html'), 'utf8')
    for (const r of ROUTES) {
      if (r.path === '/') continue // the template already IS the home page
      const canonical = `${site.url}${r.path}`
      const title = escAttr(r.title ? `${r.title} · ${site.name}` : site.title)
      const desc = escAttr(r.description ?? site.description)

      const html = template
        .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
        .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${canonical}"`)
        .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${canonical}"`)
        .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${title}"`)
        .replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${title}"`)
        .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${desc}" />`)
        .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/, `<meta property="og:description" content="${desc}" />`)
        .replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${desc}" />`)

      const outDir = join(dir, r.path)
      mkdirSync(outDir, { recursive: true })
      writeFileSync(join(outDir, 'index.html'), html)
    }
  }

  return {
    name: 'portfolio-seo',
    transformIndexHtml(html) {
      const buildDate = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
      return html
        .replaceAll('%SITE_URL%', site.url)
        .replaceAll('%SITE_TITLE%', site.title)
        .replaceAll('%BUILD_DATE%', buildDate)
    },
    writeBundle(options) {
      const dir = options.dir ?? 'dist'
      writeFileSync(join(dir, 'sitemap.xml'), sitemap())
      writeFileSync(join(dir, 'robots.txt'), robots())
      writeFileSync(join(dir, 'llms.txt'), llms())
      prerender(dir)
    },
  }
}

export default defineConfig({
  // Served at the domain root on Cloudflare Pages (and *.pages.dev), so no
  // sub-path base. (Was '/portfolio/' for GitHub Pages project hosting.)
  base: '/',
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        providerImportSource: '@mdx-js/react',
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              // github-dark-dimmed: calm, not garish, reads well over a dark
              // surface — matches the docs feel without fighting the warm
              // earth-tone page palette.
              theme: 'github-dark-dimmed',
              keepBackground: false,
              defaultLang: 'plaintext',
            },
          ],
        ],
      }),
    },
    react({ include: /\.(jsx|js|tsx|ts|mdx)$/ }),
    portfolioSeo(),
  ],
})
