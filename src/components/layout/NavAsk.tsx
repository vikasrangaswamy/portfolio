import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ASK_SUGGESTIONS, openAsk } from '../../lib/askConfig'
import { useTypedPlaceholder } from '../../lib/useTypedPlaceholder'
import styles from './NavAsk.module.css'

const isMac =
  typeof navigator !== 'undefined' && /mac/i.test(navigator.platform || navigator.userAgent)

/**
 * Always-visible "Ask" bar in the nav. Typing a question and pressing Enter
 * opens the AskTerminal with that question already streaming. ⌘K (or "/" when
 * not already typing) focuses the bar — inherited muscle memory from the old
 * command palette, which this replaces.
 *
 * On the home page the hero shows a prominent ask box, so this bar would be a
 * duplicate above the fold. There it stays hidden until the visitor scrolls
 * past the hero, then fades in as the persistent affordance. On every other
 * route it's shown immediately.
 */
export function NavAsk() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [revealed, setRevealed] = useState(!isHome)
  const [focused, setFocused] = useState(false)

  // Self-typing placeholder that cycles the starter questions while the bar is
  // visible and unfocused; static prompt once focused.
  const typed = useTypedPlaceholder(ASK_SUGGESTIONS, revealed && !focused)

  useEffect(() => {
    if (!isHome) {
      setRevealed(true)
      return
    }
    const update = () => setRevealed(window.scrollY > 320)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [isHome])

  useEffect(() => {
    const focusBar = () => {
      setRevealed(true)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        focusBar()
        return
      }
      if (e.key === '/') {
        const el = document.activeElement
        const typing =
          el instanceof HTMLInputElement ||
          el instanceof HTMLTextAreaElement ||
          (el instanceof HTMLElement && el.isContentEditable)
        if (!typing) {
          e.preventDefault()
          focusBar()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = inputRef.current?.value.trim()
    // Hand off to the terminal; a seeded question auto-asks there.
    openAsk(q || undefined)
    if (inputRef.current) inputRef.current.value = ''
    inputRef.current?.blur()
  }

  return (
    <form
      className={`${styles.bar} ${revealed ? '' : styles.hidden}`}
      onSubmit={onSubmit}
      role="search"
    >
      <span className={styles.prompt} aria-hidden="true">
        &gt;
      </span>
      <input
        ref={inputRef}
        className={styles.input}
        type="text"
        placeholder={focused ? 'Ask about my work…' : `${typed}▏`}
        aria-label="Ask the AI about Vikas's work"
        spellCheck={false}
        autoComplete="off"
        maxLength={500}
        tabIndex={revealed ? undefined : -1}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <kbd className={styles.hint} aria-hidden="true">
        {isMac ? '⌘K' : 'Ctrl K'}
      </kbd>
    </form>
  )
}
