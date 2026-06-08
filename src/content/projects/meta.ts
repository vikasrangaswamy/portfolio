/**
 * Pure project metadata — no MDX/React imports, so this is safe to import from
 * worker-side code (the AI assistant builds its context from these same files).
 * The MDX bodies are attached in ./index.ts for the site.
 */
export type ProjectMeta = {
  slug: string
  title: string
  summary: string
  tech: readonly string[]
}

export const projectsMeta: readonly ProjectMeta[] = [
  {
    slug: 'bidirectional-grid-hedge',
    title: 'Bidirectional Grid Hedge',
    summary:
      'ATR-spaced grid of pending hedge orders that profit on movement in either direction, with auto-close when the net P/L crosses one grid value.',
    tech: ['Python', 'Algorithmic Trading', 'Risk Management', 'Hedging'],
  },
  {
    slug: 'highlow-breakout-scalper',
    title: 'High/Low Breakout Scalper',
    summary:
      'Pending breakout stops at recent swing highs and lows, gated by an ADX trend filter, trailed and unwound on session boundaries.',
    tech: ['Python', 'Algorithmic Trading', 'Risk Management', 'Trend Following'],
  },
  {
    slug: 'impulse-candle-scalper',
    title: 'Impulse Candle Scalper',
    summary:
      'Detects ATR-relative impulse candles after the close and rides the continuation with a pending-stop-or-market fallback.',
    tech: ['Python', 'Algorithmic Trading', 'Risk Management', 'Momentum'],
  },
]
