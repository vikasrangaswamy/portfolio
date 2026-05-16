import { TopicGrid } from '../components/learnings/TopicGrid'
import { projects } from '../content/projects'

export default function Projects() {
  return (
    <TopicGrid
      tag="Projects"
      title="Real projects"
      summary="Production-ready algorithmic trading strategies. Each writeup covers the problem, the strategy, the architecture, and the tradeoffs."
      trackPath="/projects"
      topics={projects}
    />
  )
}
