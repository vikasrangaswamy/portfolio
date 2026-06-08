import { NavLink, Link } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { SoundToggle } from './SoundToggle'
import { NavAsk } from './NavAsk'
import styles from './Header.module.css'

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
      <NavAsk />
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
        <SoundToggle />
        <ThemeToggle />
      </div>
    </header>
  )
}
