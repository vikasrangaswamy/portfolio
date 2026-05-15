import AwsBatch from './aws-batch.mdx'
import AwsLambda from './aws-lambda.mdx'
import UrlShortener from './url-shortener.mdx'
import type { LearningTopic } from '../../../components/learnings/LearningPage'

// DUMMY repoUrls — point to local paths until the system-design-experiments repo is on GitHub.
// Update per NEEDS-FROM-USER.md item #9.
const REPO_BASE = 'https://github.com/vikasrangaswamy/system-design-experiments/tree/main'

export const systemDesignTopics: readonly LearningTopic[] = [
  {
    slug: 'url-shortener',
    title: 'URL Shortener',
    summary: 'Classic system-design study: read/write skew, caching, ID encoding, scaling reads.',
    tech: ['React', 'Express', 'SQLite', 'Redis', 'Docker'],
    repoUrl: `${REPO_BASE}/url-shortener`,
    component: UrlShortener,
  },
  {
    slug: 'aws-batch',
    title: 'AWS Batch',
    summary: 'Submit a job, run it on Fargate, stream logs to CloudWatch — end-to-end.',
    tech: ['Node.js', 'AWS Batch', 'Fargate', 'Docker'],
    repoUrl: `${REPO_BASE}/aws-batch`,
    component: AwsBatch,
  },
  {
    slug: 'aws-lambda',
    title: 'AWS Lambda',
    summary: 'When Lambda fits, when it doesn\'t, and axios vs native fetch in handlers.',
    tech: ['Node.js', 'AWS Lambda'],
    repoUrl: `${REPO_BASE}/aws-lambda`,
    component: AwsLambda,
  },
]
