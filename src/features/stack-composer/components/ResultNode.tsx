import type { NodeProps } from '@xyflow/react'
import type { ResultNode as ResultNodeType } from '../types'

export function ResultNode({ data, type }: NodeProps<ResultNodeType>) {
  return (
    <div className={`flow-node result-node ${type === 'project' ? 'project-node' : 'concept-node'}`}>
      <span className="node-decoration" aria-hidden="true">
        <span className="node-orbit" />
        <span className="node-shard" />
      </span>
      <span className="flow-node-kind">{type === 'project' ? '▲ VERIFIED BUILD // #PRJ' : '△ CONCEPTUAL SYNTHESIS // #EXP'}</span>
      {type === 'project' && data.href ? <a className="project-link nodrag nopan" href={data.href} target="_blank" rel="noopener noreferrer" aria-label={`Open ${data.label} on GitHub (new tab)`}><strong>{data.label}</strong><span className="project-link-action">Explore project <span aria-hidden="true">↗</span></span></a> : <strong>{data.label}</strong>}
      <small>{data.ingredients}</small>
    </div>
  )
}

