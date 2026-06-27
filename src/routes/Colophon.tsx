import { TopicGrid } from '../components/learnings/TopicGrid'
import { colophonTopics } from '../content/colophon'

export default function Colophon() {
  return (
    <TopicGrid
      tag="Colophon"
      title="How this site works"
      summary="Short writeups for the features with non-obvious mechanics behind them — the AI &lsquo;Ask&rsquo; assistant, the live LeetCode sync, and the client-fetched GitHub stats. Each one walks through the data path and the code that runs it."
      trackPath="/colophon"
      topics={colophonTopics}
    />
  )
}
