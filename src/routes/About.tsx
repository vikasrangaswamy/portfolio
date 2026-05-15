import { motion } from 'framer-motion'
import { profile } from '../content/profile'
import { skills } from '../content/skills'
import { PageHeader } from '../components/layout/PageHeader'
import pageStyles from './Page.module.css'
import styles from './About.module.css'

export default function About() {
  return (
    <div className={pageStyles.container}>
      <PageHeader
        tag="About"
        title={profile.name}
        summary={`${profile.role} · ${profile.company} · ${profile.location}`}
      />

      <motion.div
        className={styles.layout}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15, ease: 'easeOut' }}
      >
        <div className={styles.avatar} aria-label="Profile photo placeholder">
          <span>V</span>
        </div>
        <div className={styles.bio}>
          {profile.about.map((para) => (
            <p key={para.slice(0, 32)}>{para}</p>
          ))}
          <div className={styles.contactRow}>
            <a href={`mailto:${profile.email}`}>Email</a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            )}
            <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
              Resume
            </a>
          </div>
        </div>
      </motion.div>

      <motion.section
        className={styles.skillBlock}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.25, ease: 'easeOut' }}
      >
        <h2>Skills</h2>
        {skills.map((cat) => (
          <div key={cat.category} className={styles.skillCategory}>
            <div className={styles.skillLabel}>{cat.category}</div>
            <div className={styles.chips}>
              {cat.skills.map((s) => (
                <span key={s} className={styles.chip}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </motion.section>
    </div>
  )
}
