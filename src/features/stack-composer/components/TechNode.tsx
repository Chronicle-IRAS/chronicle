import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import type { TechNode as TechNodeType } from '../types'

export function TechNode({ data }: NodeProps<TechNodeType>) {
  return (
    <div className="flow-node tech-node" data-tech={data.techId}>
      <Handle type="target" position={Position.Left} />
      <span className="node-decoration" aria-hidden="true"><span className="node-orbit" /></span>
      <span className="node-topline"><span className="flow-node-kind">TECHNOLOGY</span><i className="node-signal" aria-hidden="true" /></span>
      <strong>{data.label}</strong>
      <span className="node-caption">COMPOSE / CONNECT</span>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
