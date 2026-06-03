import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ActivityCalendar, type Activity, type ThemeInput } from 'react-activity-calendar'
import { profile } from '../content/profile'
import { useTheme } from '../lib/useTheme'
import { PageHeader } from '../components/layout/PageHeader'
import pageStyles from './Page.module.css'
import styles from './LeetCodeStats.module.css'

type Totals = { All: number; Easy: number; Medium: number; Hard: number }

type LeetCodeData = {
  username: string | null
  realName: string | null
  ranking: number | null
  totals: Totals
  questionTotals: Totals
  calendar: {
    streak: number
    totalActiveDays: number
    submissionCalendar: Record<string, number>
  }
  fetchedAt: string | null
  _placeholder?: boolean
}

const HEATMAP_THEME: ThemeInput = {
  light: ['#F0EEE6', '#EDD8C7', '#E5B594', '#D97757', '#A04E2E'],
  dark: ['#2E2E2A', '#5A3D2E', '#92583A', '#D97757', '#E68B6F'],
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
        <div className={pageStyles.tag}>Learnings · LeetCode</div>
        <h1 className={pageStyles.title}>LeetCode</h1>
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
  const handle = data.username ?? profile.leetcodeUsername

  return (
    <div className={pageStyles.container}>
      <PageHeader
        tag="Learnings · LeetCode"
        title="LeetCode"
        summary={`Practice across ${data.questionTotals.All.toLocaleString()} problems. Stats and submission heatmap synced daily from leetcode.com/u/${handle}.`}
      />
      <div className={styles.profileRow}>
        <a href={profileUrl} target="_blank" rel="noreferrer" className={styles.profileLink}>
          View profile on leetcode.com ↗
        </a>
      </div>

      {isPlaceholder && (
        <div className={styles.notice}>
          Stats sync hasn't run yet (or the username doesn't match a LeetCode profile). The page
          will populate once <code>scripts/fetch-leetcode-stats.mjs</code> runs successfully via
          GitHub Actions.
        </div>
      )}

      <section className={styles.statsGrid}>
        <StatCard
          label="Total Solved"
          value={data.totals.All}
          sub={`of ${data.questionTotals.All.toLocaleString()}`}
          accent="clay"
          delay={0}
        />
        <StatCard
          label="Easy"
          value={data.totals.Easy}
          sub={`of ${data.questionTotals.Easy.toLocaleString()}`}
          accent="success"
          delay={0.05}
        />
        <StatCard
          label="Medium"
          value={data.totals.Medium}
          sub={`of ${data.questionTotals.Medium.toLocaleString()}`}
          accent="warning"
          delay={0.1}
        />
        <StatCard
          label="Hard"
          value={data.totals.Hard}
          sub={`of ${data.questionTotals.Hard.toLocaleString()}`}
          accent="danger"
          delay={0.15}
        />
      </section>

      <section className={styles.secondaryStats}>
        <SecondaryStat label="Current Streak" value={`${data.calendar.streak} days`} />
        <SecondaryStat label="Active Days" value={`${data.calendar.totalActiveDays}`} />
        <SecondaryStat label="Submissions (1y)" value={`${lastYear}`} />
        <SecondaryStat label="Global Ranking" value={data.ranking ? `#${data.ranking.toLocaleString()}` : '—'} />
      </section>

      <motion.section
        className={styles.heatmapCard}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
      >
        <header className={styles.heatmapHeader}>
          <h2 className={styles.heatmapTitle}>Submission activity</h2>
          <span className={styles.heatmapMeta}>last 12 months</span>
        </header>
        <div className={styles.heatmapWrap}>
          <ActivityCalendar
            data={activities}
            theme={HEATMAP_THEME}
            colorScheme={theme}
            blockSize={12}
            blockMargin={3}
            fontSize={12}
            showWeekdayLabels
            labels={{
              totalCount: '{{count}} submissions in {{year}}',
            }}
            renderBlock={(block, activity) => {
              if (activity.count === 0) return block
              return (
                <g>
                  {block}
                  <title>
                    {activity.count} submission{activity.count === 1 ? '' : 's'} on {activity.date}
                  </title>
                </g>
              )
            }}
          />
        </div>
        {data.fetchedAt && (
          <footer className={styles.heatmapFooter}>
            Updated {formatRelative(data.fetchedAt)} · synced daily at 06:17 UTC
          </footer>
        )}
      </motion.section>
    </div>
  )
}

function StatCard({
  label,
  value,
  sub,
  accent,
  delay,
}: {
  label: string
  value: number
  sub?: string
  accent: 'clay' | 'success' | 'warning' | 'danger'
  delay: number
}) {
  return (
    <motion.div
      className={`${styles.stat} ${styles[`stat-${accent}`]}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
    >
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValue}>{value}</div>
      {sub && <div className={styles.statSub}>{sub}</div>}
    </motion.div>
  )
}

function SecondaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.secondary}>
      <span className={styles.secondaryLabel}>{label}</span>
      <span className={styles.secondaryValue}>{value}</span>
    </div>
  )
}

function toActivities(submissionCalendar: Record<string, number>): Activity[] {
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

  const out: Activity[] = []
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
