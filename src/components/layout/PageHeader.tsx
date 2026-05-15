import { motion } from 'framer-motion'
import styles from '../../routes/Page.module.css'

type Props = {
  tag: string
  title: string
  summary?: string
  /** Hides the bottom divider — useful when the next element provides its own boundary. */
  noDivider?: boolean
}

export function PageHeader({ tag, title, summary, noDivider }: Props) {
  return (
    <header>
      <motion.div
        className={styles.tag}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {tag}
      </motion.div>
      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
      >
        {title}
      </motion.h1>
      {summary && (
        <motion.p
          className={styles.summary}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
        >
          {summary}
        </motion.p>
      )}
      {!noDivider && <div className={styles.divider} />}
    </header>
  )
}
