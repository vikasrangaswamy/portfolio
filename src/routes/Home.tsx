import { Link } from 'react-router-dom'
import { profile } from '../content/profile'
import styles from './Home.module.css'

const learningTracks = [
  {
    icon: '🏗️',
    subtitle: 'System Design',
    title: 'AWS Batch, Lambda, URL Shortener',
    desc: 'Hands-on exercises in queueing, serverless, and scaling a URL shortener with Redis.',
    href: '/learnings/system-design',
    stagger: 'cardStagger1' as const,
  },
  {
    icon: '⚛️',
    subtitle: 'Frontend',
    title: 'Redux Saga & state patterns',
    desc: 'Side-effect handling, saga patterns, and predictable client-side flows.',
    href: '/learnings/frontend',
    stagger: 'cardStagger2' as const,
  },
  {
    icon: '🧩',
    subtitle: 'DSA',
    title: 'Data Structures & Algorithms',
    desc: '13 topics in Python — arrays, trees, graphs, backtracking, and more.',
    href: '/learnings/dsa',
    stagger: 'cardStagger3' as const,
  },
  {
    icon: '💡',
    subtitle: 'LeetCode',
    title: 'Problem Practice Guide',
    desc: '16 categories with curated problems, study phases, and priority rankings.',
    href: '/learnings/leetcode',
    stagger: 'cardStagger4' as const,
  },
]

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroTag}>Portfolio</div>
        <h1 className={styles.heroTitle}>{profile.name}</h1>
        <div className={styles.heroRole}>
          {profile.role} · {profile.company}
        </div>
        <p className={styles.heroDescription}>{profile.tagline}</p>
        <div className={styles.heroActions}>
          <Link to="/learnings" className={styles.btnPrimary}>
            Browse Learnings →
          </Link>
          <a href={profile.resumeUrl} className={styles.btnSecondary} target="_blank" rel="noreferrer">
            Resume
          </a>
        </div>
      </section>

      <div className={styles.divider}>
        <div className={styles.dividerLine} />
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Currently learning</h2>
          <Link to="/learnings" className={styles.sectionLink}>
            All learnings →
          </Link>
        </div>
        <div className={styles.cardsGrid}>
          {learningTracks.map((track) => (
            <Link key={track.href} to={track.href} className={`${styles.card} ${styles[track.stagger]}`}>
              <span className={styles.cardIcon}>{track.icon}</span>
              <div className={styles.cardSubtitle}>{track.subtitle}</div>
              <div className={styles.cardTitle}>{track.title}</div>
              <p className={styles.cardDesc}>{track.desc}</p>
              <div className={styles.cardArrow}>→</div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Projects</h2>
          <Link to="/projects" className={styles.sectionLink}>
            View all →
          </Link>
        </div>
        <div className={styles.placeholderBanner}>
          Real-world projects coming soon. In the meantime, see the{' '}
          <Link to="/learnings">Learnings</Link> section for hands-on work.
        </div>
      </section>
    </>
  )
}
