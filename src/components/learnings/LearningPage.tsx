import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import pageStyles from '../../routes/Page.module.css'
import styles from './LearningPage.module.css'

export type LearningTopic = {
  slug: string
  title: string
  summary: string
  tech: readonly string[]
  repoUrl?: string
  component: ComponentType
}

type Props = {
  trackLabel: string
  trackHref: string
  topic: LearningTopic
}

export function LearningPage({ trackLabel, trackHref, topic }: Props) {
  const Body = topic.component
  return (
    <div className={pageStyles.container}>
      <header className={styles.header}>
        <Link to={trackHref} className={styles.backButton}>
          <span aria-hidden="true">←</span>
          <span>Back to {trackLabel}</span>
        </Link>
        <div className={styles.tagRow}>
          <span className={styles.track}>{trackLabel}</span>
        </div>
        <h1 className={styles.title}>{topic.title}</h1>
        <p className={styles.summary}>{topic.summary}</p>
        <div className={styles.metaRow}>
          {topic.tech.map((t) => (
            <span key={t} className={styles.techChip}>
              {t}
            </span>
          ))}
          {topic.repoUrl && (
            <a
              href={topic.repoUrl}
              className="kbd-btn kbd-btn--secondary"
              target="_blank"
              rel="noreferrer"
            >
              View Code →
            </a>
          )}
        </div>
      </header>
      <div className={styles.body}>
        <Body />
      </div>
    </div>
  )
}
