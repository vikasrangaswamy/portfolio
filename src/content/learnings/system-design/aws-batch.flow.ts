import type { FlowSpec } from '../../../components/diagrams/FlowDiagram'

export const awsBatchFlow: FlowSpec = {
  direction: 'LR',
  height: 320,
  nodes: [
    { id: 'submit', label: 'Your computer\nbatch_job_submit.js' },
    { id: 'queue', label: 'AWS Batch\nJob Queue' },
    { id: 'fargate', label: 'Fargate\nContainer' },
    { id: 'processor', label: 'batch_processor.js' },
    { id: 'logs', label: 'CloudWatch\nLogs', type: 'data' },
  ],
  edges: [
    { from: 'submit', to: 'queue', label: 'submit job' },
    { from: 'queue', to: 'fargate', label: 'start container' },
    { from: 'fargate', to: 'processor', label: 'runs' },
    { from: 'processor', to: 'logs', label: 'logs' },
  ],
}
