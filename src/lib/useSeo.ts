import { useEffect } from 'react'
import { site } from '../site.config'

/**
 * Per-route document title + meta description for this SPA. React Router swaps
 * pages without a full document load, so the static <title>/description in
 * index.html would otherwise stick for the whole session. Each page calls this
 * to keep the tab title, search snippet, and share-card text accurate.
 *
 * Pass nothing for the home page to restore the site defaults.
 */
const SITE = site.name
const DEFAULT_TITLE = site.title
const DEFAULT_DESCRIPTION = site.description

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
