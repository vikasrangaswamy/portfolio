import { Link } from 'react-router-dom'
import { experience } from '../../content/experience'
import styles from './Widget.module.css'

function formatMonth(yyyymm: string): string {
  const [y, m] = yyyymm.split('-').map(Number)
  if (!y || !m) return yyyymm
  return new Date(y, m - 1, 1).toLocaleString('en-US', { month: 'short', year: 'numeric' })
}

function monthsSince(yyyymm: string): number {
  const [y, m] = yyyymm.split('-').map(Number)
  if (!y || !m) return 0
  const now = new Date()
  return (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m)
}

export function RoleWidget() {
  const current = experience[0]
  if (!current) return null

  const months = monthsSince(current.start)
  const years = Math.floor(months / 12)
  const rem = months % 12
  const tenure =
    years === 0
      ? `${months} mo`
      : rem === 0
        ? `${years} yr${years === 1 ? '' : 's'}`
        : `${years}y ${rem}m`

  return (
    <Link to="/experience" className={styles.widget}>
      <div className={styles.widgetHead}>
        <span className={styles.widgetLabel}>Current role</span>
        <span className={styles.widgetIcon}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="6" width="18" height="14" rx="2" />
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </span>
      </div>
      <div className={styles.widgetValue} style={{ fontSize: 18, lineHeight: 1.3 }}>
        {current.title}
      </div>
      <div className={styles.widgetSub}>{current.company}</div>
      <div className={styles.widgetMeta}>
        {formatMonth(current.start)} — Present · {tenure}
      </div>
    </Link>
  )
}
