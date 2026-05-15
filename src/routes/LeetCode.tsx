import { Link, useParams } from 'react-router-dom'
import { categories, extraProblems } from '../content/learnings/leetcode'
import pageStyles from './Page.module.css'
import learningStyles from '../components/learnings/LearningPage.module.css'
import NotFound from './NotFound'

const solvedCount = categories.reduce(
  (sum, c) => sum + c.problems.filter((p) => p.solution).length,
  0,
) + extraProblems.length

const totalProblems = categories.reduce((sum, c) => sum + c.problems.length, 0)

export function LeetCodeIndex() {
  return (
    <div className={pageStyles.container}>
      <div className={pageStyles.tag}>Learnings · LeetCode</div>
      <h1 className={pageStyles.title}>LeetCode Practice</h1>
      <p className={pageStyles.summary}>
        {categories.length} problem categories with priority-ranked must-do lists. {solvedCount}{' '}
        solved so far out of {totalProblems} tracked.
      </p>
      <div className={pageStyles.divider} />
      <ul style={{ display: 'grid', gap: 'var(--sp-3)' }}>
        {categories.map((cat) => {
          const solved = cat.problems.filter((p) => p.solution).length
          return (
            <li key={cat.slug}>
              <Link
                to={`/learnings/leetcode/${cat.slug}`}
                style={{
                  display: 'block',
                  padding: 'var(--sp-5)',
                  background: 'var(--white)',
                  border: '1px solid var(--gray-300)',
                  borderRadius: 'var(--r-md)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: 'var(--sp-2)',
                  }}
                >
                  <span style={{ fontSize: 17, fontWeight: 500, color: 'var(--slate)' }}>
                    {cat.title}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                    {cat.problems.length} problems
                    {solved > 0 && <> · {solved} solved</>}
                  </span>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>

      {extraProblems.length > 0 && (
        <>
          <h2 style={{ marginTop: 'var(--sp-7)', fontSize: 18, fontWeight: 500 }}>Extras</h2>
          <p style={{ fontSize: 14, color: 'var(--gray-700)', marginBottom: 'var(--sp-4)' }}>
            Standalone writeups that don't belong to any specific category index.
          </p>
          <ul style={{ display: 'grid', gap: 'var(--sp-3)' }}>
            {extraProblems.map((p) => (
              <li key={p.slug}>
                <Link
                  to={`/learnings/leetcode/problem/${p.slug}`}
                  style={{
                    display: 'block',
                    padding: 'var(--sp-4)',
                    background: 'var(--white)',
                    border: '1px solid var(--gray-300)',
                    borderRadius: 'var(--r-md)',
                  }}
                >
                  <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--slate)' }}>
                    {p.title}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--gray-700)', marginTop: 'var(--sp-1)' }}>
                    {p.summary}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export function LeetCodeCategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const cat = categories.find((c) => c.slug === slug)
  if (!cat) return <NotFound />

  return (
    <div className={pageStyles.container}>
      <div className={learningStyles.header}>
        <div className={learningStyles.tagRow}>
          <span className={learningStyles.track}>LeetCode</span>
          <Link to="/learnings/leetcode" className={learningStyles.backLink}>
            ← Back to LeetCode
          </Link>
        </div>
        <h1 className={learningStyles.title}>{cat.title}</h1>
        <p className={learningStyles.summary}>{cat.problems.length} curated problems, priority-ranked.</p>
      </div>

      {cat.note && (
        <div
          style={{
            padding: 'var(--sp-4)',
            background: 'var(--gray-100)',
            borderLeft: '3px solid var(--clay)',
            borderRadius: 'var(--r-sm)',
            fontSize: 14,
            color: 'var(--gray-700)',
            lineHeight: 1.6,
            margin: 'var(--sp-4) 0',
          }}
          dangerouslySetInnerHTML={{ __html: simpleMd(cat.note) }}
        />
      )}

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 14,
          marginTop: 'var(--sp-4)',
          background: 'var(--white)',
          border: '1px solid var(--gray-300)',
          borderRadius: 'var(--r-md)',
          overflow: 'hidden',
        }}
      >
        <thead>
          <tr style={{ background: 'var(--gray-100)' }}>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Problem</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {cat.problems.map((p) => (
            <tr
              key={`${p.priority}-${p.leetcodeSlug}`}
              style={{ borderTop: '1px solid var(--gray-300)' }}
            >
              <td style={tdStyle}>{p.priority}</td>
              <td style={{ ...tdStyle, color: 'var(--clay)', fontSize: 12 }}>{p.type}</td>
              <td style={tdStyle}>
                <a
                  href={`https://leetcode.com/problems/${p.leetcodeSlug}/`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: 'var(--slate)' }}
                >
                  {p.name} ↗
                </a>
              </td>
              <td style={{ ...tdStyle, textAlign: 'right' }}>
                {p.solution && (
                  <Link
                    to={`/learnings/leetcode/problem/${p.solution.slug}`}
                    style={{
                      fontSize: 12,
                      color: 'var(--clay)',
                      fontWeight: 500,
                    }}
                  >
                    My solution →
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function LeetCodeProblemPage() {
  const { slug } = useParams<{ slug: string }>()

  // Search both category-attached solutions and standalone extras
  for (const cat of categories) {
    for (const p of cat.problems) {
      const solution = p.solution
      if (solution && solution.slug === slug) {
        return renderProblem(p.name, `LeetCode · ${cat.title}`, solution.component)
      }
    }
  }
  const extra = extraProblems.find((p) => p.slug === slug)
  if (extra) return renderProblem(extra.title, 'LeetCode · Extras', extra.component)

  return <NotFound />
}

function renderProblem(title: string, track: string, Body: React.ComponentType) {
  return (
    <div className={pageStyles.container}>
      <div className={learningStyles.header}>
        <div className={learningStyles.tagRow}>
          <span className={learningStyles.track}>{track}</span>
          <Link to="/learnings/leetcode" className={learningStyles.backLink}>
            ← Back to LeetCode
          </Link>
        </div>
        <h1 className={learningStyles.title}>{title}</h1>
      </div>
      <div className={learningStyles.body}>
        <Body />
      </div>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: 'var(--sp-3) var(--sp-4)',
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  color: 'var(--gray-500)',
  fontWeight: 500,
}

const tdStyle: React.CSSProperties = {
  padding: 'var(--sp-3) var(--sp-4)',
  fontSize: 14,
  color: 'var(--gray-700)',
}

// Minimal **bold** + `code` → HTML for the category note (the note is trusted authored content).
function simpleMd(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; background: var(--white); padding: 2px 6px; border-radius: 4px; color: var(--slate);">$1</code>')
}
