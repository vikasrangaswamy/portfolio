import { Outlet, useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { GlobalSoundListener } from '../../lib/GlobalSoundListener'
import { RouteErrorBoundary } from '../../lib/RouteErrorBoundary'
import { ScrollToTop } from '../../lib/ScrollToTop'
import { AskTerminal } from '../ask/AskTerminal'

export function PageShell() {
  const { pathname } = useLocation()

  return (
    <>
      <ScrollToTop />
      <GlobalSoundListener />
      <AskTerminal />
      <Header />
      <main id="main">
        {/* Scoped to the routed content so a failure keeps the header and footer
            — the visitor can still navigate out. Keyed on the path because React
            error boundaries don't reset themselves: without it, one bad route
            would stay broken for the rest of the session. */}
        <RouteErrorBoundary key={pathname}>
          <Outlet />
        </RouteErrorBoundary>
      </main>
      <Footer />
    </>
  )
}
