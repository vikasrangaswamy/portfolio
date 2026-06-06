import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../lib/useTheme'
import { useSound } from '../../lib/sound'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const { play } = useSound()

  const handleClick = () => {
    play('boop')
    toggle()
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      data-no-sound
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      data-tip={`${theme === 'light' ? 'Dark' : 'Light'} mode`}
      data-tip-below
      whileHover={{ scale: 1.08, rotate: -6 }}
      whileTap={{ scale: 0.92, rotate: 12 }}
      transition={{ type: 'spring', stiffness: 360, damping: 16 }}
      style={{
        width: 32,
        height: 32,
        borderRadius: 'var(--r-sm)',
        background: 'transparent',
        border: '1px solid var(--gray-300)',
        color: 'var(--gray-700)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: -12, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 12, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{ display: 'inline-block' }}
        >
          {theme === 'light' ? '☾' : '☀'}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
