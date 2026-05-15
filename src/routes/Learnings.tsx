import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/layout/PageHeader'
import pageStyles from './Page.module.css'
import styles from './Learnings.module.css'

const tracks = [
  {
    slug: 'system-design',
    title: 'System Design',
    desc: 'Hands-on infrastructure studies — AWS Batch, Lambda, and a URL shortener at scale.',
  },
  {
    slug: 'leetcode',
    title: 'LeetCode',
    desc: 'Daily problem practice. Live stats and submission heatmap, synced from leetcode.com.',
  },
] as const

export default function Learnings() {
  return (
    <div className={pageStyles.container}>
      <PageHeader
        tag="Learnings"
        title="What I'm studying"
        summary="Notes, code excerpts, and architecture diagrams from ongoing practice."
      />
      <div className={styles.grid}>
        {tracks.map((t, i) => (
          <motion.div
            key={t.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 + i * 0.08, ease: 'easeOut' }}
            whileHover={{ y: -3 }}
          >
            <Link to={`/learnings/${t.slug}`} className={styles.card}>
              <div className={styles.cardSlug}>{t.slug}</div>
              <div className={styles.cardTitle}>{t.title}</div>
              <p className={styles.cardDesc}>{t.desc}</p>
              <span className={styles.cardArrow}>→</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
