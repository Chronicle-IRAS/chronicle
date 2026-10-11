import { BaseEdge, getBezierPath } from '@xyflow/react'
import type { EdgeProps } from '@xyflow/react'

export function DriftEdge(props: EdgeProps) {
  const [path] = getBezierPath(props)
  return <g data-drift-edge={props.id} data-source={props.source} data-target={props.target}
    data-sx={props.sourceX} data-sy={props.sourceY} data-tx={props.targetX} data-ty={props.targetY}
    data-sp={props.sourcePosition} data-tp={props.targetPosition}>
    <BaseEdge id={props.id} path={path} style={props.style} markerEnd={props.markerEnd} markerStart={props.markerStart} interactionWidth={props.interactionWidth} />
    <path d={path} className="composition-signal" fill="none" pointerEvents="none" />
  </g>
}
