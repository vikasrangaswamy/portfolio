import { PageHeader } from '../components/layout/PageHeader'
import { ExperienceSection } from '../components/sections/ExperienceSection'
import pageStyles from './Page.module.css'

export default function Experience() {
  return (
    <div className={pageStyles.container}>
      <PageHeader
        tag="Experience"
        title="Work history"
        summary="A timeline of where I've worked and what I built. Most recent first."
      />
      <ExperienceSection standalone />
    </div>
  )
}
