import { motion } from 'framer-motion'
import { experience, type Role } from '../content/experience'
import { PageHeader } from '../components/layout/PageHeader'
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

type CompanyGroup = {
  company: string
  location?: string
  /** Earliest start across all roles, for the company-level date range. */
  spanStart: string
  /** Latest end (or "Present") across all roles. */
  spanEnd: string | 'Present'
  roles: readonly Role[]
}

function groupByCompany(roles: readonly Role[]): CompanyGroup[] {
  const groups: CompanyGroup[] = []
  for (const role of roles) {
    const last = groups[groups.length - 1]
    if (last && last.company === role.company) {
      last.roles = [...last.roles, role]
      // start is the EARLIEST across all roles in the group
      if (role.start < last.spanStart) last.spanStart = role.start
      // end stays Present if any role is Present, else the latest end date
      if (last.spanEnd !== 'Present') {
        if (role.end === 'Present' || role.end > last.spanEnd) {
          last.spanEnd = role.end
        }
      }
      // prefer the first location we see for the group
      if (!last.location && role.location) last.location = role.location
    } else {
      groups.push({
        company: role.company,
        location: role.location,
        spanStart: role.start,
        spanEnd: role.end,
        roles: [role],
      })
    }
  }
  return groups
}

function formatSpan(group: CompanyGroup): string {
  const start = formatMonth(group.spanStart)
  const end = group.spanEnd === 'Present' ? 'Present' : formatMonth(group.spanEnd)
  return `${start} — ${end}`
}

export default function Experience() {
  const groups = groupByCompany(experience)

  return (
    <div className={pageStyles.container}>
      <PageHeader
        tag="Experience"
        title="Work history"
        summary="Two companies, four roles. Most recent first."
      />
      <div className={styles.timeline}>
        {groups.map((group, gi) => (
          <motion.section
            key={`${group.company}-${group.spanStart}`}
            className={styles.companyBlock}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 + gi * 0.08, ease: 'easeOut' }}
          >
            <header className={styles.companyHeader}>
              <div>
                <h2 className={styles.companyName}>{group.company}</h2>
                {group.location && <span className={styles.companyLocation}>{group.location}</span>}
              </div>
              <span className={styles.companySpan}>{formatSpan(group)}</span>
            </header>
            <ol className={styles.roleList}>
              {group.roles.map((role, ri) => (
                <li key={`${role.title}-${role.start}`} className={styles.roleEntry}>
                  <div className={styles.roleMarker} aria-hidden="true">
                    <span className={styles.roleDot} />
                    {ri < group.roles.length - 1 && <span className={styles.roleStem} />}
                  </div>
                  <div className={styles.roleBody}>
                    <div className={styles.roleHeader}>
                      <span className={styles.roleTitle}>{role.title}</span>
                      <span className={styles.roleRange}>{formatRange(role)}</span>
                    </div>
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
                  </div>
                </li>
              ))}
            </ol>
          </motion.section>
        ))}
      </div>
    </div>
  )
}
