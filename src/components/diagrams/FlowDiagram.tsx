import { useMemo } from 'react'
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
  const { nodes: rfNodes, edges: rfEdges } = useMemo(
    () => autoLayout(nodes, edges, direction),
    [nodes, edges, direction],
  )

  return (
    <div className={styles.wrap} style={{ height }}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={NODE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        proOptions={{ hideAttribution: true }}
        panOnDrag
        zoomOnScroll
        zoomOnPinch
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        minZoom={0.4}
        maxZoom={2.5}
      >
        <Background gap={28} size={1} className={styles.bg} />
        <Controls showInteractive={false} className={styles.controls} />
      </ReactFlow>
    </div>
  )
}
