import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/**
 * Reset scroll on navigation. React Router doesn't do this for us, so following
 * a link from halfway down a long page (a project writeup, say) used to land the
 * next route mid-content.
 *
 * Two deliberate exceptions:
 *  - back/forward (POP): the browser restores the previous offset, which is what
 *    a reader expects when retracing steps.
 *  - `#hash` targets: the anchor scroll wins.
 *
 * Only `pathname` is watched — query-only changes (e.g. the Stats page's
 * `?tab=`) shouldn't yank the reader back to the top of the page.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (navigationType === 'POP' || hash) return
    window.scrollTo({ top: 0, left: 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hash/type are read, not tracked
  }, [pathname])

  return null
}
