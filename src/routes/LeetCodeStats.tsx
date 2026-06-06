import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../lib/useTheme'
import { PageHeader } from '../components/layout/PageHeader'
import { SubmissionHeatmap, type ActivityDay } from '../components/leetcode/SubmissionHeatmap'
import pageStyles from './Page.module.css'
import styles from './LeetCodeStats.module.css'

type LeetCodeData = {
  username: string | null
  realName: string | null
  calendar: {
    streak: number
    totalActiveDays: number
    submissionCalendar: Record<string, number>
  }
  fetchedAt: string | null
  _placeholder?: boolean
}

export default function LeetCodeStats() {
  const [data, setData] = useState<LeetCodeData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}data/leetcode.json`
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load stats (${r.status})`)
        return r.json()
      })
      .then(setData)
      .catch((e) => setError(String(e)))
  }, [])

  if (error) {
    return (
      <div className={pageStyles.container}>
        <PageHeader tag="Learnings · LeetCode" title="LeetCode" />
        <p className={pageStyles.summary}>Stats couldn't load right now. {error}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className={pageStyles.container}>
        <PageHeader tag="Learnings · LeetCode" title="LeetCode" summary="Loading stats…" />
      </div>
    )
  }

  const isPlaceholder = data._placeholder || !data.username
  const activities = toActivities(data.calendar.submissionCalendar)
  const lastYear = activities.reduce((s, a) => s + a.count, 0)
  const profileUrl = data.username
    ? `https://leetcode.com/u/${data.username}/`
    : 'https://leetcode.com'

  return (
    <div className={pageStyles.container}>
      <PageHeader
        tag="Learnings · LeetCode"
        title="LeetCode"
        back={{ to: '/learnings', label: 'Learnings' }}
        summary="A daily problem-solving habit. The heatmap and stats below sync automatically from my LeetCode profile each morning."
      />
      <div className={styles.profileRow}>
        <a href={profileUrl} target="_blank" rel="noreferrer" className={styles.profileLink}>
          View full profile on leetcode.com ↗
        </a>
      </div>

      {isPlaceholder && (
        <div className={styles.notice}>
          Stats sync hasn't run yet (or the username doesn't match a LeetCode profile). The page
          will populate once <code>scripts/fetch-leetcode-stats.mjs</code> runs successfully via
          GitHub Actions.
        </div>
      )}

      <section className={styles.consistencyRow}>
        <ConsistencyStat label="Current Streak" value={`${data.calendar.streak}`} unit="days" delay={0} />
        <ConsistencyStat label="Active Days" value={`${data.calendar.totalActiveDays}`} unit="this year" delay={0.05} />
        <ConsistencyStat label="Submissions" value={`${lastYear}`} unit="last 12 mo" delay={0.1} />
      </section>

      <motion.section
        className={styles.heatmapCard}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
      >
        <header className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Submission activity</h2>
          <span className={styles.cardMeta}>last 12 months</span>
        </header>
        <SubmissionHeatmap days={activities} theme={theme} />
        {data.fetchedAt && (
          <footer className={styles.heatmapFooter}>
            Updated {formatRelative(data.fetchedAt)} · synced daily at 06:17 UTC
          </footer>
        )}
      </motion.section>
    </div>
  )
}

function ConsistencyStat({
  label,
  value,
  unit,
  delay,
}: {
  label: string
  value: string
  unit: string
  delay: number
}) {
  return (
    <motion.div
      className={styles.consistency}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
    >
      <div className={styles.consistencyLabel}>{label}</div>
      <div className={styles.consistencyValue}>
        {value}
        <span className={styles.consistencyUnit}>{unit}</span>
      </div>
    </motion.div>
  )
}

function toActivities(submissionCalendar: Record<string, number>): ActivityDay[] {
  const today = new Date()
  const end = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  const start = new Date(end)
  start.setUTCFullYear(end.getUTCFullYear() - 1)
  start.setUTCDate(start.getUTCDate() + 1)

  const map = new Map<string, number>()
  for (const [ts, count] of Object.entries(submissionCalendar)) {
    const d = new Date(Number(ts) * 1000)
    const key = isoDate(d)
    map.set(key, (map.get(key) ?? 0) + Number(count))
  }

  const out: ActivityDay[] = []
  const cursor = new Date(start)
  while (cursor <= end) {
    const key = isoDate(cursor)
    const count = map.get(key) ?? 0
    out.push({ date: key, count, level: levelFor(count) })
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return out
}

function levelFor(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count < 2) return 1
  if (count < 4) return 2
  if (count < 7) return 3
  return 4
}

function isoDate(d: Date): string {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** "8 hours ago", "yesterday", "3 days ago" — anything fresher than 24h
 *  reads as recent rather than as a stale timestamp. */
function formatRelative(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const seconds = Math.max(0, (now - then) / 1000)
  const minutes = seconds / 60
  const hours = minutes / 60
  const days = hours / 24

  if (minutes < 1) return 'just now'
  if (minutes < 60) {
    const n = Math.round(minutes)
    return `${n} minute${n === 1 ? '' : 's'} ago`
  }
  if (hours < 24) {
    const n = Math.round(hours)
    return `${n} hour${n === 1 ? '' : 's'} ago`
  }
  if (days < 2) return 'yesterday'
  if (days < 30) {
    const n = Math.round(days)
    return `${n} days ago`
  }
  return new Date(iso).toLocaleDateString()
}
