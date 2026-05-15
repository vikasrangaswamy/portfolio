import { NavLink, Link } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { SoundToggle } from './SoundToggle'
import { useSound } from '../../lib/sound'
import styles from './Header.module.css'

const navItems = [
  { to: '/about', label: 'About' },
  { to: '/experience', label: 'Experience' },
  { to: '/projects', label: 'Projects' },
  { to: '/learnings', label: 'Learnings' },
]

export function Header() {
  const { play } = useSound()

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo} onClick={() => play('click', 0.5)}>
        <span className={styles.logoDot} />
        Vikas Rangaswamy
      </Link>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => play('click', 0.6)}
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
            }
          >
            {item.label}
          </NavLink>
        ))}
        <SoundToggle />
        <ThemeToggle />
      </nav>
    </header>
  )
}
