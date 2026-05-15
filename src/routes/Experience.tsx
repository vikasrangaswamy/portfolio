import { experience, type Role } from '../content/experience'
import pageStyles from './Page.module.css'
import styles from './Experience.module.css'

function formatMonth(yyyymm: string): string {
  const [year, month] = yyyymm.split('-').map(Number)
  if (!year || !month) return yyyymm
  const date = new Date(year, month - 1, 1)
  return date.toLocaleString('en-US', { month: 'short', year: 'numeric' })
}

function formatRange(role: Role): string {
  const start = formatMonth(role.start)
  const end = role.end === 'Present' ? 'Present' : formatMonth(role.end)
  return `${start} — ${end}`
}

export default function Experience() {
  return (
    <div className={pageStyles.container}>
      <div className={pageStyles.tag}>Experience</div>
      <h1 className={pageStyles.title}>Work history</h1>
      <p className={pageStyles.summary}>
        A timeline of where I've worked and what I built. Most recent first.
      </p>
      <div className={pageStyles.divider} />
      <div className={styles.timeline}>
        {experience.map((role, i) => (
          <article
            key={`${role.company}-${role.start}`}
            className={styles.role}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <header className={styles.roleHeader}>
              <div className={styles.titleRow}>
                <span className={styles.title}>{role.title}</span>
                <span className={styles.company}>{role.company}</span>
              </div>
              <div className={styles.meta}>
                {formatRange(role)}
                {role.location && <span className={styles.location}>{role.location}</span>}
              </div>
            </header>
            <ul className={styles.bullets}>
              {role.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            {role.tech && (
              <div className={styles.techRow}>
                {role.tech.map((t) => (
                  <span key={t} className={styles.techChip}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
