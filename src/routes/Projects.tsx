import { PageHeader } from '../components/layout/PageHeader'
import { ProjectsSection } from '../components/sections/ProjectsSection'
import pageStyles from './Page.module.css'

export default function Projects() {
  return (
    <div className={pageStyles.container}>
      <PageHeader
        tag="Projects"
        title="Real projects, coming soon"
        summary="Reserved for completed work I'm willing to stand behind. An MT5 algorithmic trading suite (Python) lands here first."
      />
      <ProjectsSection standalone />
    </div>
  )
}
