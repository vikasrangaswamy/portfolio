import { useEffect, useState } from 'react'
import { profile } from '../../content/profile'
import styles from './Widget.module.css'

type LeetCodeData = {
  totals: { All: number }
  calendar: {
    streak: number
    submissionCalendar: Record<string, number>
  }
  _placeholder?: boolean
}

export function LeetCodeWidget() {
  const [data, setData] = useState<LeetCodeData | null>(null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/leetcode.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => setData(null))
  }, [])

  const bars = data ? lastSevenDays(data.calendar.submissionCalendar) : []
  const max = bars.length ? Math.max(...bars, 1) : 1

  return (
    <a
      href={`https://leetcode.com/u/${profile.leetcodeUsername}/`}
      target="_blank"
      rel="noreferrer"
      className={styles.widget}
    >
      <div className={styles.widgetHead}>
        <span className={styles.widgetLabel}>LeetCode</span>
        <span className={styles.widgetIcon}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M17 7H8M17 7V16" />
          </svg>
        </span>
      </div>
      <div className={styles.widgetValue}>
        {data ? data.totals.All : <span className={styles.skeleton} />}
        {data && <span style={{ fontSize: 14, color: 'var(--gray-500)' }}>solved</span>}
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
                style={{
                  height: `${Math.max(15, (count / max) * 100)}%`,
                  opacity: count === 0 ? 0.4 : 1,
                }}
              />
            ))}
      </div>
      <div className={styles.widgetMeta}>
        {data ? (
          <>🔥 {data.calendar.streak}-day streak</>
        ) : (
          <span className={styles.smallSkeleton} />
        )}
      </div>
    </a>
  )
}

function lastSevenDays(submissionCalendar: Record<string, number>): number[] {
  const today = new Date()
  const days: number[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setUTCDate(today.getUTCDate() - i)
    d.setUTCHours(0, 0, 0, 0)
    const ts = Math.floor(d.getTime() / 1000)
    days.push(submissionCalendar[String(ts)] ?? 0)
  }
  return days
}
