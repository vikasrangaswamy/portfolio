import { useEffect } from 'react'

/**
 * Per-route document title + meta description for this SPA. React Router swaps
 * pages without a full document load, so the static <title>/description in
 * index.html would otherwise stick for the whole session. Each page calls this
 * to keep the tab title, search snippet, and share-card text accurate.
 *
 * Pass nothing for the home page to restore the site defaults.
 */
const SITE = 'Vikas Rangaswamy'
const DEFAULT_TITLE = 'Vikas Rangaswamy — Software Engineer at Contentstack'
const DEFAULT_DESCRIPTION =
  'Vikas Rangaswamy — software engineer at Contentstack in Bangalore, building automation, AI connectors, and agentic systems, plus enterprise integrations and SaaS marketplace apps.'

function setMeta(selector: string, content: string) {
  const el = document.head.querySelector<HTMLMetaElement>(selector)
  if (el) el.setAttribute('content', content)
}

export function useSeo(title?: string, description?: string) {
  useEffect(() => {
    const fullTitle = title ? `${title} · ${SITE}` : DEFAULT_TITLE
    const desc = description?.trim() || DEFAULT_DESCRIPTION
    document.title = fullTitle
    setMeta('meta[name="description"]', desc)
    setMeta('meta[property="og:title"]', fullTitle)
    setMeta('meta[property="og:description"]', desc)
    setMeta('meta[name="twitter:title"]', fullTitle)
    setMeta('meta[name="twitter:description"]', desc)
  }, [title, description])
}
