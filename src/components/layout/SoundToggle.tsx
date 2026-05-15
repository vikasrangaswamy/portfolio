import { motion } from 'framer-motion'
import { useSound } from '../../lib/sound'

export function SoundToggle() {
  const { muted, toggleMute } = useSound()

  return (
    <motion.button
      type="button"
      onClick={toggleMute}
      data-no-sound
      aria-label={muted ? 'Enable sounds' : 'Mute sounds'}
      aria-pressed={!muted}
      title={muted ? 'Enable sounds' : 'Mute sounds'}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 360, damping: 16 }}
      style={{
        width: 32,
        height: 32,
        borderRadius: 'var(--r-sm)',
        background: 'transparent',
        border: '1px solid var(--gray-300)',
        color: muted ? 'var(--gray-500)' : 'var(--clay)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
      }}
    >
      {muted ? (
        // Muted speaker glyph
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        // Sound-on speaker glyph
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </motion.button>
  )
}
