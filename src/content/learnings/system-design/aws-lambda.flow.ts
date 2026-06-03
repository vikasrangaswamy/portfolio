import type { FlowSpec } from '../../../components/diagrams/FlowDiagram'

export const awsLambdaFlow: FlowSpec = {
  direction: 'LR',
  height: 300,
  nodes: [
    { id: 'trigger', label: 'Trigger\nHTTP · Schedule · Event' },
    { id: 'lambda', label: 'Lambda function' },
    { id: 'external', label: 'External API', type: 'data' },
    { id: 'cw', label: 'CloudWatch\nLogs', type: 'data' },
  ],
  edges: [
    { from: 'trigger', to: 'lambda' },
    { from: 'lambda', to: 'external' },
    { from: 'lambda', to: 'cw' },
  ],
}
