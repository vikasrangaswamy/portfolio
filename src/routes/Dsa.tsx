import { useParams } from 'react-router-dom'
import { TopicGrid } from '../components/learnings/TopicGrid'
import { LearningPage } from '../components/learnings/LearningPage'
import { dsaTopics } from '../content/learnings/dsa'
import NotFound from './NotFound'

export function DsaIndex() {
  return (
    <TopicGrid
      tag="Learnings · DSA"
      title="Data Structures & Algorithms"
      summary="13 topics in Python — refined notes, patterns, and canonical code excerpts."
      trackPath="/learnings/dsa"
      topics={dsaTopics}
    />
  )
}

export function DsaTopicPage() {
  const { slug } = useParams<{ slug: string }>()
  const topic = dsaTopics.find((t) => t.slug === slug)
  if (!topic) return <NotFound />
  return <LearningPage trackLabel="DSA" trackHref="/learnings/dsa" topic={topic} />
}
