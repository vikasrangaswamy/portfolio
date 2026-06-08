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

      <dl className={styles.facts}>
        <div className={styles.fact}>
          <dt className={styles.factLabel}>stack</dt>
          <dd className={styles.factValue}>React · Node.js · TypeScript · Python · AWS</dd>
        </div>
      </dl>

      <div className={styles.actions}>
        <Link to="/projects" className="kbd-btn kbd-btn--primary">
          See projects →
        </Link>
      </div>
    </div>
  )
}
