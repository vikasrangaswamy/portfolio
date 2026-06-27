import type { FlowSpec } from '../../components/diagrams/FlowDiagram'

export const askAssistantFlow: FlowSpec = {
  direction: 'LR',
  height: 420,
  nodes: [
    { id: 'term', label: 'Ask terminal\n(browser)' },
    { id: 'worker', label: 'Cloudflare Worker\nask-vikas' },
    { id: 'guard', label: 'Validate +\nrate-limit (KV)', type: 'decision' },
    { id: 'limited', label: 'Rate-limited\n(429)', type: 'data' },
    { id: 'prompt', label: 'System prompt +\nportfolio context', type: 'data' },
    { id: 'ai', label: 'Workers AI\nLlama (free tier)', type: 'data' },
  ],
  edges: [
    { from: 'term', to: 'worker', label: 'POST /ask {question}' },
    { from: 'worker', to: 'guard' },
    { from: 'guard', to: 'limited', label: 'too many', dashed: true },
    { from: 'guard', to: 'prompt', label: 'within limits' },
    { from: 'prompt', to: 'ai' },
    { from: 'ai', to: 'term', label: 'streamed tokens (SSE)' },
  ],
}
