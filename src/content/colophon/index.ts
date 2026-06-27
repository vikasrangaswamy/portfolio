import AskAssistant from './ask-assistant.mdx'
import LeetCodeSync from './leetcode-sync.mdx'
import GithubWidget from './github-widget.mdx'
import type { LearningTopic } from '../../components/learnings/LearningPage'

const REPO = 'https://github.com/vikasrangaswamy/portfolio/blob/main'

export const colophonTopics: readonly LearningTopic[] = [
  {
    slug: 'ask-assistant',
    title: 'The AI "Ask" assistant',
    summary:
      'The terminal that answers questions about my work — a keyless static site talking to a tiny Cloudflare Worker that grounds a free-tier Workers AI model in a fixed portfolio context, rate-limits abuse, and streams the answer back token by token.',
    tech: ['Cloudflare Workers', 'Workers AI', 'KV', 'SSE streaming'],
    repoUrl: `${REPO}/worker/src/index.ts`,
    component: AskAssistant,
  },
  {
    slug: 'leetcode-sync',
    title: 'Live LeetCode stats',
    summary:
      'How the home page LeetCode widget and stats heatmap stay current — a daily GitHub Actions cron, a small Node script that hits LeetCode\'s public GraphQL, and a committed JSON file the build is allowed to be a little stale on.',
    tech: ['GitHub Actions', 'Node', 'GraphQL', 'JSON'],
    repoUrl: `${REPO}/scripts/fetch-leetcode-stats.mjs`,
    component: LeetCodeSync,
  },
  {
    slug: 'github-widget',
    title: 'Client-fetched GitHub stats',
    summary:
      'The home page GitHub tile reads from api.github.com on every visitor — no auth, no backend. A 6 hour localStorage cache keeps the unauthenticated rate limit comfortable.',
    tech: ['React', 'GitHub REST API', 'localStorage'],
    repoUrl: `${REPO}/src/components/widgets/GitHubWidget.tsx`,
    component: GithubWidget,
  },
]
