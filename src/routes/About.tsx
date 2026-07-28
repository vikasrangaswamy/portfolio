import { useState } from 'react'
import { motion } from 'framer-motion'
import { entranceFrom } from '../lib/entrance'
import { profile } from '../content/profile'
import { skills } from '../content/skills'
import { PageHeader } from '../components/layout/PageHeader'
import pageStyles from './Page.module.css'
import styles from './About.module.css'

// Served from /public; resolves under the app's base path. Optimized 840×560
// grayscale derivatives of the source photo (WebP preferred, JPG fallback). If
// neither loads, we fall back to the initial-letter placeholder.
const AVATAR_WEBP = `${import.meta.env.BASE_URL}profile.webp`
const AVATAR_JPG = `${import.meta.env.BASE_URL}profile.jpg`

export default function About() {
  const [avatarFailed, setAvatarFailed] = useState(false)

  return (
    <div className={pageStyles.container}>
      <PageHeader
        tag="About"
        title={profile.name}
        summary={`${profile.role} · ${profile.company} · ${profile.location}`}
      />

      <motion.div
        className={styles.layout}
        initial={entranceFrom({ opacity: 0, y: 12 })}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15, ease: 'easeOut' }}
      >
        <div className={styles.sidebar}>
          <div className={styles.photo}>
            {avatarFailed ? (
              <span aria-label="Profile photo placeholder">V</span>
            ) : (
              <picture>
                <source srcSet={AVATAR_WEBP} type="image/webp" />
                <img
                  src={AVATAR_JPG}
                  alt={`${profile.name} — profile photo`}
                  width={1536}
                  height={1024}
                  loading="lazy"
                  decoding="async"
                  onError={() => setAvatarFailed(true)}
                />
              </picture>
            )}
          </div>
          <nav className={styles.contactRow} aria-label="Contact and social links">
            <a href={`mailto:${profile.email}`}>Email</a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            )}
            {profile.instagram && (
              <a href={profile.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            )}
          </nav>
        </div>
        <div className={styles.bio}>
          {profile.about.map((para) => (
            <p key={para.slice(0, 32)}>{para}</p>
          ))}
        </div>
      </motion.div>

      <motion.section
        className={styles.skillBlock}
        initial={entranceFrom({ opacity: 0, y: 12 })}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.25, ease: 'easeOut' }}
      >
        <h2>Skills</h2>
        <dl className={styles.skillRows}>
          {skills.map((cat) => (
            <div key={cat.category} className={styles.skillRow}>
              <dt className={styles.skillCat}>{cat.category}</dt>
              <dd className={styles.skillVals}>{cat.skills.join('  ·  ')}</dd>
            </div>
          ))}
        </dl>
      </motion.section>
    </div>
  )
}
