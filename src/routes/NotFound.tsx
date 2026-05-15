import { Link } from 'react-router-dom'
import styles from './Page.module.css'

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.tag}>404</div>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.summary}>
        That route doesn't exist (yet). Head back to the{' '}
        <Link to="/" style={{ color: 'var(--clay)' }}>
          home page
        </Link>
        .
      </p>
    </div>
  )
}
