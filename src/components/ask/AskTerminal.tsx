import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ASK_TERMINAL_EVENT } from '../../lib/askConfig'
import { useAsk } from '../../lib/useAsk'
import { AskConversation } from './AskConversation'
import styles from './AskTerminal.module.css'

/**
 * Modal "ask" terminal — used by the nav bar and from non-home pages (the home
 * page has its own always-on embedded terminal). Shares the chat engine and
 * transcript UI with the embed via useAsk + AskConversation.
 */
export function AskTerminal() {
  const [open, setOpen] = useState(false)
  const chat = useAsk()
  const askRef = useRef<(q: string) => Promise<void> | void>(() => {})
  askRef.current = chat.ask

  const close = useCallback(() => setOpen(false), [])

  // Open via the global event (nav bar). The event may carry a seeded question
  // (typed in the nav bar) which we ask immediately. Esc closes.
  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true)
      const q = (e as CustomEvent<{ question?: string } | undefined>).detail?.question
      if (q) requestAnimationFrame(() => askRef.current(q))
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener(ASK_TERMINAL_EVENT, onOpen)
    document.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener(ASK_TERMINAL_EVENT, onOpen)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  if (!open) return null

  return createPortal(
    <div className={styles.overlay} onMouseDown={close} role="presentation">
      <div
        className={styles.panel}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Ask about Vikas"
      >
        <div className={styles.titlebar}>
          <span className={styles.dotRed} />
          <span className={styles.dotAmber} />
          <span className={styles.dotGreen} />
          <span className={styles.title}>ask · vikas's assistant</span>
          <button
            type="button"
            className={styles.close}
            onClick={close}
            data-no-sound
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <AskConversation turns={chat.turns} busy={chat.busy} ask={chat.ask} autoFocus />
      </div>
    </div>,
    document.body,
  )
}
