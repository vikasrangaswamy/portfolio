import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { profile } from '../../content/profile'
import { useTheme } from '../../lib/useTheme'
import { useSound } from '../../lib/sound'
import styles from './CommandPalette.module.css'

type Command = {
  id: string
  label: string
  hint: string
  keywords?: string
  run: () => void
}

const isMac =
  typeof navigator !== 'undefined' && /mac/i.test(navigator.platform || navigator.userAgent)

export const COMMAND_PALETTE_EVENT = 'open-command-palette'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const listRef = useRef<HTMLUListElement | null>(null)
  const navigate = useNavigate()
  const { toggle: toggleTheme } = useTheme()
  const { toggleMute } = useSound()

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
    setSelected(0)
  }, [])

  const commands = useMemo<Command[]>(() => {
    const go = (to: string) => () => {
      close()
      navigate(to)
    }
    const ext = (url: string) => () => {
      close()
      window.open(url, '_blank', 'noreferrer')
    }
    return [
      { id: 'home', label: 'Home', hint: 'page', keywords: 'start landing', run: go('/') },
      { id: 'about', label: 'About', hint: 'page', keywords: 'bio skills', run: go('/about') },
      { id: 'experience', label: 'Experience', hint: 'page', keywords: 'work jobs roles', run: go('/experience') },
      { id: 'projects', label: 'Projects', hint: 'page', keywords: 'trading mt5 work', run: go('/projects') },
      { id: 'learnings', label: 'Learnings', hint: 'page', keywords: 'notes study', run: go('/learnings') },
      { id: 'system-design', label: 'System Design', hint: 'page', keywords: 'aws architecture', run: go('/learnings/system-design') },
      { id: 'leetcode', label: 'LeetCode', hint: 'page', keywords: 'dsa problems stats heatmap', run: go('/learnings/leetcode') },
      { id: 'colophon', label: 'Colophon', hint: 'page', keywords: 'how built meta', run: go('/colophon') },
      { id: 'theme', label: 'Toggle theme', hint: 'action', keywords: 'dark light mode', run: () => { close(); toggleTheme() } },
      { id: 'sound', label: 'Toggle sound', hint: 'action', keywords: 'mute audio', run: () => { close(); toggleMute() } },
      { id: 'github', label: 'GitHub', hint: 'external ↗', keywords: 'code repos', run: ext(profile.github) },
      ...(profile.linkedin
        ? [{ id: 'linkedin', label: 'LinkedIn', hint: 'external ↗', keywords: 'contact connect', run: ext(profile.linkedin) }]
        : []),
    ]
  }, [navigate, close, toggleTheme, toggleMute])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || (c.keywords ?? '').includes(q),
    )
  }, [query, commands])

  // Global open shortcut: Cmd/Ctrl+K or "/" (when not already typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      const mod = e.metaKey || e.ctrlKey
      if (mod && k === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
        return
      }
      if (!open && k === '/') {
        const el = document.activeElement
        const typing =
          el instanceof HTMLInputElement ||
          el instanceof HTMLTextAreaElement ||
          (el instanceof HTMLElement && el.isContentEditable)
        if (!typing) {
          e.preventDefault()
          setOpen(true)
        }
      }
    }
    const onOpenEvent = () => setOpen(true)
    document.addEventListener('keydown', onKey)
    window.addEventListener(COMMAND_PALETTE_EVENT, onOpenEvent)
    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener(COMMAND_PALETTE_EVENT, onOpenEvent)
    }
  }, [open])

  // Focus the input + reset when opened.
  useEffect(() => {
    if (open) {
      setSelected(0)
      // defer so the element exists
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  // Keep selection in range as results shrink.
  useEffect(() => {
    setSelected((s) => Math.min(s, Math.max(0, results.length - 1)))
  }, [results.length])

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((s) => Math.min(s + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((s) => Math.max(s - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      results[selected]?.run()
    }
  }

  if (!open) return null

  return createPortal(
    <div className={styles.overlay} onMouseDown={close} role="presentation">
      <div
        className={styles.panel}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div className={styles.inputRow}>
          <span className={styles.prompt}>&gt;</span>
          <input
            ref={inputRef}
            className={styles.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Jump to… (type to filter)"
            spellCheck={false}
            autoComplete="off"
          />
          <kbd className={styles.escHint}>esc</kbd>
        </div>

        <ul className={styles.list} ref={listRef}>
          {results.length === 0 && <li className={styles.empty}>No matches</li>}
          {results.map((c, i) => (
            <li key={c.id}>
              <button
                type="button"
                className={`${styles.item} ${i === selected ? styles.itemActive : ''}`}
                onMouseEnter={() => setSelected(i)}
                onClick={c.run}
                data-no-sound
              >
                <span className={styles.itemLabel}>{c.label}</span>
                <span className={styles.itemHint}>{c.hint}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className={styles.footer}>
          <span><kbd className={styles.k}>↑</kbd><kbd className={styles.k}>↓</kbd> navigate</span>
          <span><kbd className={styles.k}>↵</kbd> open</span>
          <span><kbd className={styles.k}>{isMac ? '⌘' : 'ctrl'}</kbd><kbd className={styles.k}>K</kbd> toggle</span>
        </div>
      </div>
    </div>,
    document.body,
  )
}
