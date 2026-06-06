import { useEffect, useRef, useState } from 'react'
import styles from './Typewriter.module.css'

/**
 * Types `text` out character-by-character with a blinking block cursor, like
 * a terminal. Honors prefers-reduced-motion (renders the full string with a
 * steady cursor, no typing).
 */
export function Typewriter({ text, speed = 45, startDelay = 250 }: { text: string; speed?: number; startDelay?: number }) {
  const [count, setCount] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setCount(text.length)
      return
    }

    setCount(0)
    let i = 0
    const startId = setTimeout(function step() {
      i += 1
      setCount(i)
      if (i < text.length) {
        timer.current = setTimeout(step, speed)
      }
    }, startDelay)

    return () => {
      clearTimeout(startId)
      if (timer.current) clearTimeout(timer.current)
    }
  }, [text, speed, startDelay])

  const done = count >= text.length

  return (
    <span className={styles.wrap}>
      {text.slice(0, count)}
      <span className={`${styles.cursor} ${done ? styles.blink : ''}`} aria-hidden="true" />
    </span>
  )
}
