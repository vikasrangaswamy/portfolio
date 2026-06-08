import { motion } from 'framer-motion'
import { Bio } from '../components/home/Bio'
import { HeroTerminal } from '../components/home/HeroTerminal'
import { LeetCodeWidget } from '../components/widgets/LeetCodeWidget'
import { GitHubWidget } from '../components/widgets/GitHubWidget'
import { RoleWidget } from '../components/widgets/RoleWidget'
import { NowWidget } from '../components/widgets/NowWidget'
import widgetStyles from '../components/widgets/Widget.module.css'
import styles from './Home.module.css'

const widgets = [
  { Component: LeetCodeWidget, key: 'leetcode' },
  { Component: GitHubWidget, key: 'github' },
  { Component: RoleWidget, key: 'role' },
  { Component: NowWidget, key: 'now' },
]

export default function Home() {
  return (
    <>
      <section className={styles.split}>
        <motion.div
          className={styles.bioCol}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Bio />
        </motion.div>
        <motion.div
          className={styles.termCol}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: 'easeOut' }}
        >
          <HeroTerminal />
        </motion.div>
      </section>

      <section className={styles.section}>
        <motion.div
          className={widgetStyles.rowHeader}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        >
          <span className={widgetStyles.rowKicker}>
            <span className={widgetStyles.rowKickerDot} />
            Live
          </span>
          <span className={widgetStyles.rowHint}>updates as I work</span>
        </motion.div>
        <div className={widgetStyles.row}>
          {widgets.map(({ Component, key }, i) => (
            <motion.div
              key={key}
              className={widgetStyles.cell}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 + i * 0.07, ease: 'easeOut' }}
              whileHover={{ y: -3 }}
            >
              <Component />
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}
