import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { profile } from '../../content/profile'
import { Typewriter } from '../../lib/Typewriter'
import styles from './Hero.module.css'

const roleLine = `${profile.role} · ${profile.company} · ${profile.location}`

export function Hero() {
  return (
    <motion.section
      className={styles.hero}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className={styles.content}>
        <h1 className={styles.title}>{profile.name}</h1>
        <div className={styles.role}>
          <Typewriter text={roleLine} />
        </div>
        <p className={styles.description}>{profile.tagline}</p>
        <div className={styles.actions}>
          <Link to="/projects" className={`${styles.btn} ${styles.btnPrimary}`}>
            See projects →
          </Link>
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className={`${styles.btn} ${styles.btnSecondary}`}
            >
              Get in touch
            </a>
          )}
        </div>
      </div>
    </motion.section>
  )
}
