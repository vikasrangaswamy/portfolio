import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import styles from './sections.module.css'
import learnStyles from '../../routes/Learnings.module.css'

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

export function LearningsSection({ standalone = false }: { standalone?: boolean }) {
  return (
    <section className={styles.section} id="learnings">
      {!standalone && (
        <header className={styles.heading}>
          <span className={styles.kicker}>04 / Learnings</span>
          <h2 className={styles.title}>What I'm studying</h2>
        </header>
      )}
      <div className={learnStyles.grid}>
        {tracks.map((t, i) => (
          <motion.div
            key={t.slug}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
            whileHover={{ y: -3 }}
          >
            <Link to={`/learnings/${t.slug}`} className={learnStyles.card}>
              <div className={learnStyles.cardSlug}>{t.slug}</div>
              <div className={learnStyles.cardTitle}>{t.title}</div>
              <p className={learnStyles.cardDesc}>{t.desc}</p>
              <span className={learnStyles.cardArrow}>→</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
