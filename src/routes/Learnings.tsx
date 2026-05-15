import { Link } from 'react-router-dom'
import styles from './Page.module.css'

const tracks = [
  { slug: 'system-design', title: 'System Design', desc: 'Hands-on infra & architecture studies (AWS Batch, Lambda, URL Shortener).' },
  { slug: 'frontend', title: 'Frontend', desc: 'State management patterns, side effects, predictable UIs.' },
  { slug: 'dsa', title: 'Data Structures & Algorithms', desc: '13 topics, Python practice with curated patterns.' },
  { slug: 'leetcode', title: 'LeetCode Practice', desc: '16 problem categories with priority rankings and study phases.' },
]

export default function Learnings() {
  return (
    <div className={styles.container}>
      <div className={styles.tag}>Learnings</div>
      <h1 className={styles.title}>What I'm studying</h1>
      <p className={styles.summary}>
        Notes, code excerpts, and architecture diagrams from ongoing practice. Click a track to dive
        in.
      </p>
      <div className={styles.divider} />
      <ul style={{ display: 'grid', gap: 'var(--sp-3)' }}>
        {tracks.map((t) => (
          <li key={t.slug}>
            <Link
              to={`/learnings/${t.slug}`}
              style={{
                display: 'block',
                padding: 'var(--sp-5)',
                background: 'var(--white)',
                border: '1px solid var(--gray-300)',
                borderRadius: 'var(--r-md)',
                transition: 'transform var(--transition), border-color var(--transition)',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  color: 'var(--clay)',
                  marginBottom: 'var(--sp-2)',
                }}
              >
                {t.slug}
              </div>
              <div style={{ fontSize: '17px', fontWeight: 500, marginBottom: 'var(--sp-2)' }}>
                {t.title}
              </div>
              <p style={{ fontSize: '14px', color: 'var(--gray-700)' }}>{t.desc}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
