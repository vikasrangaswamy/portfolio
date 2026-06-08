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

  return (
    <div className={styles.window}>
      <div className={styles.titlebar}>
        <span className={styles.dot} data-c="red" />
        <span className={styles.dot} data-c="amber" />
        <span className={styles.dot} data-c="green" />
        <span className={styles.title}>ask · vikas's assistant</span>
        <span className={styles.live}>
          <span className={styles.liveDot} aria-hidden="true" />
          live
        </span>
      </div>

      <AskConversation turns={chat.turns} busy={chat.busy} ask={chat.ask} />
    </div>
  )
}
