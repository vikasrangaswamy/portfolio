import { useEffect } from 'react'
import { useSound } from './sound'

/**
 * Mounted once at the app root. Plays a click sound on any button/link
 * activation when sounds are enabled. Skip an element by adding
 * `data-no-sound` to it (or any ancestor).
 *
 * Doing this globally (rather than wiring onClick on every component) keeps
 * sound behavior consistent without code spread across the codebase.
 */
export function GlobalSoundListener() {
  const { play } = useSound()

  useEffect(() => {
    const interactive = 'button, a[href], [role="button"], [data-sound]'

    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest(interactive)
      if (!el) return
      if (el.closest('[data-no-sound]')) return
      if (el instanceof HTMLButtonElement && el.disabled) return
      play('click', 0.7)
    }

    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
    }
  }, [play])

  return null
}
