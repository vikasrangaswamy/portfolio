import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { profile } from '../../content/profile'
import { WidgetInfoLink } from './WidgetInfoLink'
import { CountUp } from '../../lib/CountUp'
import { toActivities } from '../../lib/activity'
import styles from './Widget.module.css'

// Reads the daily-synced contribution data (public/data/github.json) — same
// pipeline as the LeetCode tile. No client-side GitHub API call.
type GitHubData = {
  totalLastYear: number
  days: Record<string, number>
  _placeholder?: boolean
}

export function GitHubWidget() {
  const [data, setData] = useState<GitHubData | null>(null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/github.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => setData(null))
  }, [])

  const bars = data ? toActivities(data.days ?? {}).slice(-7).map((d) => d.count) : []
  const max = bars.length ? Math.max(...bars, 1) : 1
  const contributions = data?.totalLastYear ?? 0

  return (
    <div className={styles.widget}>
      <Link
        to="/stats?tab=github"
        className={styles.widgetLink}
        aria-label="GitHub contribution stats"
      />
      <div className={styles.widgetHead}>
        <span className={styles.widgetLabel}>GitHub</span>
        <div className={styles.widgetHeadActions}>
          <WidgetInfoLink slug="github-widget" label="How the GitHub widget works" />
          <span className={styles.widgetIcon}>
            {/* Right-arrow (matching the LeetCode card) — both navigate in-site
                to the Stats page, so they share the same affordance. */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </div>
      </div>
      <div className={styles.widgetValue}>
        {data ? <CountUp value={contributions} /> : <span className={styles.skeleton} />}
        {data && <span style={{ fontSize: 14, color: 'var(--gray-500)' }}>contributions</span>}
      </div>
      <div className={styles.miniBars} aria-hidden="true">
        {bars.length === 0
          ? Array.from({ length: 7 }).map((_, i) => (
              <span key={i} className={styles.miniBar} style={{ height: '20%' }} />
            ))
          : bars.map((count, i) => (
              <span
                key={i}
                className={styles.miniBar}
                style={{ height: `${Math.max(15, (count / max) * 100)}%`, opacity: count === 0 ? 0.4 : 1 }}
              />
            ))}
      </div>
      <div className={styles.widgetMeta}>@{profile.githubUsername}</div>
    </div>
  )
}
