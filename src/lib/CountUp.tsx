import { useEffect, useRef, useState } from 'react'

/**
 * Animates a number from 0 up to `value` once it becomes non-zero (i.e. when
 * async data lands). Eased, ~900ms. Honors prefers-reduced-motion by jumping
 * straight to the value.
 */
export function CountUp({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setDisplay(value)
      return
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || value === 0) {
      setDisplay(value)
      return
    }

    let startTs: number | null = null
    const from = 0
    const tick = (ts: number) => {
      if (startTs === null) startTs = ts
      const p = Math.min(1, (ts - startTs) / duration)
      const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
      setDisplay(Math.round(from + (value - from) * eased))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value, duration])

  return <>{display.toLocaleString()}</>
}
