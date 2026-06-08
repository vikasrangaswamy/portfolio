/**
 * Pure system-design topic metadata — no MDX/React imports, so it's safe to
 * import worker-side (the AI assistant builds its context from these files).
 * The MDX bodies are attached in ./index.ts for the site.
 */
export type TopicMeta = {
  slug: string
  title: string
  summary: string
  tech: readonly string[]
  repoUrl?: string
}

// DUMMY repoUrls — point to local paths until the system-design-experiments repo is on GitHub.
const REPO_BASE = 'https://github.com/vikasrangaswamy/system-design-experiments/tree/main'

export const systemDesignMeta: readonly TopicMeta[] = [
  {
    slug: 'url-shortener',
    title: 'URL Shortener',
    summary: 'Classic system-design study: read/write skew, caching, ID encoding, scaling reads.',
    tech: ['React', 'Express', 'SQLite', 'Redis', 'Docker'],
    repoUrl: `${REPO_BASE}/url-shortener`,
  },
  {
    slug: 'aws-batch',
    title: 'AWS Batch',
    summary: 'Submit a job, run it on Fargate, stream logs to CloudWatch — end-to-end.',
    tech: ['Node.js', 'AWS Batch', 'Fargate', 'Docker'],
    repoUrl: `${REPO_BASE}/aws-batch`,
  },
  {
    slug: 'aws-lambda',
    title: 'AWS Lambda',
    summary: "When Lambda fits, when it doesn't, and axios vs native fetch in handlers.",
    tech: ['Node.js', 'AWS Lambda'],
    repoUrl: `${REPO_BASE}/aws-lambda`,
  },
]
