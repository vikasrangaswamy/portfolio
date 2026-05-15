import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { profile } from '../content/profile'
import { useSound } from '../lib/sound'
import styles from './Home.module.css'

const learningTracks = [
  {
    icon: '🏗️',
    subtitle: 'System Design',
    title: 'AWS Batch, Lambda, URL Shortener',
    desc: 'Hands-on infrastructure studies — queueing, serverless, and scaling a URL shortener with Redis.',
    href: '/learnings/system-design',
  },
  {
    icon: '💡',
    subtitle: 'LeetCode',
    title: 'Live problem stats',
    desc: 'Daily practice. Stats and submission heatmap synced from leetcode.com.',
    href: '/learnings/leetcode',
  },
] as const

export default function Home() {
  const { play } = useSound()

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
          {profile.role} · {profile.company}
        </div>
        <p className={styles.heroDescription}>{profile.tagline}</p>
        <div className={styles.heroActions}>
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link to="/projects" className={styles.btnPrimary} onClick={() => play('pop', 0.7)}>
              See projects →
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
            <a
              href={profile.resumeUrl}
              className={styles.btnSecondary}
              target="_blank"
              rel="noreferrer"
              onClick={() => play('click', 0.6)}
            >
              Resume
            </a>
          </motion.div>
        </div>
      </motion.section>

      <div className={styles.divider}>
        <div className={styles.dividerLine} />
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Currently learning</h2>
          <Link to="/learnings" className={styles.sectionLink}>
            All learnings →
          </Link>
        </div>
        <div className={styles.cardsGrid}>
          {learningTracks.map((track, i) => (
            <motion.div
              key={track.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
              whileHover={{ y: -4 }}
            >
              <Link to={track.href} className={styles.card} onClick={() => play('pop', 0.6)}>
                <span className={styles.cardIcon}>{track.icon}</span>
                <div className={styles.cardSubtitle}>{track.subtitle}</div>
                <div className={styles.cardTitle}>{track.title}</div>
                <p className={styles.cardDesc}>{track.desc}</p>
                <div className={styles.cardArrow}>→</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Projects</h2>
          <Link to="/projects" className={styles.sectionLink}>
            View all →
          </Link>
        </div>
        <div className={styles.placeholderBanner}>
          Project writeups coming soon — including an MT5 algorithmic trading suite I've been
          building in Python.
        </div>
      </section>
    </>
  )
}
