import { Link } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import styles from './Page.module.css'

export default function NotFound() {
  return (
    <div className={styles.container}>
      <PageHeader tag="404" title="Page not found" noDivider />
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
