import type { ComponentType } from 'react'
import BidirectionalGridHedge from './bidirectional-grid-hedge.mdx'
import HighLowBreakoutScalper from './highlow-breakout-scalper.mdx'
import ImpulseCandleScalper from './impulse-candle-scalper.mdx'

export type Project = {
  slug: string
  title: string
  summary: string
  tech: readonly string[]
  /** Optional — omit when the source is private. */
  repoUrl?: string
  demoUrl?: string
  component: ComponentType
}

export const projects: readonly Project[] = [
  {
    slug: 'bidirectional-grid-hedge',
    title: 'Bidirectional Grid Hedge',
    summary:
      'ATR-spaced grid of pending hedge orders that profit on movement in either direction, with auto-close when the net P/L crosses one grid value.',
    tech: ['Python', 'Algorithmic Trading', 'Risk Management', 'Hedging'],
    component: BidirectionalGridHedge,
  },
  {
    slug: 'highlow-breakout-scalper',
    title: 'High/Low Breakout Scalper',
    summary:
      'Pending breakout stops at recent swing highs and lows, gated by an ADX trend filter, trailed and unwound on session boundaries.',
    tech: ['Python', 'Algorithmic Trading', 'Risk Management', 'Trend Following'],
    component: HighLowBreakoutScalper,
  },
  {
    slug: 'impulse-candle-scalper',
    title: 'Impulse Candle Scalper',
    summary:
      'Detects ATR-relative impulse candles after the close and rides the continuation with a pending-stop-or-market fallback.',
    tech: ['Python', 'Algorithmic Trading', 'Risk Management', 'Momentum'],
    component: ImpulseCandleScalper,
  },
]
