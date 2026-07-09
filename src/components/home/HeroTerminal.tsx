import { useAsk } from '../../lib/useAsk'
import { AskConversation } from '../ask/AskConversation'
import styles from './HeroTerminal.module.css'

/**
 * The right pane of the home page: an always-on, live AI terminal embedded
 * directly in the layout (not a modal). Visitors can ask without clicking
 * anything. Shares the chat engine + transcript UI with the modal.
 */
export function HeroTerminal() {
  const chat = useAsk()

  // Reflect real health: if the most recent assistant turn is an error, the
  // backend isn't answering — show an honest "offline" badge instead of a lit
  // "live" one. (While a request is in flight we keep "live".)
  const lastAssistant = [...chat.turns].reverse().find((t) => t.role === 'assistant')
  const offline = !chat.busy && !!lastAssistant?.error

  return (
    <div className={styles.window}>
      <div className={styles.titlebar}>
        <span className={styles.dot} data-c="red" />
        <span className={styles.dot} data-c="amber" />
        <span className={styles.dot} data-c="green" />
        <span className={styles.title}>ask · vikas's assistant</span>
        <span className={`${styles.live} ${offline ? styles.offline : ''}`}>
          <span
            className={offline ? styles.offlineDot : styles.liveDot}
            aria-hidden="true"
          />
          {offline ? 'offline' : 'live'}
        </span>
      </div>

      <AskConversation turns={chat.turns} busy={chat.busy} ask={chat.ask} />
    </div>
  )
}
