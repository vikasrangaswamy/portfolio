import type { FlowSpec } from '../../components/diagrams/FlowDiagram'

export const leetcodeSyncFlow: FlowSpec = {
  direction: 'LR',
  height: 380,
  nodes: [
    { id: 'cron', label: 'GitHub Actions cron\ndaily, 06:17 UTC' },
    { id: 'script', label: 'fetch-leetcode-stats.mjs' },
    { id: 'gql', label: 'LeetCode\nGraphQL API', type: 'data' },
    { id: 'json', label: 'public/data/\nleetcode.json', type: 'data' },
    { id: 'deploy', label: 'Pages deploy\nworkflow' },
    { id: 'page', label: 'LeetCode widget\n+ stats page' },
  ],
  edges: [
    { from: 'cron', to: 'script' },
    { from: 'script', to: 'gql', label: 'query' },
    { from: 'gql', to: 'script', label: 'submitStats + calendar' },
    { from: 'script', to: 'json', label: 'commit if changed' },
    { from: 'json', to: 'deploy' },
    { from: 'deploy', to: 'page' },
  ],
}
