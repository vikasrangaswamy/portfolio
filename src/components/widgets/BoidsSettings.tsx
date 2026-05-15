import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  DENSITY_OPTIONS,
  SPEED_OPTIONS,
  useBoidsSettings,
} from '../../lib/boidsSettings'
import styles from './BoidsSettings.module.css'

export function BoidsSettings() {
  const { speed, density, setSpeed, setDensity } = useBoidsSettings()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  // Close on outside click + Escape.
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={styles.wrap} ref={wrapperRef}>
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-no-sound
        aria-label="Animation settings"
        aria-expanded={open}
        title="Animation settings"
        className={styles.trigger}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 360, damping: 16 }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.popover}
            role="dialog"
            aria-label="Animation settings"
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <div className={styles.row}>
              <span className={styles.label}>Speed</span>
              <div className={styles.segGroup} role="radiogroup" aria-label="Speed">
                {SPEED_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    role="radio"
                    aria-checked={speed === opt.key}
                    data-no-sound
                    onClick={() => setSpeed(opt.key)}
                    className={
                      speed === opt.key
                        ? `${styles.seg} ${styles.segActive}`
                        : styles.seg
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>Boids</span>
              <div className={styles.segGroup} role="radiogroup" aria-label="Number of boids">
                {DENSITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    role="radio"
                    aria-checked={density === opt.key}
                    data-no-sound
                    onClick={() => setDensity(opt.key)}
                    className={
                      density === opt.key
                        ? `${styles.seg} ${styles.segActive}`
                        : styles.seg
                    }
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
