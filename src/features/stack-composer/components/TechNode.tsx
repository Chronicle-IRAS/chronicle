import { Handle, Position } from '@xyflow/react'
import type { NodeProps } from '@xyflow/react'
import type { TechNode as TechNodeType } from '../types'

const TECH_CODES: Record<string, string> = {
  react: '#aw-01/08',
  vue: '#aw-02/08',
  typescript: '#aw-03/08',
  nodejs: '#aw-04/08',
  esp32: '#aw-05/08',
  ai: '#aw-06/08',
  cpp: '#aw-07/08',
  qt: '#aw-08/08',
}

export function TechNode({ data }: NodeProps<TechNodeType>) {
  return (
    <div className="flow-node tech-node" data-tech={data.techId}>
      <Handle type="target" position={Position.Left} />
      <span className="node-decoration" aria-hidden="true">
        <span className="node-orbit" />
        <span className="node-shard" />
      </span>
      <span className="node-spark" aria-hidden="true">{TECH_CODES[data.techId] ?? '#aw-00/08'}</span>
      <strong>{data.label}</strong>
      <span className="node-caption">MOD // ACTIVE NODE</span>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

