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

/** Diamond — used for decision points (Mermaid `{...}` syntax). */
export function DecisionNode({ data }: NodeProps) {
  const { label, direction } = data as Data
  const { target, source } = positions(direction)
  return (
    <div className={`${styles.node} ${styles.decision}`}>
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
