import { Link } from 'react-router-dom'
import styles from './Page.module.css'

export default function Dsa() {
  return (
    <div className={styles.container}>
      <div className={styles.tag}>Learnings · DSA</div>
      <h1 className={styles.title}>Data Structures & Algorithms</h1>
      <p className={styles.summary}>
        13 topics in Python — arrays, strings, hashmaps, trees, graphs, backtracking, and more.
      </p>
      <div className={styles.emptyState}>
        <h2>Topic writeups coming soon</h2>
        <p>
          I'm porting my Python practice notes into curated topic-by-topic pages. Each topic will
          include the core pattern and 1–2 inline code excerpts.
        </p>
        <Link to="/learnings" className={styles.linkBtn}>
          ← Back to Learnings
        </Link>
      </div>
    </div>
  )
}
