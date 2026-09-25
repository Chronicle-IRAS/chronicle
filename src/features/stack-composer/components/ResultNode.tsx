import type { NodeProps } from '@xyflow/react'
import type { ResultNode as ResultNodeType } from '../types'

export function ResultNode({ data, type }: NodeProps<ResultNodeType>) {
  return (
    <div className={`flow-node result-node ${type === 'project' ? 'project-node' : 'concept-node'}`}>
      <span className="flow-node-kind">{type === 'project' ? 'PROJECT' : 'CONCEPT'}</span>
      <strong>{data.label}</strong>
      <small>{data.ingredients}</small>
    </div>
  )
}
