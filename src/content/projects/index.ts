import type { ComponentType } from 'react'
import BidirectionalGridHedge from './bidirectional-grid-hedge.mdx'
import HighLowBreakoutScalper from './highlow-breakout-scalper.mdx'
import ImpulseCandleScalper from './impulse-candle-scalper.mdx'
import { projectsMeta, type ProjectMeta } from './meta'

export type Project = ProjectMeta & {
  /** Optional — omit when the source is private. */
  repoUrl?: string
  demoUrl?: string
  component: ComponentType
}

const components: Record<string, ComponentType> = {
  'bidirectional-grid-hedge': BidirectionalGridHedge,
  'highlow-breakout-scalper': HighLowBreakoutScalper,
  'impulse-candle-scalper': ImpulseCandleScalper,
}

// Metadata is the single source of truth (shared with the AI worker); the site
// attaches the MDX body here.
export const projects: readonly Project[] = projectsMeta.map((meta) => ({
  ...meta,
  component: components[meta.slug],
}))
