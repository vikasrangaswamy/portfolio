import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { profile } from '../../content/profile'
import styles from './Hero.module.css'

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
          {profile.role} · {profile.company} · {profile.location}
        </div>
        <p className={styles.description}>{profile.tagline}</p>
        <div className={styles.actions}>
          <Link to="/projects" className={styles.btnPrimary}>
            See projects →
          </Link>
          <a href={`mailto:${profile.email}`} className={styles.btnSecondary}>
            Get in touch
          </a>
        </div>
      </div>
    </motion.section>
  )
}
