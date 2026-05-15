import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/layout/PageHeader'
import styles from './Page.module.css'

export default function Projects() {
  return (
    <div className={styles.container}>
      <PageHeader
        tag="Projects"
        title="Real projects, coming soon"
        summary="Reserved for completed work I'm willing to stand behind. An MT5 algorithmic trading suite (Python) lands here first."
      />
      <motion.div
        className={styles.emptyState}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15, ease: 'easeOut' }}
      >
        <h2>Nothing here yet</h2>
        <p>
          Each project will land with an architecture writeup, design decisions, tradeoffs, and a
          link to its public repo. Until then, see what I'm currently studying.
        </p>
        <Link to="/learnings" className={styles.linkBtn}>
          Browse Learnings →
        </Link>
      </motion.div>
    </div>
  )
}
