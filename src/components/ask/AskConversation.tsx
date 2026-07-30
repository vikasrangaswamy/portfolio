import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { ASK_GREETING, ASK_SUGGESTIONS, ASK_TOPICS } from '../../lib/askConfig'
import type { Turn } from '../../lib/useAsk'
import { useTypedPlaceholder } from '../../lib/useTypedPlaceholder'
import styles from './AskConversation.module.css'

// Turn URLs and emails in an answer into clickable links — so the fallback
// "reach out to Vikas" contacts the bot emits are tappable.
const LINK_RE = /(https?:\/\/[^\s]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g

function renderWithLinks(text: string): ReactNode[] {
  return text.split(LINK_RE).map((part, i) => {
    if (!part) return null
    if (/^https?:\/\//.test(part)) {
      const href = part.replace(/[.,;:)]+$/, '')
      return (
        <a key={i} href={href} target="_blank" rel="noreferrer" className={styles.answerLink}>
          {href}
        </a>
      )
    }
    if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(part)) {
      return (
        <a key={i} href={`mailto:${part}`} className={styles.answerLink}>
          {part}
        </a>
      )
    }
    return <span key={i}>{part}</span>
  })
}

type Props = {
  turns: Turn[]
  busy: boolean
  ask: (q: string) => Promise<void> | void
  /** Focus the input on mount (modal) — off for the always-present hero embed. */
  autoFocus?: boolean
  /** Greeting shown above the starter chips before the first question. */
  greeting?: string
  /** Rich intro node (e.g. the hero identity) shown in place of the greeting. */
  intro?: ReactNode
}

/**
 * The shared transcript + starter chips + input row. Presentational: state and
 * streaming live in the `useAsk` hook, passed in so the modal and the embedded
 * hero terminal share one implementation. The surrounding chrome (window dots,
 * close button, panel framing) is the caller's responsibility.
 */
export function AskConversation({ turns, busy, ask, autoFocus = false, greeting, intro }: Props) {
  const [input, setInput] = useState('')
  const [focused, setFocused] = useState(false)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const bodyRef = useRef<HTMLDivElement | null>(null)

  // Answers are shareable: `?q=…` replays the question for whoever opens the
  // link (see AskTerminal). Offer the link once there's something to share.
  const firstQuestion = turns.find((t) => t.role === 'user')?.text
  const copyLink = async () => {
    if (!firstQuestion) return
    const url = `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(firstQuestion)}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard blocked (permissions, or a non-secure context) — the button
      // just doesn't confirm rather than throwing at the visitor.
    }
  }

  // Cycle the starter questions as a self-typing placeholder while the input is
  // idle and empty before the first question. Once chatting (or focused), drop
  // to a plain prompt so it isn't distracting.
  const cycling = turns.length === 0 && !busy && !focused && input.length === 0
  const typed = useTypedPlaceholder(ASK_SUGGESTIONS, cycling)
  const placeholder = busy
    ? 'Thinking…'
    : cycling
      ? `${typed}▏`
      : turns.length > 0
        ? 'Ask a follow-up…'
        : 'Ask a question…'

  useEffect(() => {
    if (autoFocus) requestAnimationFrame(() => inputRef.current?.focus())
  }, [autoFocus])

  // Autoscroll the transcript as it streams. Two guards: don't run before the
  // first question (it would scroll the greeting out of view on short panels),
  // and don't yank the view down if the reader has scrolled back up to re-read
  // an earlier answer.
  useEffect(() => {
    const body = bodyRef.current
    if (!body || turns.length === 0) return
    const distanceFromBottom = body.scrollHeight - body.scrollTop - body.clientHeight
    if (distanceFromBottom > 80) return
    body.scrollTo({ top: body.scrollHeight })
  }, [turns])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = input
    setInput('')
    void ask(q)
  }

  return (
    <>
      <div className={styles.body} ref={bodyRef}>
        {turns.length === 0 ? (
          <div className={styles.intro}>
            {intro ?? <p className={styles.greetLine}>{greeting ?? ASK_GREETING}</p>}
            <p className={styles.topicsLabel}>Try asking:</p>
            <div className={styles.topics}>
              {ASK_TOPICS.map((q) => (
                <button
                  key={q}
                  type="button"
                  className={styles.topicChip}
                  onClick={() => void ask(q)}
                  disabled={busy}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          turns.map((turn, i) => (
            <div key={i} className={styles.turn}>
              {turn.role === 'user' ? (
                <div className={styles.userLine}>
                  <span className={styles.prompt}>&gt;</span>
                  <span>{turn.text}</span>
                </div>
              ) : (
                <div className={`${styles.answer} ${turn.error ? styles.answerError : ''}`}>
                  {turn.text ? renderWithLinks(turn.text) : <span className={styles.cursor} />}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <form className={styles.inputRow} onSubmit={onSubmit}>
        <span className={styles.prompt}>&gt;</span>
        <input
          ref={inputRef}
          className={styles.input}
          name="q"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          maxLength={500}
          spellCheck={false}
          autoComplete="off"
          disabled={busy}
        />
        <button
          type="submit"
          className={styles.send}
          aria-label="Send"
          disabled={busy || input.trim().length === 0}
        >
          ↵
        </button>
      </form>

      <div className={styles.footer}>
        <span>AI-generated from this portfolio — may be imperfect.</span>
        {firstQuestion && (
          <button type="button" className={styles.shareBtn} onClick={copyLink} data-no-sound>
            {copied ? 'link copied' : 'copy link'}
          </button>
        )}
      </div>
    </>
  )
}
