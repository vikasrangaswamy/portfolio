import { motion } from 'framer-motion'
import { experience, type Role } from '../../content/experience'
import styles from './sections.module.css'
import expStyles from '../../routes/Experience.module.css'

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

export function ExperienceSection({ standalone = false }: { standalone?: boolean }) {
  return (
    <section className={styles.section} id="experience">
      {!standalone && (
        <header className={styles.heading}>
          <span className={styles.kicker}>02 / Experience</span>
          <h2 className={styles.title}>Work history</h2>
        </header>
      )}
      <div className={expStyles.timeline}>
        {experience.map((role, i) => (
          <motion.article
            key={`${role.company}-${role.start}`}
            className={expStyles.role}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
          >
            <header className={expStyles.roleHeader}>
              <div className={expStyles.titleRow}>
                <span className={expStyles.title}>{role.title}</span>
                <span className={expStyles.company}>{role.company}</span>
              </div>
              <div className={expStyles.meta}>
                {formatRange(role)}
                {role.location && <span className={expStyles.location}>{role.location}</span>}
              </div>
            </header>
            <ul className={expStyles.bullets}>
              {role.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            {role.tech && (
              <div className={expStyles.techRow}>
                {role.tech.map((t) => (
                  <span key={t} className={expStyles.techChip}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  )
}
