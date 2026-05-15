import ReduxSaga from './redux-saga.mdx'
import type { LearningTopic } from '../../../components/learnings/LearningPage'

const REPO_BASE = 'https://github.com/vikasrangaswamy/frontend-experiments/tree/main'

export const frontendTopics: readonly LearningTopic[] = [
  {
    slug: 'redux-saga',
    title: 'Redux Saga',
    summary: 'Side-effect handling with generators — when sagas beat thunks, when they don\'t.',
    tech: ['React', 'Redux', 'Redux Saga'],
    repoUrl: `${REPO_BASE}/redux-saga`,
    component: ReduxSaga,
  },
]
