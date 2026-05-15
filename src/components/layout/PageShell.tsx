import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { GlobalSoundListener } from '../../lib/GlobalSoundListener'
import { HashScroller } from '../../lib/HashScroller'

export function PageShell() {
  return (
    <>
      <GlobalSoundListener />
      <HashScroller />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
