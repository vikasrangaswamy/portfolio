import { useEffect, useRef } from 'react'
import { useSound } from './sound'

/**
 * Mounted once at the app root. Plays a click sound on any button/link
 * activation and a quieter pop on hover. Skip an element by adding
 * `data-no-sound` to it (or any ancestor).
 *
 * Doing this globally (rather than wiring onClick on every component) keeps
 * sound behavior consistent without code spread across the codebase.
 */
export function GlobalSoundListener() {
  const { play } = useSound()
  const lastHoveredRef = useRef<Element | null>(null)

  useEffect(() => {
    const interactive = 'button, a[href], [role="button"], [data-sound]'

    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest(interactive)
      if (!el) return
      if (el.closest('[data-no-sound]')) return
      // Don't double-fire on disabled buttons.
      if (el instanceof HTMLButtonElement && el.disabled) return
      play('click', 0.7)
    }

    const onPointerOver = (e: PointerEvent) => {
      // Skip non-mouse pointers (touch devices) — hover sounds make no sense there.
      if (e.pointerType !== 'mouse') return
      const el = (e.target as Element | null)?.closest(interactive)
      if (!el || el === lastHoveredRef.current) return
      if (el.closest('[data-no-sound]')) return
      lastHoveredRef.current = el
      play('pop', 0.35)
    }

    const onPointerOut = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const el = (e.target as Element | null)?.closest(interactive)
      if (el && el === lastHoveredRef.current) {
        lastHoveredRef.current = null
      }
    }

    document.addEventListener('click', onClick, true)
    document.addEventListener('pointerover', onPointerOver, true)
    document.addEventListener('pointerout', onPointerOut, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('pointerover', onPointerOver, true)
      document.removeEventListener('pointerout', onPointerOut, true)
    }
  }, [play])

  return null
}
