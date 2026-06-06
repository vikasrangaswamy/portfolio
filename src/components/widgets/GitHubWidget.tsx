import { useEffect, useState } from 'react'
import { profile } from '../../content/profile'
import { WidgetInfoLink } from './WidgetInfoLink'
import { CountUp } from '../../lib/CountUp'
import styles from './Widget.module.css'

type GitHubData = {
  public_repos: number
  followers: number
  updated_at: string | null
}

const CACHE_KEY = `gh:${profile.githubUsername}`
const CACHE_TTL_MS = 6 * 60 * 60 * 1000 // 6h

export function GitHubWidget() {
  const [data, setData] = useState<GitHubData | null>(null)

  useEffect(() => {
    const cached = readCache()
    if (cached) {
      setData(cached.data)
      return
    }
    fetch(`https://api.github.com/users/${profile.githubUsername}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!json) return
        const next: GitHubData = {
          public_repos: json.public_repos ?? 0,
          followers: json.followers ?? 0,
          updated_at: json.updated_at ?? null,
        }
        setData(next)
        writeCache(next)
      })
      .catch(() => setData(null))
  }, [])

  return (
    <a href={profile.github} target="_blank" rel="noreferrer" className={styles.widget}>
      <div className={styles.widgetHead}>
        <span className={styles.widgetLabel}>GitHub</span>
        <div className={styles.widgetHeadActions}>
          <WidgetInfoLink slug="github-widget" label="How the GitHub widget works" />
          <span className={styles.widgetIcon}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.5 6 .4.3.8 1 .8 2v3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z" />
            </svg>
          </span>
        </div>
      </div>
      <div className={styles.widgetValue}>
        {data ? <CountUp value={data.public_repos} /> : <span className={styles.skeleton} />}
        {data && <span style={{ fontSize: 14, color: 'var(--gray-500)' }}>repos</span>}
      </div>
      <div className={styles.widgetSub}>
        {data ? `${data.followers} follower${data.followers === 1 ? '' : 's'}` : <span className={styles.smallSkeleton} />}
      </div>
      <div className={styles.widgetMeta}>@{profile.githubUsername}</div>
    </a>
  )
}

type Cached = { data: GitHubData; at: number }

function readCache(): Cached | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Cached
    if (Date.now() - parsed.at > CACHE_TTL_MS) return null
    return parsed
  } catch {
    return null
  }
}

function writeCache(data: GitHubData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, at: Date.now() }))
  } catch {
    // ignore
  }
}
