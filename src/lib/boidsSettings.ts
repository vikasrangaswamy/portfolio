import { useCallback, useEffect, useState } from 'react'

export type SpeedKey = 'slow' | 'normal' | 'fast'
export type DensityKey = 'few' | 'normal' | 'many'

export const SPEED_OPTIONS: readonly { key: SpeedKey; label: string }[] = [
  { key: 'slow', label: 'Slow' },
  { key: 'normal', label: 'Normal' },
  { key: 'fast', label: 'Fast' },
]

export const DENSITY_OPTIONS: readonly { key: DensityKey; label: string }[] = [
  { key: 'few', label: 'Few' },
  { key: 'normal', label: 'Normal' },
  { key: 'many', label: 'Many' },
]

const SPEED_VALUES: Record<SpeedKey, number> = { slow: 0.5, normal: 1, fast: 2 }
const COUNT_VALUES: Record<DensityKey, number> = { few: 35, normal: 70, many: 140 }

type Settings = { speed: SpeedKey; density: DensityKey }
const DEFAULT: Settings = { speed: 'normal', density: 'normal' }
const STORAGE_KEY = 'boids-settings'
const EVENT_KEY = 'boids-settings-change'

function isSpeed(v: unknown): v is SpeedKey {
  return v === 'slow' || v === 'normal' || v === 'fast'
}
function isDensity(v: unknown): v is DensityKey {
  return v === 'few' || v === 'normal' || v === 'many'
}

function read(): Settings {
  if (typeof window === 'undefined') return DEFAULT
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT
    const parsed = JSON.parse(raw) as Partial<Settings>
    return {
      speed: isSpeed(parsed.speed) ? parsed.speed : DEFAULT.speed,
      density: isDensity(parsed.density) ? parsed.density : DEFAULT.density,
    }
  } catch {
    return DEFAULT
  }
}

function write(settings: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // ignore
  }
}

/**
 * Boids canvas settings. Persists to localStorage and broadcasts changes via
 * a custom event so multiple mounted consumers (Home renders the canvas,
 * BoidsSettings owns the gear popover) stay in sync without lifting state.
 */
export function useBoidsSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT)

  useEffect(() => {
    setSettings(read())
    const onChange = (e: Event) => {
      const next = (e as CustomEvent<Settings>).detail
      if (next && isSpeed(next.speed) && isDensity(next.density)) {
        setSettings(next)
      }
    }
    window.addEventListener(EVENT_KEY, onChange as EventListener)
    return () => window.removeEventListener(EVENT_KEY, onChange as EventListener)
  }, [])

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next: Settings = {
        speed: patch.speed && isSpeed(patch.speed) ? patch.speed : prev.speed,
        density: patch.density && isDensity(patch.density) ? patch.density : prev.density,
      }
      write(next)
      window.dispatchEvent(new CustomEvent<Settings>(EVENT_KEY, { detail: next }))
      return next
    })
  }, [])

  return {
    speed: settings.speed,
    density: settings.density,
    speedValue: SPEED_VALUES[settings.speed],
    count: COUNT_VALUES[settings.density],
    setSpeed: (k: SpeedKey) => update({ speed: k }),
    setDensity: (k: DensityKey) => update({ density: k }),
  }
}
