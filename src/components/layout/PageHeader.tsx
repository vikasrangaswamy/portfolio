import { motion } from 'framer-motion'
import { entranceFrom } from '../../lib/entrance'
import { Link } from 'react-router-dom'
import { useSeo } from '../../lib/useSeo'
import styles from '../../routes/Page.module.css'

type Props = {
  tag: string
  title: string
  summary?: string
  /** Optional back link rendered above the kicker. */
  back?: { to: string; label: string }
  /** Hides the bottom divider — useful when the next element provides its own boundary. */
  noDivider?: boolean
  /** Overrides the SEO/tab title segment (defaults to `tag`). */
  seoTitle?: string
  /** Emit <meta robots noindex> for this route (e.g. the soft-404 page). */
  noindex?: boolean
}

export function PageHeader({ tag, title, summary, back, noDivider, seoTitle, noindex }: Props) {
  // The kicker (`tag`) is the clean page name ("About", "Projects") — better as
  // the tab title than the big visual heading (sometimes the person's name).
  // Callers can override via `seoTitle`.
  useSeo(seoTitle ?? tag, summary, noindex)

  return (
    <header>
      {back && (
        <Link to={back.to} className={styles.backLink}>
          <span aria-hidden="true">←</span> {back.label}
        </Link>
      )}
      <motion.div
        className={styles.tag}
        initial={entranceFrom({ opacity: 0, y: 6 })}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {tag}
      </motion.div>
      <motion.h1
        className={styles.title}
        initial={entranceFrom({ opacity: 0, y: 10 })}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
      >
        {title}
      </motion.h1>
      {summary && (
        <motion.p
          className={styles.summary}
          initial={entranceFrom({ opacity: 0, y: 8 })}
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
