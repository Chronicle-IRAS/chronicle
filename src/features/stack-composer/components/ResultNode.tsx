import type { NodeProps } from '@xyflow/react'
import type { ResultNode as ResultNodeType } from '../types'

export function ResultNode({ data, type }: NodeProps<ResultNodeType>) {
  return (
    <div className={`flow-node result-node ${type === 'project' ? 'project-node' : 'concept-node'}`}>
      <span className="node-decoration" aria-hidden="true"><span className="node-orbit" /></span>
      <span className="node-topline"><span className="flow-node-kind">{type === 'project' ? 'PROJECT' : 'CONCEPT'}</span><i className="node-signal" aria-hidden="true" /></span>
      <strong>{data.label}</strong>
      <small>{data.ingredients}</small>
    </div>
  )
}
