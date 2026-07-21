import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { SoundToggle } from './SoundToggle'
import { NavAsk } from './NavAsk'
import styles from './Header.module.css'

const navItems = [
  { to: '/about', label: 'About' },
  { to: '/experience', label: 'Experience' },
  { to: '/projects', label: 'Projects' },
  { to: '/stats', label: 'Stats' },
  { to: '/colophon', label: 'Colophon' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  // Collapse the mobile menu whenever the route changes (e.g. after tapping a
  // link) so it never lingers open over the new page.
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Lock background scroll while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  return (
    <header className={`${styles.header} ${menuOpen ? styles.menuOpen : ''}`}>
      <Link to="/" className={styles.logo} aria-label="Vikas Rangaswamy — home">
        <span className={styles.logoDot} />
        {/* On the home page the hero already shows the full name, so the nav
            logo is just the clay dot (no text). Every other page shows the full
            name as the persistent wordmark. */}
        {isHome ? null : 'Vikas Rangaswamy'}
      </Link>

      <div className={styles.askArea}>
        <NavAsk />
      </div>

      {/* Floating pill nav. The active link renders a shared-layoutId motion
          span behind its label, so Motion slides the highlight pill from the
          previous route to the new one (the 21st.dev / BuildUI pattern). */}
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className={styles.navPill}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={styles.navLabel}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className={styles.right}>
        <SoundToggle />
        <ThemeToggle />
        <button
          type="button"
          className={styles.menuButton}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={styles.menuBar} />
          <span className={styles.menuBar} />
          <span className={styles.menuBar} />
        </button>
      </div>

      {/* Tap-away backdrop, mobile only (CSS-gated). */}
      <button
        type="button"
        className={styles.backdrop}
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => setMenuOpen(false)}
      />
    </header>
  )
}
