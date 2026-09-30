import { Background, BackgroundVariant, ReactFlow } from '@xyflow/react'
import type { Connection, Edge, NodeTypes, ReactFlowInstance } from '@xyflow/react'
import { useEffect, useMemo, useRef } from 'react'
import { useSceneStore } from '../../../stores/sceneStore'
import { deriveResultNodes } from '../engine/composition'
import { useComposerStore } from '../store/composerStore'
import type { ComposerEdge, ComposerNode } from '../types'
import { ResultNode } from './ResultNode'
import { TechNode } from './TechNode'
import { ComposerWorkbench } from './ComposerWorkbench'

const nodeTypes: NodeTypes = { tech: TechNode, project: ResultNode, concept: ResultNode }

export function StackComposer() {
  const interactive = useSceneStore((state) => state.composerReady && state.currentScene === 'composer')
  const canvasRef = useRef<HTMLDivElement>(null)
  const flowRef = useRef<ReactFlowInstance<ComposerNode, ComposerEdge> | null>(null)
  const techNodes = useComposerStore((state) => state.techNodes)
  const edges = useComposerStore((state) => state.edges)
  const resultPositions = useComposerStore((state) => state.resultPositions)
  const resultMeasurements = useComposerStore((state) => state.resultMeasurements)
  const onNodesChange = useComposerStore((state) => state.onNodesChange)
  const onEdgesChange = useComposerStore((state) => state.onEdgesChange)
  const connect = useComposerStore((state) => state.connect)
  const nodes: ComposerNode[] = useMemo(
    () => [...techNodes, ...deriveResultNodes(techNodes, edges, resultPositions).map((node) => ({ ...node, measured: resultMeasurements[node.id] }))],
    [techNodes, edges, resultPositions, resultMeasurements],
  )
  const isValidConnection = (connection: Connection | Edge) =>
    connection.source !== connection.target &&
    techNodes.some((node) => node.id === connection.source) &&
    techNodes.some((node) => node.id === connection.target)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const observer = new ResizeObserver(() => { void flowRef.current?.fitView({ padding: 0.25, duration: 0 }) })
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={canvasRef} className="composer-canvas" aria-label="Stack Composer canvas" inert={!interactive} data-interactive={interactive}>
      <ReactFlow<ComposerNode>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onInit={(instance) => { flowRef.current = instance }}
        onNodesChange={interactive ? onNodesChange : undefined}
        onEdgesChange={interactive ? onEdgesChange : undefined}
        onConnect={interactive ? connect : undefined}
        isValidConnection={isValidConnection}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.2}
        maxZoom={1}
        nodesDraggable={interactive}
        nodesConnectable={interactive}
        elementsSelectable={interactive}
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        autoPanOnNodeDrag={false}
        autoPanOnConnect={false}
        preventScrolling={false}
        disableKeyboardA11y={!interactive}
        deleteKeyCode={interactive ? ['Backspace', 'Delete'] : null}
      >
        <Background variant={BackgroundVariant.Lines} gap={58} size={1} color="#6380762b" />
      </ReactFlow>
      <ComposerWorkbench />
    </div>
  )
}
