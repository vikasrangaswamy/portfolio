import type { TargetAndTransition } from 'framer-motion'

/**
 * Motion drives entrance animations on its own requestAnimationFrame loop, and
 * a browser throttles rAF to a standstill while a document is hidden. A page
 * opened in a background tab (⌘-click a link) or rendered by a crawler /
 * screenshot service therefore sits at the `initial` keyframe — opacity 0 — with
 * every reveal invisible until the tab is brought forward.
 *
 * `entranceFrom` returns the usual hidden keyframe, or `false` ("start at the
 * animated values") when we're already loading hidden — so the content is simply
 * there, un-animated, rather than blank.
 */
export function entranceFrom(hidden: TargetAndTransition): TargetAndTransition | false {
  if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return false
  return hidden
}
