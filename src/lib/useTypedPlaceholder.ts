import { useEffect, useState } from 'react'

/**
 * Cycles a typed-out string through `phrases` terminal-style: type a phrase,
 * hold, delete it, move to the next. Pauses while `active` is false (e.g. the
 * input is focused or busy) and honors prefers-reduced-motion by holding the
 * first phrase. Returns the current partial string — feed it to a placeholder.
 */
export function useTypedPlaceholder(phrases: readonly string[], active: boolean) {
  const [text, setText] = useState(phrases[0] ?? '')

  useEffect(() => {
    if (!active || phrases.length === 0) return
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setText(phrases[0])
      return
    }

    let phrase = 0
    let char = phrases[0].length
    let deleting = true
    let id: ReturnType<typeof setTimeout>

    const tick = () => {
      const current = phrases[phrase]
      if (deleting) {
        char -= 1
        setText(current.slice(0, char))
        if (char <= 0) {
          deleting = false
          phrase = (phrase + 1) % phrases.length
          id = setTimeout(tick, 320)
          return
        }
        id = setTimeout(tick, 26)
      } else {
        char += 1
        setText(current.slice(0, char))
        if (char >= current.length) {
          deleting = true
          id = setTimeout(tick, 1900) // hold the full phrase
          return
        }
        id = setTimeout(tick, 52)
      }
    }

    id = setTimeout(tick, 1200)
    return () => clearTimeout(id)
  }, [phrases, active])

  return text
}
