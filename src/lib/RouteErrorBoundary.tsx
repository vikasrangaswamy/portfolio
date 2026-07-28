import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Props = { children: ReactNode }
type State = { error: Error | null }

const RELOAD_FLAG = 'route-chunk-reloaded'

/**
 * A failed dynamic import is the realistic failure here, not a component bug.
 * Every route except home is code-split, and Cloudflare Pages serves
 * fingerprinted filenames — so a tab left open across a deploy asks for a chunk
 * that no longer exists, the import rejects, and a bare <Suspense> renders
 * nothing at all: a blank white page.
 *
 * For that case the fix is simply to load the new build, so we reload once
 * (guarded by a sessionStorage flag, so a genuinely broken deploy can't put the
 * browser in a reload loop). Anything else gets a real message with a way out.
 */
export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (isChunkLoadError(error) && !sessionStorage.getItem(RELOAD_FLAG)) {
      sessionStorage.setItem(RELOAD_FLAG, '1')
      window.location.reload()
      return
    }
    console.error('Route failed to render:', error, info.componentStack)
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    const stale = isChunkLoadError(error)
    return (
      <div style={{ minHeight: '60vh', padding: 'var(--sp-8) var(--sp-6)', maxWidth: 560 }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            color: 'var(--clay)',
            marginBottom: 'var(--sp-3)',
          }}
        >
          $ error
        </p>
        <h1 style={{ fontSize: 30, marginBottom: 'var(--sp-4)' }}>
          {stale ? 'This page needs a refresh' : "This page didn't load"}
        </h1>
        <p style={{ color: 'var(--gray-700)', marginBottom: 'var(--sp-5)' }}>
          {stale
            ? 'The site was updated while this tab was open, so part of it is out of date.'
            : 'Something broke while rendering this page. The rest of the site should still work.'}
        </p>
        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem(RELOAD_FLAG)
            window.location.reload()
          }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 14,
            padding: '10px 18px',
            marginRight: 'var(--sp-4)',
            color: 'var(--ivory)',
            background: 'var(--clay)',
            border: 'none',
            borderRadius: 'var(--r-sm)',
            cursor: 'pointer',
          }}
        >
          Reload
        </button>
        <Link to="/" style={{ color: 'var(--clay)' }}>
          Go to the home page
        </Link>
      </div>
    )
  }
}

/**
 * Matches the wording for an asset that never arrived. The phrasing differs per
 * browser and per bundler, so all the known variants are listed. The first one
 * is Vite's own and is the one that actually fires here: its dynamic-import
 * wrapper preloads the route's stylesheet before the module, so a stale build
 * trips on the CSS rather than the JS.
 */
function isChunkLoadError(error: Error): boolean {
  const text = `${error.name} ${error.message}`
  return (
    /Unable to preload CSS/i.test(text) ||
    /ChunkLoadError/i.test(text) ||
    /Loading (CSS )?chunk .* failed/i.test(text) ||
    /Failed to fetch dynamically imported module/i.test(text) ||
    /error loading dynamically imported module/i.test(text) ||
    /Importing a module script failed/i.test(text)
  )
}
