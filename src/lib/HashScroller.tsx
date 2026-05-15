import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Mount once at the app root. Whenever the URL changes (including hash-only
 * changes), scrolls the matching #element into view. Smooth-scrolling is handled
 * by `html { scroll-behavior: smooth }` in global.css.
 *
 * Without this, navigating from /learnings/leetcode -> /#about would land on
 * the top of the home page rather than the About section.
 */
export function HashScroller() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      return
    }
    const id = hash.slice(1)
    // Defer one tick so the freshly-rendered target exists in the DOM.
    const timeoutId = setTimeout(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
    return () => clearTimeout(timeoutId)
  }, [pathname, hash])

  return null
}
