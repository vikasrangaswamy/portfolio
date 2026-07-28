import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { entranceFrom } from '../lib/entrance'
import { useTheme } from '../lib/useTheme'
import { PageHeader } from '../components/layout/PageHeader'
import { SubmissionHeatmap } from '../components/leetcode/SubmissionHeatmap'
import {
  toActivities,
  unixCalendarToIso,
  computeLongestStreak,
  activeDays,
  totalCount,
  formatRelative,
} from '../lib/activity'
import { profile } from '../content/profile'
import pageStyles from './Page.module.css'
import styles from './LeetCodeStats.module.css'

type GitHubData = {
  username: string | null
  totalLastYear: number
  days: Record<string, number>
  fetchedAt: string | null
  _placeholder?: boolean
}

type LeetCodeData = {
  username: string | null
  calendar: { totalActiveDays: number; submissionCalendar: Record<string, number> }
  fetchedAt: string | null
  _placeholder?: boolean
}

type Source = 'github' | 'leetcode'

export default function Stats() {
  const { theme } = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()
  const [gh, setGh] = useState<GitHubData | null>(null)
  const [lc, setLc] = useState<LeetCodeData | null>(null)
  // `?tab=` is the source of truth, not local state: the visitor may arrive on
  // either tab (the home GitHub/LeetCode widgets link to /stats?tab=…), and
  // switching tabs should stay shareable and survive a refresh. `replace` keeps
  // tab flipping out of the back button's way. Defaults to GitHub.
  const active: Source = searchParams.get('tab') === 'leetcode' ? 'leetcode' : 'github'
  const setActive = (tab: Source) => setSearchParams({ tab }, { replace: true })

  useEffect(() => {
    const base = import.meta.env.BASE_URL
    fetch(`${base}data/github.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setGh)
      .catch(() => setGh(null))
    fetch(`${base}data/leetcode.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setLc)
      .catch(() => setLc(null))
  }, [])

  return (
    <div className={pageStyles.container}>
      <PageHeader
        tag="Stats"
        title="Stats"
        summary="A live look at my coding activity — GitHub contributions and LeetCode practice, each synced automatically from my profiles every morning."
      />

      <div className={styles.toggle} role="tablist" aria-label="Choose a data source">
        <button
          type="button"
          role="tab"
          aria-selected={active === 'github'}
          className={active === 'github' ? `${styles.toggleBtn} ${styles.toggleBtnActive}` : styles.toggleBtn}
          onClick={() => setActive('github')}
        >
          GitHub
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={active === 'leetcode'}
          className={active === 'leetcode' ? `${styles.toggleBtn} ${styles.toggleBtnActive}` : styles.toggleBtn}
          onClick={() => setActive('leetcode')}
        >
          LeetCode
        </button>
      </div>

      {active === 'github' ? (
        <GitHubSection data={gh} theme={theme} />
      ) : (
        <LeetCodeSection data={lc} theme={theme} />
      )}
    </div>
  )
}

function GitHubSection({ data, theme }: { data: GitHubData | null; theme: 'light' | 'dark' }) {
  if (!data) return <SectionLoading title="GitHub contributions" />

  const placeholder = data._placeholder || !data.username
  const activities = toActivities(data.days ?? {})
  const total = data.totalLastYear || totalCount(activities)
  const profileUrl = `https://github.com/${profile.githubUsername}`

  return (
    <Section
      title="GitHub contributions"
      noun="contributions"
      profileLabel="View profile on github.com ↗"
      profileUrl={profileUrl}
      placeholder={placeholder}
      placeholderNote="GitHub sync hasn't run yet — the page will fill in once the daily Action runs."
      stats={[
        { label: 'Contributions', value: `${total}`, unit: 'last 12 mo' },
        { label: 'Active Days', value: `${activeDays(activities)}`, unit: 'this year' },
        { label: 'Longest Streak', value: `${computeLongestStreak(activities)}`, unit: 'days' },
      ]}
      activities={activities}
      theme={theme}
      fetchedAt={data.fetchedAt}
    />
  )
}

function LeetCodeSection({ data, theme }: { data: LeetCodeData | null; theme: 'light' | 'dark' }) {
  if (!data) return <SectionLoading title="LeetCode practice" />

  const placeholder = data._placeholder || !data.username
  const activities = toActivities(unixCalendarToIso(data.calendar.submissionCalendar))
  const profileUrl = data.username ? `https://leetcode.com/u/${data.username}/` : 'https://leetcode.com'

  return (
    <Section
      title="LeetCode practice"
      noun="submissions"
      profileLabel="View profile on leetcode.com ↗"
      profileUrl={profileUrl}
      placeholder={placeholder}
      placeholderNote="LeetCode sync hasn't run yet (or the username doesn't match a profile)."
      stats={[
        { label: 'Longest Streak', value: `${computeLongestStreak(activities)}`, unit: 'days' },
        { label: 'Active Days', value: `${data.calendar.totalActiveDays}`, unit: 'this year' },
        { label: 'Submissions', value: `${totalCount(activities)}`, unit: 'last 12 mo' },
      ]}
      activities={activities}
      theme={theme}
      fetchedAt={data.fetchedAt}
    />
  )
}

type Stat = { label: string; value: string; unit: string }

function Section({
  title,
  noun,
  profileLabel,
  profileUrl,
  placeholder,
  placeholderNote,
  stats,
  activities,
  theme,
  fetchedAt,
}: {
  title: string
  noun: string
  profileLabel: string
  profileUrl: string
  placeholder: boolean
  placeholderNote: string
  stats: Stat[]
  activities: import('../lib/activity').ActivityDay[]
  theme: 'light' | 'dark'
  fetchedAt: string | null
}) {
  return (
    <section style={{ marginTop: 'var(--sp-4)' }}>
      <div className={styles.profileRow}>
        <a href={profileUrl} target="_blank" rel="noreferrer" className={styles.profileLink}>
          {profileLabel}
        </a>
      </div>

      {placeholder && <div className={styles.notice}>{placeholderNote}</div>}

      <section className={styles.consistencyRow}>
        {stats.map((s, i) => (
          <ConsistencyStat key={s.label} {...s} delay={i * 0.05} />
        ))}
      </section>

      <motion.section
        className={styles.heatmapCard}
        initial={entranceFrom({ opacity: 0, y: 12 })}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      >
        <header className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>{title}</h2>
          <span className={styles.cardMeta}>last 12 months</span>
        </header>
        <SubmissionHeatmap days={activities} theme={theme} noun={noun} />
        {fetchedAt && (
          <footer className={styles.heatmapFooter}>
            Updated {formatRelative(fetchedAt)} · synced daily at 06:17 UTC
          </footer>
        )}
      </motion.section>
    </section>
  )
}

function SectionLoading({ title }: { title: string }) {
  return (
    <section style={{ marginTop: 'var(--sp-4)' }}>
      <header className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{title}</h2>
        <span className={styles.cardMeta}>loading…</span>
      </header>
    </section>
  )
}

function ConsistencyStat({
  label,
  value,
  unit,
  delay,
}: Stat & { delay: number }) {
  return (
    <motion.div
      className={styles.consistency}
      initial={entranceFrom({ opacity: 0, y: 10 })}
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
