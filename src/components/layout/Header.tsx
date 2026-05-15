import { Link, useLocation } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { SoundToggle } from './SoundToggle'
import styles from './Header.module.css'

const navItems = [
  { hash: 'about', label: 'About' },
  { hash: 'experience', label: 'Experience' },
  { hash: 'projects', label: 'Projects' },
  { hash: 'learnings', label: 'Learnings' },
]

export function Header() {
  const { pathname, hash } = useLocation()
  const onHome = pathname === '/'

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoDot} />
        Vikas Rangaswamy
      </Link>
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = onHome && hash === `#${item.hash}`
          return (
            <Link
              key={item.hash}
              to={`/#${item.hash}`}
              className={isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
            >
              {item.label}
            </Link>
          )
        })}
        <SoundToggle />
        <ThemeToggle />
      </nav>
    </header>
  )
}
