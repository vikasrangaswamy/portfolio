import type { FlowSpec } from '../../../components/diagrams/FlowDiagram'

export const urlShortenerFlow: FlowSpec = {
  direction: 'LR',
  height: 360,
  nodes: [
    { id: 'spa', label: 'React SPA' },
    { id: 'express', label: 'Express API' },
    { id: 'sqlite', label: 'SQLite', type: 'data' },
    { id: 'redis', label: 'Redis\n(optional)', type: 'data' },
  ],
  edges: [
    { from: 'spa', to: 'express', label: '/api  /r' },
    { from: 'express', to: 'sqlite' },
    { from: 'express', to: 'redis', label: 'cache reads', dashed: true },
  ],
}
