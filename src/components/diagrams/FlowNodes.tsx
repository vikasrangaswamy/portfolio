import { Handle, Position, type NodeProps } from '@xyflow/react'
import styles from './FlowDiagram.module.css'

type Data = { label: string }

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

/** Standard rectangle node. */
export function DefaultNode({ data }: NodeProps) {
  const { label } = data as Data
  return (
    <div className={styles.node}>
      <Handle type="target" position={Position.Top} className={styles.handle} />
      <Handle type="target" position={Position.Left} className={styles.handle} />
      <Label text={label} />
      <Handle type="source" position={Position.Right} className={styles.handle} />
      <Handle type="source" position={Position.Bottom} className={styles.handle} />
    </div>
  )
}

/** Diamond — used for decision points (Mermaid `{...}` syntax). */
export function DecisionNode({ data }: NodeProps) {
  const { label } = data as Data
  return (
    <div className={`${styles.node} ${styles.decision}`}>
      <Handle type="target" position={Position.Top} className={styles.handle} />
      <Handle type="target" position={Position.Left} className={styles.handle} />
      <div className={styles.decisionInner}>
        <Label text={label} />
      </div>
      <Handle type="source" position={Position.Right} className={styles.handle} />
      <Handle type="source" position={Position.Bottom} className={styles.handle} />
    </div>
  )
}

/** Database / store — rectangle with a cylinder cap on top. Used for the
 *  Mermaid `[(...)]` shape. */
export function DataNode({ data }: NodeProps) {
  const { label } = data as Data
  return (
    <div className={`${styles.node} ${styles.data}`}>
      <Handle type="target" position={Position.Top} className={styles.handle} />
      <Handle type="target" position={Position.Left} className={styles.handle} />
      <Label text={label} />
      <Handle type="source" position={Position.Right} className={styles.handle} />
      <Handle type="source" position={Position.Bottom} className={styles.handle} />
    </div>
  )
}
