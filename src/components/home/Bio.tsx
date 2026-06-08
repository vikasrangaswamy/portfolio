import { Link } from 'react-router-dom'
import { profile } from '../../content/profile'
import { Typewriter } from '../../lib/Typewriter'
import styles from './Bio.module.css'

const roleLine = `${profile.role} · ${profile.company} · ${profile.location}`

export function Bio() {
  return (
    <div className={styles.bio}>
      <h1 className={styles.name}>{profile.name}</h1>

      <div className={styles.role}>
        <Typewriter text={roleLine} />
      </div>

      <p className={styles.lead}>
        I build SaaS marketplace apps and enterprise integrations at Contentstack — and
        algorithmic trading bots in Python after hours.
      </p>

      <div className={styles.actions}>
        <Link to="/projects" className="kbd-btn kbd-btn--primary">
          See projects →
        </Link>
        <Link to="/about" className="kbd-btn kbd-btn--secondary">
          About
        </Link>
      </div>

      <div className={styles.links}>
        <a href={profile.github} target="_blank" rel="noreferrer" className={styles.link}>
          GitHub
        </a>
        <span className={styles.sep} aria-hidden="true">
          ·
        </span>
        <a href={profile.linkedin} target="_blank" rel="noreferrer" className={styles.link}>
          LinkedIn
        </a>
        <span className={styles.sep} aria-hidden="true">
          ·
        </span>
        <a href={`mailto:${profile.email}`} className={styles.link}>
          Email
        </a>
      </div>
    </div>
  )
}
