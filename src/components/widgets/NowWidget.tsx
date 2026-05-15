import { Link } from 'react-router-dom'
import { profile } from '../../content/profile'
import styles from './Widget.module.css'

export function NowWidget() {
  return (
    <Link to="/projects" className={styles.widget}>
      <div className={styles.widgetHead}>
        <span className={styles.widgetLabel}>Now</span>
        <span className={styles.widgetIcon}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </span>
      </div>
      <div className={styles.widgetValue} style={{ fontSize: 18, lineHeight: 1.3 }}>
        Building
      </div>
      <div className={styles.widgetSub}>{profile.now}</div>
      <div className={styles.widgetMeta}>
        <span
          style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'var(--success)',
            animation: 'livePulse 1.8s ease-in-out infinite',
          }}
        />
        live
      </div>
    </Link>
  )
}
