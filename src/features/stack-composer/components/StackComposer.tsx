import { Background, BackgroundVariant, ReactFlow, getViewportForBounds, useNodesInitialized } from '@xyflow/react'
import type { Connection, Edge, NodeTypes, ReactFlowInstance } from '@xyflow/react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSceneStore } from '../../../stores/sceneStore'
import { deriveResultNodes } from '../engine/composition'
import { useComposerStore } from '../store/composerStore'
import type { ComposerEdge, ComposerNode } from '../types'
import { ResultNode } from './ResultNode'
import { TechNode } from './TechNode'
import { ComposerWorkbench } from './ComposerWorkbench'
import { useNodeDrift } from './useNodeDrift'
import { DriftEdge } from './DriftEdge'

const nodeTypes: NodeTypes = { tech: TechNode, project: ResultNode, concept: ResultNode }
const edgeTypes = { default: DriftEdge }

function BoardFit({ fit }: { fit: () => void }) {
  const ready = useNodesInitialized()
  useEffect(() => { if (ready) fit() }, [ready, fit])
  return null
}

export function StackComposer() {
  const interactive = useSceneStore((state) => state.composerReady && state.currentScene === 'composer')
  const reducedMotion = useSceneStore((state) => state.reducedMotion)
  const canvasRef = useRef<HTMLDivElement>(null)
  const flowRef = useRef<ReactFlowInstance<ComposerNode, ComposerEdge> | null>(null)
  const fitBoard = useCallback(() => {
    const canvas = canvasRef.current
    const flow = flowRef.current
    if (!canvas || !flow || !flow.getNodes().length) return
    const toolbar = canvas.querySelector<HTMLElement>('.composer-workbench')
    const availableHeight = Math.max(120, canvas.clientHeight - 104 - (toolbar?.offsetHeight ?? 160) - 56)
    const bounds = flow.getNodesBounds(flow.getNodes().map(node => node.id))
    const view = getViewportForBounds(bounds, Math.max(120, canvas.clientWidth - 48), availableHeight, .2, 1, .12)
    void flow.setViewport({ x: view.x + 24, y: view.y + 104, zoom: view.zoom }, { duration: 0 })
  }, [])
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
  useNodeDrift(canvasRef, flowRef, nodes, edges, interactive && !reducedMotion)
  const isValidConnection = (connection: Connection | Edge) =>
    connection.source !== connection.target &&
    techNodes.some((node) => node.id === connection.source) &&
    techNodes.some((node) => node.id === connection.target)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const observer = new ResizeObserver(fitBoard)
    observer.observe(canvas)
    const toolbar = canvas.querySelector('.composer-workbench')
    if (toolbar) observer.observe(toolbar)
    return () => observer.disconnect()
  }, [fitBoard])

  return (
    <div ref={canvasRef} className="composer-canvas" aria-label="Stack Composer canvas" inert={!interactive} data-interactive={interactive}>
      <ReactFlow<ComposerNode>
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={(instance) => { flowRef.current = instance; fitBoard() }}
        onNodesChange={interactive ? onNodesChange : undefined}
        onEdgesChange={interactive ? onEdgesChange : undefined}
        onConnect={interactive ? connect : undefined}
        isValidConnection={isValidConnection}
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
        autoPanOnNodeFocus={false}
        preventScrolling={false}
        disableKeyboardA11y={!interactive}
        deleteKeyCode={interactive ? ['Backspace', 'Delete'] : null}
      >
        <BoardFit fit={fitBoard} />
        <Background variant={BackgroundVariant.Dots} gap={42} size={1} color="#c3b8dd36" />
      </ReactFlow>
      <ComposerWorkbench />
    </div>
  )
}
