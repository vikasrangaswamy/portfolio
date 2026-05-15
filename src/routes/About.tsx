import { PageHeader } from '../components/layout/PageHeader'
import { AboutSection } from '../components/sections/AboutSection'
import { profile } from '../content/profile'
import pageStyles from './Page.module.css'

export default function About() {
  return (
    <div className={pageStyles.container}>
      <PageHeader
        tag="About"
        title={profile.name}
        summary={`${profile.role} · ${profile.company} · ${profile.location}`}
      />
      <AboutSection standalone />
    </div>
  )
}
