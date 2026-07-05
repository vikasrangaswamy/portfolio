import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import rehypePrettyCode from 'rehype-pretty-code'
import { site, ROUTES } from './src/site.config'

/**
 * Single-source SEO: fills the %SITE_*% placeholders in index.html and
 * generates sitemap.xml + robots.txt into the build output — all from
 * src/site.config.ts, so the domain/title/routes live in exactly one place.
 */
function portfolioSeo(): Plugin {
  const sitemap = () =>
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    ROUTES.map((r) => {
      const loc = r.path === '/' ? `${site.url}/` : `${site.url}${r.path}`
      return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority.toFixed(1)}</priority>\n  </url>`
    }).join('\n') +
    `\n</urlset>\n`

  const robots = () => `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`

  return {
    name: 'portfolio-seo',
    transformIndexHtml(html) {
      return html.replaceAll('%SITE_URL%', site.url).replaceAll('%SITE_TITLE%', site.title)
    },
    writeBundle(options) {
      const dir = options.dir ?? 'dist'
      writeFileSync(join(dir, 'sitemap.xml'), sitemap())
      writeFileSync(join(dir, 'robots.txt'), robots())
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
