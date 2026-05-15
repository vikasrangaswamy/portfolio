import { useParams } from 'react-router-dom'
import { TopicGrid } from '../components/learnings/TopicGrid'
import { LearningPage } from '../components/learnings/LearningPage'
import { systemDesignTopics } from '../content/learnings/system-design'
import NotFound from './NotFound'

export function SystemDesignIndex() {
  return (
    <TopicGrid
      tag="Learnings · System Design"
      title="System Design"
      summary="Hands-on infrastructure and architecture studies. Each topic links to a runnable repo."
      trackPath="/learnings/system-design"
      topics={systemDesignTopics}
    />
  )
}

export function SystemDesignTopicPage() {
  const { slug } = useParams<{ slug: string }>()
  const topic = systemDesignTopics.find((t) => t.slug === slug)
  if (!topic) return <NotFound />
  return <LearningPage trackLabel="System Design" trackHref="/learnings/system-design" topic={topic} />
}
