import { useParams } from 'react-router-dom'
import { LearningPage } from '../components/learnings/LearningPage'
import { projects } from '../content/projects'
import NotFound from './NotFound'

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <NotFound />
  return <LearningPage trackLabel="Projects" trackHref="/projects" topic={project} />
}
