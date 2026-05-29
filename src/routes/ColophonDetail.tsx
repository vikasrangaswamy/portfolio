import { useParams } from 'react-router-dom'
import { LearningPage } from '../components/learnings/LearningPage'
import { colophonTopics } from '../content/colophon'
import NotFound from './NotFound'

export default function ColophonDetail() {
  const { slug } = useParams<{ slug: string }>()
  const topic = colophonTopics.find((t) => t.slug === slug)
  if (!topic) return <NotFound />
  return <LearningPage trackLabel="Colophon" trackHref="/colophon" topic={topic} />
}
