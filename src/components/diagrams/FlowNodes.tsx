import { Handle, Position, type NodeProps } from '@xyflow/react'
import styles from './FlowDiagram.module.css'

type Data = {
  label: string
  direction: 'TD' | 'LR'
}

/** Renders multi-line labels (split on `\n`). */
function Label({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <span className={styles.nodeLabel}>
      {lines.map((line, i) => (
        <span key={`${i}-${line.slice(0, 8)}`} className={styles.nodeLine}>
          {line}
        </span>
      ))}
    </span>
  )
}

function positions(direction: 'TD' | 'LR') {
  return {
    target: direction === 'TD' ? Position.Top : Position.Left,
    source: direction === 'TD' ? Position.Bottom : Position.Right,
  }
}

/** Standard rectangle node. */
export function DefaultNode({ data }: NodeProps) {
  const { label, direction } = data as Data
  const { target, source } = positions(direction)
  return (
    <div className={styles.node}>
      <Handle type="target" position={target} className={styles.handle} />
      <Label text={label} />
      <Handle type="source" position={source} className={styles.handle} />
    </div>
  )
}

/** Diamond — used for decision points (Mermaid `{...}` syntax). Rendered as
 *  an inline SVG polygon so the stroke survives (clip-path eats CSS
 *  borders). The polygon coordinates work for any size because the SVG uses
 *  preserveAspectRatio="none" — it stretches with the node's width/height. */
export function DecisionNode({ data }: NodeProps) {
  const { label, direction } = data as Data
  const { target, source } = positions(direction)
  return (
    <div className={`${styles.node} ${styles.decision}`}>
      <svg
        className={styles.decisionSvg}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon points="50,2 98,50 50,98 2,50" className={styles.decisionFill} />
        <polygon
          points="50,2 98,50 50,98 2,50"
          className={styles.decisionStroke}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <Handle type="target" position={target} className={styles.handle} />
      <div className={styles.decisionInner}>
        <Label text={label} />
      </div>
      <Handle type="source" position={source} className={styles.handle} />
    </div>
  )
}

/** Database / store — rectangle with a cylinder cap on top. Used for the
 *  Mermaid `[(...)]` shape. */
export function DataNode({ data }: NodeProps) {
  const { label, direction } = data as Data
  const { target, source } = positions(direction)
  return (
    <div className={`${styles.node} ${styles.data}`}>
      <Handle type="target" position={target} className={styles.handle} />
      <Label text={label} />
      <Handle type="source" position={source} className={styles.handle} />
    </div>
  )
}
