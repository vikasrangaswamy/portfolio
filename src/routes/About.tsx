import { profile } from '../content/profile'
import { skills } from '../content/skills'
import pageStyles from './Page.module.css'
import styles from './About.module.css'

export default function About() {
  return (
    <div className={pageStyles.container}>
      <div className={pageStyles.tag}>About</div>
      <h1 className={pageStyles.title}>{profile.name}</h1>
      <p className={pageStyles.summary}>
        {profile.role} · {profile.company}
      </p>
      <div className={pageStyles.divider} />

      <div className={styles.layout}>
        <div className={styles.avatar} aria-label="Profile photo placeholder">
          {/* DUMMY — add public/avatar.jpg per NEEDS-FROM-USER.md #1 */}
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
      </div>

      <section className={styles.skillBlock}>
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
      </section>
    </div>
  )
}
