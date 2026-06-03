import type { FlowSpec } from '../../components/diagrams/FlowDiagram'

export const impulseCandleScalperFlow: FlowSpec = {
  direction: 'TD',
  height: 720,
  nodes: [
    { id: 'bar', label: 'Bar closes' },
    { id: 'atr', label: 'Compute range, body,\navg range (lookback)' },
    {
      id: 'test',
      label:
        'range > size_mult × avg\nrange > atr_mult × ATR\nbody/range in [min, max]\ncontinuation in window?',
      type: 'decision',
    },
    { id: 'wait', label: 'Wait for next bar' },
    { id: 'dir', label: 'Direction =\nsign(close − open)' },
    { id: 'stop', label: 'Place pending stop\nat impulse high/low\n+ buffer' },
    { id: 'check', label: 'Already moved past?', type: 'decision' },
    { id: 'waitFill', label: 'Wait for fill\nor expiry' },
    { id: 'market', label: 'Market order\nfallback' },
    { id: 'skip', label: 'Skip — too late' },
    { id: 'filled', label: 'Filled → SL + TP attached' },
    { id: 'trail', label: 'Trail SL when\nprofit ≥ threshold' },
  ],
  edges: [
    { from: 'bar', to: 'atr' },
    { from: 'atr', to: 'test' },
    { from: 'test', to: 'wait', label: 'no' },
    { from: 'test', to: 'dir', label: 'yes' },
    { from: 'dir', to: 'stop' },
    { from: 'stop', to: 'check' },
    { from: 'check', to: 'waitFill', label: 'no' },
    { from: 'check', to: 'market', label: 'yes &\nwithin chase %' },
    { from: 'check', to: 'skip', label: 'yes &\nbeyond chase %' },
    { from: 'waitFill', to: 'filled' },
    { from: 'market', to: 'filled' },
    { from: 'filled', to: 'trail' },
  ],
}
