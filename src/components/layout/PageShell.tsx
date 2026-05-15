import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { GlobalSoundListener } from '../../lib/GlobalSoundListener'

export function PageShell() {
  return (
    <>
      <GlobalSoundListener />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
