import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { profile } from '../content/profile'
import { LeetCodeWidget } from '../components/widgets/LeetCodeWidget'
import { GitHubWidget } from '../components/widgets/GitHubWidget'
import { RoleWidget } from '../components/widgets/RoleWidget'
import { NowWidget } from '../components/widgets/NowWidget'
import widgetStyles from '../components/widgets/Widget.module.css'
import styles from './Home.module.css'

const widgets = [
  { Component: LeetCodeWidget, key: 'leetcode' },
  { Component: GitHubWidget, key: 'github' },
  { Component: RoleWidget, key: 'role' },
  { Component: NowWidget, key: 'now' },
]

export default function Home() {
  return (
    <>
      <motion.section
        className={styles.hero}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className={styles.heroTag}>Portfolio</div>
        <h1 className={styles.heroTitle}>{profile.name}</h1>
        <div className={styles.heroRole}>
          {profile.role} · {profile.company} · {profile.location}
        </div>
        <p className={styles.heroDescription}>{profile.tagline}</p>
        <div className={styles.heroActions}>
          <Link to="/projects" className={styles.btnPrimary}>
            See projects →
          </Link>
        </div>
      </motion.section>

      <section className={styles.section}>
        <motion.div
          className={widgetStyles.rowHeader}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        >
          <span className={widgetStyles.rowKicker}>
            <span className={widgetStyles.rowKickerDot} />
            Live
          </span>
          <span className={widgetStyles.rowHint}>updates as I work</span>
        </motion.div>
        <div className={widgetStyles.row}>
          {widgets.map(({ Component, key }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 + i * 0.07, ease: 'easeOut' }}
              whileHover={{ y: -3 }}
            >
              <Component />
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}
