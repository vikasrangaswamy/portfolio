import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { SoundToggle } from './SoundToggle'
import { NavAsk, AskButton } from './NavAsk'
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
  const menuButtonRef = useRef<HTMLButtonElement | null>(null)
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

  // Escape closes the menu, and focus returns to the hamburger so keyboard users
  // don't lose their place.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <>
      {/* Off-screen until focused — lets keyboard and screen-reader users jump
          past the nav instead of tabbing it on every page. */}
      <a href="#main" className={styles.skipLink}>
        Skip to content
      </a>
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
      <nav className={styles.nav} id="site-nav">
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
        {/* Stands in for the Ask bar between 801–1139px, where the header can't
            fit it (CSS-gated in NavAsk.module.css). */}
        <AskButton />
        <SoundToggle />
        <ThemeToggle />
        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menuButton}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={styles.menuBar} />
          <span className={styles.menuBar} />
          <span className={styles.menuBar} />
        </button>
      </div>
      </header>

      {/* Tap-away backdrop, mobile only (CSS-gated). It lives OUTSIDE <header>
          on purpose: the header's backdrop-filter makes it a containing block
          for fixed-position descendants, which clipped this to the header's own
          box — so tapping the page below the menu did nothing. */}
      {menuOpen && (
        <button
          type="button"
          className={styles.backdrop}
          aria-hidden="true"
          tabIndex={-1}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  )
}
