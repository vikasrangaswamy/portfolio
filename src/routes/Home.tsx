import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { profile } from '../content/profile'
import { AboutSection } from '../components/sections/AboutSection'
import { ExperienceSection } from '../components/sections/ExperienceSection'
import { ProjectsSection } from '../components/sections/ProjectsSection'
import { LearningsSection } from '../components/sections/LearningsSection'
import styles from './Home.module.css'

export default function Home() {
  return (
    <>
      <motion.section
        className={styles.hero}
        id="top"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className={styles.heroTag}>Portfolio</div>
        <h1 className={styles.heroTitle}>{profile.name}</h1>
        <div className={styles.heroRole}>
          {profile.role} · {profile.company}
        </div>
        <p className={styles.heroDescription}>{profile.tagline}</p>
        <div className={styles.heroActions}>
          <Link to="/#projects" className={styles.btnPrimary}>
            See projects →
          </Link>
          <a href={profile.resumeUrl} className={styles.btnSecondary} target="_blank" rel="noreferrer">
            Resume
          </a>
        </div>
      </motion.section>

      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <LearningsSection />
    </>
  )
}
