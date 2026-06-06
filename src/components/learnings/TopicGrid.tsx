import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { LearningTopic } from './LearningPage'
import { PageHeader } from '../layout/PageHeader'
import pageStyles from '../../routes/Page.module.css'

type Props = {
  tag: string
  title: string
  summary: string
  trackPath: string
  topics: readonly LearningTopic[]
  back?: { to: string; label: string }
}

export function TopicGrid({ tag, title, summary, trackPath, topics, back }: Props) {
  return (
    <div className={pageStyles.container}>
      <PageHeader tag={tag} title={title} summary={summary} back={back} />
      <ul style={{ display: 'grid', gap: 'var(--sp-3)' }}>
        {topics.map((topic, i) => (
          <motion.li
            key={topic.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.06, ease: 'easeOut' }}
            whileHover={{ y: -2 }}
            style={{ listStyle: 'none' }}
          >
            <Link
              to={`${trackPath}/${topic.slug}`}
              style={{
                display: 'block',
                padding: 'var(--sp-5)',
                background: 'var(--white)',
                border: '1px solid var(--gray-300)',
                borderRadius: 'var(--r-md)',
                transition:
                  'border-color var(--transition), box-shadow var(--transition)',
              }}
            >
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 500,
                  color: 'var(--slate)',
                  marginBottom: 'var(--sp-2)',
                }}
              >
                {topic.title}
              </div>
              <p style={{ fontSize: 14, color: 'var(--gray-700)', marginBottom: 'var(--sp-3)' }}>
                {topic.summary}
              </p>
              <div style={{ display: 'flex', gap: '8px 12px', flexWrap: 'wrap' }}>
                {topic.tech.map((t) => (
                  <span key={t} className="kbd-chip">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
