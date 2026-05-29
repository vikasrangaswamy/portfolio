import { useNavigate } from 'react-router-dom'
import styles from './Widget.module.css'

type Props = {
  slug: string
  /** Short, plain-language title used in the native tooltip. */
  label?: string
}

/**
 * Small ⓘ button rendered in the top-right corner of a widget, deep-linking
 * to `/colophon/<slug>`. The widget container is itself an <a>, so this is a
 * <button> (not a nested anchor) that programmatically navigates and stops
 * the click from bubbling out to the surrounding card link.
 */
export function WidgetInfoLink({ slug, label = 'How this works' }: Props) {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      className={styles.infoButton}
      aria-label={label}
      title={label}
      data-no-sound
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        navigate(`/colophon/${slug}`)
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    </button>
  )
}
