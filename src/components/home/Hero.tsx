import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import { profile } from '../../content/profile'
import styles from './Hero.module.css'

const nameWords = profile.name.split(' ')

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

const word: Variants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { type: 'spring', stiffness: 320, damping: 30 } },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export function Hero() {
  const heroRef = useRef<HTMLElement | null>(null)
  const rafRef = useRef(0)

  // Cursor warm-glow: track the pointer within the hero and write its
  // position to CSS custom properties; the .glow layer reads them. rAF-
  // throttled so we touch the DOM at most once per frame.
  const onMouseMove = (e: React.MouseEvent) => {
    const el = heroRef.current
    if (!el) return
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
      el.style.setProperty('--my', `${e.clientY - rect.top}px`)
      el.style.setProperty('--glow-opacity', '1')
    })
  }

  const onMouseLeave = () => {
    const el = heroRef.current
    if (el) el.style.setProperty('--glow-opacity', '0')
  }

  return (
    <section
      ref={heroRef}
      className={styles.hero}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.content}>
        <motion.h1
          className={styles.title}
          variants={container}
          initial="hidden"
          animate="show"
          aria-label={profile.name}
        >
          {nameWords.map((w) => (
            <span key={w} className={styles.wordMask} aria-hidden="true">
              <motion.span className={styles.word} variants={word}>
                {w}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.div
          className={styles.role}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.35 }}
        >
          {profile.role} · {profile.company} · {profile.location}
        </motion.div>

        <motion.p
          className={styles.description}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.45 }}
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          className={styles.actions}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.55 }}
        >
          <Link to="/projects" className={styles.btnPrimary}>
            See projects →
          </Link>
          <a href={`mailto:${profile.email}`} className={styles.btnSecondary}>
            Get in touch
          </a>
        </motion.div>
      </div>
    </section>
  )
}
