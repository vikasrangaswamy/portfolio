import { useRef, useState, type ReactNode } from 'react'
import styles from './CodeBlock.module.css'

type PreProps = {
  children?: ReactNode
  /** Added by rehype-pretty-code (e.g. "ts", "yaml", "python"). */
  ['data-language']?: string
  /** rehype-pretty-code adds `data-rehype-pretty-code-figure` to its wrapper;
   *  the inner pre also gets `data-theme`. We just pass everything through. */
} & Record<string, unknown>

const LANGUAGE_LABELS: Record<string, string> = {
  ts: 'TypeScript',
  tsx: 'TSX',
  js: 'JavaScript',
  jsx: 'JSX',
  py: 'Python',
  python: 'Python',
  sh: 'Shell',
  bash: 'Bash',
  yaml: 'YAML',
  yml: 'YAML',
  json: 'JSON',
  css: 'CSS',
  html: 'HTML',
  mdx: 'MDX',
  md: 'Markdown',
  sql: 'SQL',
  graphql: 'GraphQL',
  plaintext: '',
  text: '',
}

/**
 * Replacement for the default <pre> in MDX content. Wraps the syntax-
 * highlighted <pre> from rehype-pretty-code with a header bar that shows the
 * language label and a copy-to-clipboard button. Dark surface regardless of
 * site theme — matches docs/platform UX where code stays in a dark "terminal"
 * style even on a light page.
 */
export function CodeBlock(props: PreProps) {
  const lang = (props['data-language'] as string | undefined) ?? ''
  const label = LANGUAGE_LABELS[lang] ?? lang.toUpperCase()
  const preRef = useRef<HTMLPreElement | null>(null)
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    const text = preRef.current?.innerText ?? ''
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // ignore — older browser / blocked permission
    }
  }

  return (
    <div className={styles.figure}>
      <div className={styles.header}>
        {label && <span className={styles.lang}>{label}</span>}
        <button
          type="button"
          className={styles.copy}
          onClick={onCopy}
          data-no-sound
          aria-label={copied ? 'Copied' : 'Copy code'}
          title={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>
      <pre ref={preRef} className={styles.pre} {...props} />
    </div>
  )
}
