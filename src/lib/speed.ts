import { useCallback, useEffect, useState } from 'react'

export type SpeedKey = 'slow' | 'normal' | 'fast'

const STEPS: readonly SpeedKey[] = ['slow', 'normal', 'fast'] as const
const VALUES: Record<SpeedKey, number> = {
  slow: 0.5,
  normal: 1,
  fast: 2,
}
const LABEL: Record<SpeedKey, string> = {
  slow: '0.5×',
  normal: '1×',
  fast: '2×',
}
const STORAGE_KEY = 'boids-speed'
const EVENT_KEY = 'boids-speed-change'

function read(): SpeedKey {
  if (typeof window === 'undefined') return 'normal'
  try {
    const v = localStorage.getItem(STORAGE_KEY) as SpeedKey | null
    if (v && STEPS.includes(v)) return v
  } catch {
    // ignore
  }
  return 'normal'
}

function write(v: SpeedKey) {
  try {
    localStorage.setItem(STORAGE_KEY, v)
  } catch {
    // ignore
  }
}

/**
 * Animation-speed preference. Cycle through slow → normal → fast.
 * Persists in localStorage and broadcasts changes within the tab so multiple
 * mounted instances (toggle in header, canvas in main) stay in sync.
 */
export function useSpeed() {
  const [speed, setSpeed] = useState<SpeedKey>('normal')

  useEffect(() => {
    setSpeed(read())
    const onChange = (e: Event) => {
      const next = (e as CustomEvent<SpeedKey>).detail
      if (STEPS.includes(next)) setSpeed(next)
    }
    window.addEventListener(EVENT_KEY, onChange as EventListener)
    return () => window.removeEventListener(EVENT_KEY, onChange as EventListener)
  }, [])

  const cycle = useCallback(() => {
    setSpeed((prev) => {
      const next = STEPS[(STEPS.indexOf(prev) + 1) % STEPS.length] ?? 'normal'
      write(next)
      window.dispatchEvent(new CustomEvent<SpeedKey>(EVENT_KEY, { detail: next }))
      return next
    })
  }, [])

  return {
    speed,
    value: VALUES[speed],
    label: LABEL[speed],
    cycle,
  }
}
