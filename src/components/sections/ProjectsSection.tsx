import { motion } from 'framer-motion'
import styles from './sections.module.css'
import pageStyles from '../../routes/Page.module.css'

export function ProjectsSection({ standalone = false }: { standalone?: boolean }) {
  return (
    <section className={styles.section} id="projects">
      {!standalone && (
        <header className={styles.heading}>
          <span className={styles.kicker}>03 / Projects</span>
          <h2 className={styles.title}>Real projects, coming soon</h2>
        </header>
      )}
      <motion.div
        className={pageStyles.emptyState}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 'var(--sp-3)' }}>
          Nothing here yet
        </h3>
        <p>
          Reserved for completed work I'm willing to stand behind. An MT5 algorithmic trading suite
          (Python) lands here first — three Expert Advisors with shared risk controls, on-chart
          telemetry, and broker-safe order handling.
        </p>
      </motion.div>
    </section>
  )
}
