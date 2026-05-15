import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { profile } from '../content/profile'
import { experience } from '../content/experience'
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

function yearsSince(yyyymm: string): number {
  const [y, m] = yyyymm.split('-').map(Number)
  if (!y || !m) return 0
  const start = new Date(y, m - 1, 1).getTime()
  return Math.max(0, (Date.now() - start) / (1000 * 60 * 60 * 24 * 365.25))
}

export default function Home() {
  const [leetSolved, setLeetSolved] = useState<number | null>(null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/leetcode.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setLeetSolved(d?.totals?.All ?? null))
      .catch(() => setLeetSolved(null))
  }, [])

  const firstStart = experience[experience.length - 1]?.start ?? '2023-01'
  const years = Math.round(yearsSince(firstStart) * 10) / 10

  const stats = [
    { value: `${years.toFixed(1)}+`, label: 'years building' },
    { value: '20+', label: 'enterprise clients on XTM' },
    { value: leetSolved !== null ? `${leetSolved}` : '—', label: 'LeetCode solved' },
  ]

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
          <Link to="/projects" className={styles.btnPrimary}>
            See projects →
          </Link>
          <a href={profile.resumeUrl} className={styles.btnSecondary} target="_blank" rel="noreferrer">
            Resume
          </a>
        </div>

        <motion.div
          className={styles.statsStrip}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        >
          {stats.map((s) => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </motion.div>
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
              <Link to={track.href} className={styles.card}>
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
    </>
  )
}
