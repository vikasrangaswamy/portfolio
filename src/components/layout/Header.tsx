import { NavLink, Link } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { SoundToggle } from './SoundToggle'
import { COMMAND_PALETTE_EVENT } from '../command/CommandPalette'
import styles from './Header.module.css'

const isMac =
  typeof navigator !== 'undefined' && /mac/i.test(navigator.platform || navigator.userAgent)

const navItems = [
  { to: '/about', label: 'About' },
  { to: '/experience', label: 'Experience' },
  { to: '/projects', label: 'Projects' },
  { to: '/learnings', label: 'Learnings' },
  { to: '/colophon', label: 'Colophon' },
]

export function Header() {
  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoDot} />
        Vikas Rangaswamy
      </Link>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className={styles.right}>
        <button
          type="button"
          className={styles.cmdkButton}
          onClick={() => window.dispatchEvent(new CustomEvent(COMMAND_PALETTE_EVENT))}
          data-tip="Command palette"
          data-tip-below
          aria-label="Open command palette"
        >
          <kbd className={styles.cmdkKey}>{isMac ? '⌘' : 'ctrl'}</kbd>
          <kbd className={styles.cmdkKey}>K</kbd>
        </button>
        <SoundToggle />
        <ThemeToggle />
      </div>
    </header>
  )
}
