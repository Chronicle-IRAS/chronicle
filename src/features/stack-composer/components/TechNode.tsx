import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import type { TechNode as TechNodeType } from '../types'

export function TechNode({ data }: NodeProps<TechNodeType>) {
  return (
    <div className="flow-node tech-node">
      <Handle type="target" position={Position.Left} />
      <span className="flow-node-kind">TECH</span>
      <strong>{data.label}</strong>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}
