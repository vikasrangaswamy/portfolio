import type { FlowSpec } from '../../components/diagrams/FlowDiagram'

// Originally authored as a Mermaid stateDiagram-v2; the underlying graph is
// still a directed flow, so the port is one-to-one with each state becoming
// a node and each transition becoming a labelled edge.
export const highlowBreakoutScalperFlow: FlowSpec = {
  direction: 'TD',
  height: 540,
  nodes: [
    { id: 'scanning', label: 'Scanning' },
    { id: 'placed', label: 'Placed' },
    { id: 'cancelled', label: 'Cancelled' },
    { id: 'triggered', label: 'Triggered' },
    { id: 'trailing', label: 'Trailing' },
    { id: 'closed', label: 'Closed' },
  ],
  edges: [
    { from: 'scanning', to: 'placed', label: 'new swing levels +\nADX gate passes' },
    { from: 'placed', to: 'triggered', label: 'price crosses\nbuffer' },
    { from: 'placed', to: 'cancelled', label: 'expired or\nbroker cancel' },
    { from: 'cancelled', to: 'scanning', label: 'retry next bar' },
    { from: 'triggered', to: 'trailing', label: 'profit ≥ start' },
    { from: 'triggered', to: 'closed', label: 'SL / TP hit' },
    { from: 'trailing', to: 'closed', label: 'trailing SL /\nTP hit' },
    { from: 'closed', to: 'scanning' },
  ],
}
