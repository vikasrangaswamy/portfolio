import { useEffect, useMemo, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeTypes,
  MarkerType,
  Position,
} from '@xyflow/react'
import dagre from 'dagre'
// Base stylesheet is imported globally in src/main.tsx so it survives MDX
// chunk-splitting; do NOT re-import it here.
import { DefaultNode, DecisionNode, DataNode } from './FlowNodes'
import styles from './FlowDiagram.module.css'

export type FlowNodeKind = 'default' | 'decision' | 'data'

export type FlowNodeSpec = {
  id: string
  label: string
  type?: FlowNodeKind
  /** Optional width override (px). Defaults sized by kind. */
  width?: number
  /** Optional height override (px). */
  height?: number
}

export type FlowEdgeSpec = {
  from: string
  to: string
  label?: string
  /** Dashed line — used for "optional / cached read" type relationships. */
  dashed?: boolean
}

export type FlowSpec = {
  nodes: readonly FlowNodeSpec[]
  edges: readonly FlowEdgeSpec[]
  /** Top-to-Down or Left-to-Right. Defaults to LR (most flowcharts). */
  direction?: 'TD' | 'LR'
  /** Pixel height of the viewport. Defaults to 420. */
  height?: number
}

const NODE_TYPES: NodeTypes = {
  default: DefaultNode,
  decision: DecisionNode,
  data: DataNode,
}

const MIN_SIZE_BY_KIND: Record<FlowNodeKind, { w: number; h: number }> = {
  default: { w: 180, h: 60 },
  decision: { w: 220, h: 120 },
  data: { w: 180, h: 70 },
}

/**
 * Estimate the box size needed to fit a label without overflow.
 *
 * Rectangle / data kinds: just add horizontal + vertical padding to the
 * measured text area.
 *
 * Decision kind: the diamond's inscribed rectangle is roughly 50% of the
 * bounding box on each axis, so the box has to be ~1.9× the text area on
 * each axis to leave breathing room around the longest line and tallest
 * line stack.
 */
function measureLabel(label: string, kind: FlowNodeKind): { w: number; h: number } {
  const lines = label.split('\n')
  const longestLineChars = Math.max(1, ...lines.map((l) => l.length))
  const lineCount = lines.length

  // Per-kind font metrics matching FlowDiagram.module.css.
  const fontPx = kind === 'decision' ? 12 : 13
  // Inter at 13/12 px averages ~0.58× em width for our label vocabulary.
  const charPx = fontPx * 0.58
  const linePx = fontPx * 1.35

  const textW = longestLineChars * charPx
  const textH = lineCount * linePx

  const min = MIN_SIZE_BY_KIND[kind]
  if (kind === 'decision') {
    const w = Math.max(min.w, Math.ceil(textW * 1.9 + 36))
    const h = Math.max(min.h, Math.ceil(textH * 1.9 + 32))
    return { w, h }
  }
  return {
    w: Math.max(min.w, Math.ceil(textW + 40)),
    h: Math.max(min.h, Math.ceil(textH + 28)),
  }
}

function autoLayout(
  nodes: readonly FlowNodeSpec[],
  edges: readonly FlowEdgeSpec[],
  direction: 'TD' | 'LR',
): { nodes: Node[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({
    rankdir: direction === 'TD' ? 'TB' : 'LR',
    nodesep: direction === 'TD' ? 50 : 60,
    ranksep: direction === 'TD' ? 60 : 90,
    marginx: 20,
    marginy: 20,
  })

  // Pre-compute per-node sizes so dagre lays out with the same dimensions
  // we'll render. Author overrides on the spec still win.
  const sizes = new Map<string, { w: number; h: number }>()
  for (const node of nodes) {
    const kind = node.type ?? 'default'
    const measured = measureLabel(node.label, kind)
    const size = {
      w: node.width ?? measured.w,
      h: node.height ?? measured.h,
    }
    sizes.set(node.id, size)
    g.setNode(node.id, { width: size.w, height: size.h })
  }
  for (const edge of edges) {
    g.setEdge(edge.from, edge.to)
  }

  dagre.layout(g)

  const flowNodes: Node[] = nodes.map((node) => {
    const positioned = g.node(node.id)
    const size = sizes.get(node.id)!
    const kind = node.type ?? 'default'
    return {
      id: node.id,
      type: kind,
      // dagre centres each node at (x, y); React Flow wants the top-left.
      position: {
        x: positioned.x - positioned.width / 2,
        y: positioned.y - positioned.height / 2,
      },
      // direction flows through to the custom node component so it can render
      // its single source + single target handle on the right edges.
      data: { label: node.label, direction },
      sourcePosition: direction === 'TD' ? Position.Bottom : Position.Right,
      targetPosition: direction === 'TD' ? Position.Top : Position.Left,
      // Pin the wrapper size to exactly what dagre laid out, so the rendered
      // node matches the layout and the custom-node CSS (width/height 100%)
      // fills the right area.
      style: { width: size.w, height: size.h },
      draggable: false,
      selectable: false,
    }
  })

  const flowEdges: Edge[] = edges.map((edge, i) => ({
    id: `e-${edge.from}-${edge.to}-${i}`,
    source: edge.from,
    target: edge.to,
    label: edge.label,
    type: 'smoothstep',
    animated: false,
    markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18 },
    style: edge.dashed ? { strokeDasharray: '6 4' } : undefined,
    labelStyle: { fontSize: 12, fontWeight: 500 },
    labelBgStyle: { fill: 'var(--flow-edge-label-bg)' },
    labelBgPadding: [6, 4],
    labelBgBorderRadius: 4,
  }))

  return { nodes: flowNodes, edges: flowEdges }
}

export function FlowDiagram({ nodes, edges, direction = 'LR', height = 420 }: FlowSpec) {
  const { nodes: baseNodes, edges: baseEdges } = useMemo(
    () => autoLayout(nodes, edges, direction),
    [nodes, edges, direction],
  )

  // Step-through walkthrough. step 0 = static overview; 1..N reveals the flow
  // one edge at a time, dimming what hasn't been reached and animating the
  // current hop, so the data path is easy to follow.
  const totalSteps = edges.length
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const atEnd = step >= totalSteps

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  // Touch devices: drag-to-pan must stay off so a vertical swipe scrolls the
  // page instead of the canvas.
  const coarsePointer =
    typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches

  // How wide the canvas needs to be for fitView to land on a legible zoom. On a
  // phone the frame is ~350px against a graph over 1300px wide, so fitView
  // scales to ~0.4 and 12px node labels render at 5px. Sizing the canvas from
  // the laid-out graph instead (and scrolling it — see the media query in
  // FlowDiagram.module.css) keeps labels near full size. Capped so a very wide
  // diagram doesn't turn into an endless swipe.
  const legibleCanvasWidth = useMemo(() => {
    let minX = Infinity
    let maxX = -Infinity
    for (const n of baseNodes) {
      const w = typeof n.style?.width === 'number' ? n.style.width : 0
      minX = Math.min(minX, n.position.x)
      maxX = Math.max(maxX, n.position.x + w)
    }
    if (!Number.isFinite(minX) || !Number.isFinite(maxX)) return 660
    // fitView's 0.15 padding means the box must exceed the graph by ~18%.
    return Math.min(1400, Math.max(660, Math.round((maxX - minX) * 1.18)))
  }, [baseNodes])

  useEffect(() => {
    if (!playing) return
    if (step >= totalSteps) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setStep((s) => Math.min(s + 1, totalSteps)), 1150)
    return () => clearTimeout(t)
  }, [playing, step, totalSteps])

  const { displayNodes, displayEdges } = useMemo(() => {
    if (step === 0) return { displayNodes: baseNodes, displayEdges: baseEdges }

    const visited = new Set<string>()
    for (let i = 0; i < step; i++) {
      visited.add(edges[i].from)
      visited.add(edges[i].to)
    }

    const displayNodes: Node[] = baseNodes.map((n) => ({
      ...n,
      style: {
        ...n.style,
        opacity: visited.has(n.id) ? 1 : 0.22,
        transition: 'opacity 320ms ease',
      },
    }))

    const displayEdges: Edge[] = baseEdges.map((e, i) => {
      if (i === step - 1) {
        return {
          ...e,
          animated: !prefersReducedMotion,
          style: { ...(e.style ?? {}), stroke: 'var(--clay)', strokeWidth: 2.4, opacity: 1 },
          markerEnd: { type: MarkerType.ArrowClosed, width: 18, height: 18, color: 'var(--clay)' },
          labelStyle: { fontSize: 12, fontWeight: 600, fill: 'var(--clay)' },
        }
      }
      if (i < step - 1) {
        return { ...e, animated: false, style: { ...(e.style ?? {}), opacity: 0.9 } }
      }
      return {
        ...e,
        animated: false,
        style: { ...(e.style ?? {}), opacity: 0.1 },
        labelStyle: { fontSize: 12, fontWeight: 500, opacity: 0.12 },
      }
    })

    return { displayNodes, displayEdges }
  }, [baseNodes, baseEdges, edges, step, prefersReducedMotion])

  const reset = () => {
    setPlaying(false)
    setStep(0)
  }
  const prev = () => {
    setPlaying(false)
    setStep((s) => Math.max(0, s - 1))
  }
  const next = () => {
    setPlaying(false)
    setStep((s) => Math.min(totalSteps, s + 1))
  }
  const togglePlay = () => {
    if (playing) {
      setPlaying(false)
      return
    }
    if (atEnd) setStep(1) // restart from the top if parked at the end
    setPlaying(true)
  }

  return (
    <div className={styles.wrap} style={{ height }}>
      {totalSteps > 0 && (
        <div className={styles.stepBar} role="group" aria-label="Diagram walkthrough">
          <button
            type="button"
            className={styles.stepBtn}
            onClick={togglePlay}
            aria-label={playing ? 'Pause walkthrough' : 'Play walkthrough'}
          >
            {playing ? '❚❚' : '▶'} {playing ? 'Pause' : step === 0 ? 'Walk through' : 'Play'}
          </button>
          <button
            type="button"
            className={styles.stepBtn}
            onClick={prev}
            disabled={step === 0}
            aria-label="Previous step"
          >
            ‹
          </button>
          <span className={styles.stepLabel} aria-live="polite">
            {step} / {totalSteps}
          </span>
          <button
            type="button"
            className={styles.stepBtn}
            onClick={next}
            disabled={atEnd}
            aria-label="Next step"
          >
            ›
          </button>
          <button
            type="button"
            className={styles.stepBtn}
            onClick={reset}
            disabled={step === 0}
            aria-label="Reset"
          >
            ↺
          </button>
        </div>
      )}
      <div
        className={styles.canvas}
        style={{ '--flow-canvas-w': `${legibleCanvasWidth}px` } as React.CSSProperties}
      >
        <ReactFlow
          nodes={displayNodes}
          edges={displayEdges}
          nodeTypes={NODE_TYPES}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          proOptions={{ hideAttribution: true }}
          /* Page scroll always wins. React Flow's defaults (zoomOnScroll +
             preventScrolling) swallow every wheel event over the canvas, so a
             diagram became a dead zone you couldn't scroll past. Pan is gated
             to the mouse for the same reason: on touch, dragging the canvas
             hijacked the vertical swipe that should scroll the page — there the
             canvas is a plain horizontal scroller instead (see .canvas). Zoom
             stays available via trackpad/touch pinch and the +/− controls. */
          zoomOnScroll={false}
          preventScrolling={false}
          panOnDrag={coarsePointer ? false : [0]}
          zoomOnPinch
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          elementsSelectable={false}
          minZoom={0.4}
          maxZoom={2.5}
        >
          <Background gap={28} size={1} className={styles.bg} />
          <Controls showInteractive={false} className={styles.controls} />
        </ReactFlow>
      </div>
    </div>
  )
}
