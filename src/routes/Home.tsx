import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { profile } from '../content/profile'
import { LeetCodeWidget } from '../components/widgets/LeetCodeWidget'
import { GitHubWidget } from '../components/widgets/GitHubWidget'
import { RoleWidget } from '../components/widgets/RoleWidget'
import { NowWidget } from '../components/widgets/NowWidget'
import { RainbowArcCanvas } from '../components/widgets/RainbowArcCanvas'
import widgetStyles from '../components/widgets/Widget.module.css'
import styles from './Home.module.css'

const ctaItems = [
  { to: '/about', label: 'About', desc: 'Bio, location, contact.' },
  { to: '/experience', label: 'Experience', desc: '3 YOE across Contentstack ladder.' },
  { to: '/projects', label: 'Projects', desc: 'Real shipped work, lands soon.' },
  { to: '/learnings', label: 'Learnings', desc: 'System design + LeetCode stats.' },
] as const

const widgets = [
  { Component: LeetCodeWidget, key: 'leetcode' },
  { Component: GitHubWidget, key: 'github' },
  { Component: RoleWidget, key: 'role' },
  { Component: NowWidget, key: 'now' },
]

export default function Home() {
  return (
    <>
      <section className={styles.heroFrame}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
        >
          <RainbowArcCanvas />
        </motion.div>
        <motion.div
          className={styles.heroText}
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
        </motion.div>
      </section>

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

      <section className={styles.section}>
        <motion.h2
          className={styles.ctaTitle}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          Read more
        </motion.h2>
        <ul className={styles.ctaList}>
          {ctaItems.map((item, i) => (
            <motion.li
              key={item.to}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: 'easeOut' }}
            >
              <Link to={item.to} className={styles.ctaLink}>
                <span className={styles.ctaLabel}>{item.label}</span>
                <span className={styles.ctaDesc}>{item.desc}</span>
                <span className={styles.ctaArrow}>→</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </section>
    </>
  )
}
