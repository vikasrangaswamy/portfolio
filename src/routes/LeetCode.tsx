import { Link } from 'react-router-dom'
import styles from './Page.module.css'

export default function LeetCode() {
  return (
    <div className={styles.container}>
      <div className={styles.tag}>Learnings · LeetCode</div>
      <h1 className={styles.title}>LeetCode Practice Guide</h1>
      <p className={styles.summary}>
        16 problem categories with curated must-do problems, study phases, and priority rankings.
      </p>
      <div className={styles.emptyState}>
        <h2>Problem writeups coming soon</h2>
        <p>
          I'm porting solved problems into per-problem pages with approach explanation, complexity
          analysis, and the canonical code excerpt.
        </p>
        <Link to="/learnings" className={styles.linkBtn}>
          ← Back to Learnings
        </Link>
      </div>
    </div>
  )
}
