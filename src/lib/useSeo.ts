import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { site } from '../site.config'

/**
 * Per-route document title + meta description + canonical URL for this SPA.
 * React Router swaps pages without a full document load, so the static
 * <title>/description/canonical in index.html would otherwise stick for the
 * whole session — leaving every subpage claiming (via canonical + og:url) to be
 * the homepage, which tells search engines they're duplicates. Each page calls
 * this to keep the tab title, search snippet, share-card text, AND the
 * canonical/og:url accurate for the current route.
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

function setCanonical(url: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', url)
}

/** Add or remove a <meta name="robots" content="noindex"> tag. */
function setNoindex(on: boolean) {
  const existing = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')
  if (on) {
    if (existing) existing.setAttribute('content', 'noindex')
    else {
      const el = document.createElement('meta')
      el.setAttribute('name', 'robots')
      el.setAttribute('content', 'noindex')
      document.head.appendChild(el)
    }
  } else if (existing) {
    existing.remove()
  }
}

export function useSeo(title?: string, description?: string, noindex = false) {
  const { pathname } = useLocation()

  useEffect(() => {
    const fullTitle = title ? `${title} · ${SITE}` : DEFAULT_TITLE
    const desc = description?.trim() || DEFAULT_DESCRIPTION

    // Canonical/og:url for THIS route. Normalize trailing slashes (except root)
    // so /about and /about/ don't split into two canonicals. Always built from
    // the production origin in site.config, never the current host, so preview
    // deploys (*.pages.dev) still point canonical at the real domain.
    const path = pathname.replace(/\/+$/, '') || '/'
    const canonical = path === '/' ? `${site.url}/` : `${site.url}${path}`

    document.title = fullTitle
    setMeta('meta[name="description"]', desc)
    setMeta('meta[property="og:title"]', fullTitle)
    setMeta('meta[property="og:description"]', desc)
    setMeta('meta[name="twitter:title"]', fullTitle)
    setMeta('meta[name="twitter:description"]', desc)
    setMeta('meta[property="og:url"]', canonical)
    setCanonical(canonical)
    // The 404 route is a soft-404 (SPA always returns HTTP 200), so tell
    // crawlers not to index arbitrary junk URLs. Cleared when leaving the route.
    setNoindex(noindex)
    return () => setNoindex(false)
  }, [title, description, pathname, noindex])
}
