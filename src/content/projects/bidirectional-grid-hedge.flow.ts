import type { FlowSpec } from '../../components/diagrams/FlowDiagram'

export const bidirectionalGridHedgeFlow: FlowSpec = {
  direction: 'TD',
  height: 620,
  nodes: [
    { id: 'start', label: 'New cycle\nATR → grid spacing' },
    { id: 'center', label: 'Grid center =\ncurrent price' },
    { id: 'above', label: 'Above center:\nBUY STOP + SELL LIMIT\n(TP = +1 grid)' },
    { id: 'below', label: 'Below center:\nSELL STOP + BUY LIMIT\n(TP = −1 grid)' },
    { id: 'wait', label: 'Market moves\norders fire\nsome TPs hit', type: 'decision' },
    { id: 'close', label: 'Close everything' },
    { id: 'emergency', label: 'Emergency close' },
    { id: 'restart', label: 'AutoRestart?', type: 'decision' },
    { id: 'idle', label: 'Idle until\nmanual restart' },
  ],
  edges: [
    { from: 'start', to: 'center' },
    { from: 'center', to: 'above' },
    { from: 'center', to: 'below' },
    { from: 'above', to: 'wait' },
    { from: 'below', to: 'wait' },
    { from: 'wait', to: 'close', label: 'net P/L ≥ +1 grid' },
    { from: 'wait', to: 'emergency', label: 'DD > 60%' },
    { from: 'close', to: 'restart' },
    { from: 'emergency', to: 'restart' },
    { from: 'restart', to: 'start', label: 'yes' },
    { from: 'restart', to: 'idle', label: 'no' },
  ],
}
