import { motion } from 'framer-motion'
import { profile } from '../../content/profile'
import { skills } from '../../content/skills'
import styles from './sections.module.css'
import aboutStyles from '../../routes/About.module.css'

export function AboutSection({ standalone = false }: { standalone?: boolean }) {
  return (
    <section className={styles.section} id="about">
      {!standalone && <SectionHeading kicker="01 / About" title="Who I am" />}
      <motion.div
        className={aboutStyles.layout}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className={aboutStyles.avatar} aria-label="Profile photo placeholder">
          <span>V</span>
        </div>
        <div className={aboutStyles.bio}>
          {profile.about.map((para) => (
            <p key={para.slice(0, 32)}>{para}</p>
          ))}
          <div className={aboutStyles.contactRow}>
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

      <motion.div
        className={aboutStyles.skillBlock}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
      >
        <h3>Skills</h3>
        {skills.map((cat) => (
          <div key={cat.category} className={aboutStyles.skillCategory}>
            <div className={aboutStyles.skillLabel}>{cat.category}</div>
            <div className={aboutStyles.chips}>
              {cat.skills.map((s) => (
                <span key={s} className={aboutStyles.chip}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  )
}

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <header className={styles.heading}>
      <span className={styles.kicker}>{kicker}</span>
      <h2 className={styles.title}>{title}</h2>
    </header>
  )
}
