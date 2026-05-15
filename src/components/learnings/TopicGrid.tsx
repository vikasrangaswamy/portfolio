import { Link } from 'react-router-dom'
import type { LearningTopic } from './LearningPage'
import pageStyles from '../../routes/Page.module.css'

type Props = {
  tag: string
  title: string
  summary: string
  trackPath: string // e.g. "/learnings/system-design"
  topics: readonly LearningTopic[]
}

export function TopicGrid({ tag, title, summary, trackPath, topics }: Props) {
  return (
    <div className={pageStyles.container}>
      <div className={pageStyles.tag}>{tag}</div>
      <h1 className={pageStyles.title}>{title}</h1>
      <p className={pageStyles.summary}>{summary}</p>
      <div className={pageStyles.divider} />
      <ul style={{ display: 'grid', gap: 'var(--sp-3)' }}>
        {topics.map((topic) => (
          <li key={topic.slug}>
            <Link
              to={`${trackPath}/${topic.slug}`}
              style={{
                display: 'block',
                padding: 'var(--sp-5)',
                background: 'var(--white)',
                border: '1px solid var(--gray-300)',
                borderRadius: 'var(--r-md)',
                transition: 'transform var(--transition), border-color var(--transition), box-shadow var(--transition)',
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
              <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                {topic.tech.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 12,
                      background: 'var(--gray-100)',
                      border: '1px solid var(--gray-300)',
                      borderRadius: 'var(--r-lg)',
                      padding: '2px var(--sp-3)',
                      color: 'var(--gray-700)',
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
