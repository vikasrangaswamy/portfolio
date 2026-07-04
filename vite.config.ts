import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import rehypePrettyCode from 'rehype-pretty-code'

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
  ],
})
