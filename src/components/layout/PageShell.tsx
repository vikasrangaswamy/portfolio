import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { GlobalSoundListener } from '../../lib/GlobalSoundListener'
import { CommandPalette } from '../command/CommandPalette'

export function PageShell() {
  return (
    <>
      <GlobalSoundListener />
      <CommandPalette />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
