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
import '@xyflow/react/dist/style.css'
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

const SIZE_BY_KIND: Record<FlowNodeKind, { w: number; h: number }> = {
  default: { w: 180, h: 62 },
  decision: { w: 200, h: 100 },
  data: { w: 170, h: 70 },
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

  for (const node of nodes) {
    const kind = node.type ?? 'default'
    const { w, h } = SIZE_BY_KIND[kind]
    g.setNode(node.id, {
      width: node.width ?? w,
      height: node.height ?? h,
    })
  }
  for (const edge of edges) {
    g.setEdge(edge.from, edge.to)
  }

  dagre.layout(g)

  const flowNodes: Node[] = nodes.map((node) => {
    const positioned = g.node(node.id)
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
