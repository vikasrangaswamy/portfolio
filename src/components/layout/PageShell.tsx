import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { GlobalSoundListener } from '../../lib/GlobalSoundListener'
import { AskTerminal } from '../ask/AskTerminal'

export function PageShell() {
  return (
    <>
      <GlobalSoundListener />
      <AskTerminal />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
