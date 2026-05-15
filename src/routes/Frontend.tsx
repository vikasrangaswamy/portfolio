import { useParams } from 'react-router-dom'
import { TopicGrid } from '../components/learnings/TopicGrid'
import { LearningPage } from '../components/learnings/LearningPage'
import { frontendTopics } from '../content/learnings/frontend'
import NotFound from './NotFound'

export function FrontendIndex() {
  return (
    <TopicGrid
      tag="Learnings · Frontend"
      title="Frontend"
      summary="State management patterns, side effects, and predictable client-side flows."
      trackPath="/learnings/frontend"
      topics={frontendTopics}
    />
  )
}

export function FrontendTopicPage() {
  const { slug } = useParams<{ slug: string }>()
  const topic = frontendTopics.find((t) => t.slug === slug)
  if (!topic) return <NotFound />
  return <LearningPage trackLabel="Frontend" trackHref="/learnings/frontend" topic={topic} />
}
