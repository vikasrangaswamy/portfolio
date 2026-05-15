import { PageHeader } from '../components/layout/PageHeader'
import { LearningsSection } from '../components/sections/LearningsSection'
import pageStyles from './Page.module.css'

export default function Learnings() {
  return (
    <div className={pageStyles.container}>
      <PageHeader
        tag="Learnings"
        title="What I'm studying"
        summary="Notes, code excerpts, and architecture diagrams from ongoing practice."
      />
      <LearningsSection standalone />
    </div>
  )
}
