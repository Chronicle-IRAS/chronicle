import { Background, Controls, ReactFlow } from '@xyflow/react'
import type { Connection, Edge, NodeTypes, ReactFlowInstance } from '@xyflow/react'
import { useEffect, useMemo, useRef } from 'react'
import { useSceneStore } from '../../../stores/sceneStore'
import { deriveResultNodes } from '../engine/composition'
import { useComposerStore } from '../store/composerStore'
import type { ComposerEdge, ComposerNode } from '../types'
import { ResultNode } from './ResultNode'
import { TechNode } from './TechNode'

const nodeTypes: NodeTypes = { tech: TechNode, project: ResultNode, concept: ResultNode }

export function StackComposer() {
  const interactive = useSceneStore((state) => state.composerReady && state.currentScene === 'composer')
  const canvasRef = useRef<HTMLDivElement>(null)
  const flowRef = useRef<ReactFlowInstance<ComposerNode, ComposerEdge> | null>(null)
  const techNodes = useComposerStore((state) => state.techNodes)
  const edges = useComposerStore((state) => state.edges)
  const resultPositions = useComposerStore((state) => state.resultPositions)
  const onNodesChange = useComposerStore((state) => state.onNodesChange)
  const onEdgesChange = useComposerStore((state) => state.onEdgesChange)
  const connect = useComposerStore((state) => state.connect)
  const nodes: ComposerNode[] = useMemo(
    () => [...techNodes, ...deriveResultNodes(techNodes, edges, resultPositions)],
    [techNodes, edges, resultPositions],
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

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => { void flowRef.current?.fitView({ padding: 0.25, duration: 0 }) })
    return () => window.cancelAnimationFrame(frame)
  }, [nodes.length])

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
        panOnDrag={interactive}
        zoomOnScroll={interactive}
        zoomOnPinch={interactive}
        zoomOnDoubleClick={interactive}
        disableKeyboardA11y={!interactive}
        deleteKeyCode={interactive ? ['Backspace', 'Delete'] : null}
      >
        <Background gap={24} size={1} color="#303a41" />
        <Controls showInteractive={false} showZoom={interactive} showFitView={interactive} />
      </ReactFlow>
    </div>
  )
}
