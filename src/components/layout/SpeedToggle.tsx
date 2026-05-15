import { motion } from 'framer-motion'
import { useSpeed } from '../../lib/speed'

export function SpeedToggle() {
  const { label, cycle, speed } = useSpeed()

  return (
    <motion.button
      type="button"
      onClick={cycle}
      data-no-sound
      aria-label={`Animation speed: ${speed}. Click to cycle.`}
      title="Animation speed (slow / normal / fast)"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 360, damping: 16 }}
      style={{
        minWidth: 38,
        height: 32,
        padding: '0 8px',
        borderRadius: 'var(--r-sm)',
        background: 'transparent',
        border: '1px solid var(--gray-300)',
        color: speed === 'normal' ? 'var(--gray-500)' : 'var(--clay)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 500,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {label}
    </motion.button>
  )
}
