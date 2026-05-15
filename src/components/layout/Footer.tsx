import styles from './Footer.module.css'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span>Vikas Rangaswamy · {year}</span>
        <div className={styles.links}>
          <a href="https://github.com/vikasrangaswamy" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="mailto:rangaswamy.vikas@contentstack.com">Email</a>
        </div>
      </div>
    </footer>
  )
}
