import { Link } from 'react-router-dom'
import styles from './Page.module.css'

export default function Projects() {
  return (
    <div className={styles.container}>
      <div className={styles.tag}>Projects</div>
      <h1 className={styles.title}>Real projects, coming soon</h1>
      <p className={styles.summary}>
        This section is reserved for completed real-world projects. In the meantime, see the
        Learnings section for hands-on system-design and frontend work.
      </p>
      <div className={styles.emptyState}>
        <h2>Nothing here yet</h2>
        <p>
          Projects I build going forward will live here with architecture, design decisions, and
          links to their public repos.
        </p>
        <Link to="/learnings" className={styles.linkBtn}>
          Browse Learnings →
        </Link>
      </div>
    </div>
  )
}
