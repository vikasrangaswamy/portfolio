import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import Fuse from 'fuse.js'
import { useTheme } from '../../lib/useTheme'
import { useSound } from '../../lib/sound'
import { searchRecords, type SearchRecord, type SearchKind } from '../../lib/searchIndex'
import styles from './CommandPalette.module.css'

type Item = SearchRecord & { run?: () => void }

const isMac =
  typeof navigator !== 'undefined' && /mac/i.test(navigator.platform || navigator.userAgent)

export const COMMAND_PALETTE_EVENT = 'open-command-palette'

// Default list shown before the user types — the most common jumps.
const DEFAULT_IDS = ['page:/about', 'page:/projects', 'page:/experience', 'page:/learnings/leetcode']

const KIND_LABEL: Record<SearchKind, string> = {
  Page: 'page',
  Project: 'project',
  Experience: 'experience',
  Topic: 'topic',
  Skill: 'skill',
  Action: 'action',
  External: 'link ↗',
}

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

  // All searchable items = content records + the two runtime actions.
  const items = useMemo<Item[]>(() => {
    const actions: Item[] = [
      { id: 'action:theme', kind: 'Action', title: 'Toggle theme', keywords: 'dark light mode appearance', to: '', run: toggleTheme },
      { id: 'action:sound', kind: 'Action', title: 'Toggle sound', keywords: 'mute audio click', to: '', run: toggleMute },
    ]
    return [...searchRecords, ...actions]
  }, [toggleTheme, toggleMute])

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: [
          { name: 'title', weight: 0.6 },
          { name: 'keywords', weight: 0.3 },
          { name: 'subtitle', weight: 0.1 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 1,
      }),
    [items],
  )

  const results = useMemo<Item[]>(() => {
    const q = query.trim()
    if (!q) {
      const defaults = DEFAULT_IDS.map((id) => items.find((it) => it.id === id)).filter(
        (x): x is Item => Boolean(x),
      )
      const actions = items.filter((it) => it.kind === 'Action')
      return [...defaults, ...actions]
    }
    return fuse.search(q).map((r) => r.item).slice(0, 24)
  }, [query, fuse, items])

  const runItem = useCallback(
    (item: Item) => {
      close()
      if (item.run) item.run()
      else if (item.kind === 'External') window.open(item.to, '_blank', 'noreferrer')
      else navigate(item.to)
    },
    [close, navigate],
  )

  // Global open shortcut: Cmd/Ctrl+K, or "/" when not typing.
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

  useEffect(() => {
    if (open) {
      setSelected(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    setSelected((s) => Math.min(s, Math.max(0, results.length - 1)))
  }, [results.length])

  // Keep the active row scrolled into view.
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const active = list.querySelector('[data-active="true"]')
    if (active instanceof HTMLElement) active.scrollIntoView({ block: 'nearest' })
  }, [selected])

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
      const item = results[selected]
      if (item) runItem(item)
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
        aria-label="Search"
      >
        <div className={styles.inputRow}>
          <span className={styles.prompt}>&gt;</span>
          <input
            ref={inputRef}
            className={styles.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search skills, projects, experience…"
            spellCheck={false}
            autoComplete="off"
          />
          <kbd className={styles.escHint}>esc</kbd>
        </div>

        <ul className={styles.list} ref={listRef}>
          {results.length === 0 && <li className={styles.empty}>No matches for &ldquo;{query}&rdquo;</li>}
          {results.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                data-active={i === selected}
                className={`${styles.item} ${i === selected ? styles.itemActive : ''}`}
                onMouseEnter={() => setSelected(i)}
                onClick={() => runItem(item)}
                data-no-sound
              >
                <span className={styles.itemMain}>
                  <span className={styles.itemLabel}>{item.title}</span>
                  {item.subtitle && <span className={styles.itemSub}>{item.subtitle}</span>}
                </span>
                <span className={`${styles.chip} ${styles[`chip-${item.kind}`]}`}>
                  {KIND_LABEL[item.kind]}
                </span>
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
