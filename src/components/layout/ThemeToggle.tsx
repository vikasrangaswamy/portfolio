import { useTheme } from '../../lib/useTheme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      style={{
        width: 32,
        height: 32,
        borderRadius: 'var(--r-sm)',
        background: 'transparent',
        border: '1px solid var(--gray-300)',
        color: 'var(--gray-700)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        transition: 'border-color var(--transition), color var(--transition), transform var(--transition)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--clay)'
        e.currentTarget.style.color = 'var(--clay)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--gray-300)'
        e.currentTarget.style.color = 'var(--gray-700)'
      }}
    >
      {theme === 'light' ? '☾' : '☀'}
    </button>
  )
}
