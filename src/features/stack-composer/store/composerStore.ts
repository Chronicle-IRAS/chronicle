import { addEdge, applyEdgeChanges, applyNodeChanges } from '@xyflow/react'
import type { Connection, EdgeChange, NodeChange, XYPosition } from '@xyflow/react'
import { create } from 'zustand'
import { initialTechNodes } from '../data/initialNodes'
import { normalizeComposition } from '../engine/composition'
import type { ComposerEdge, ComposerNode, TechNode } from '../types'

type ComposerState = {
  techNodes: TechNode[]
  edges: ComposerEdge[]
  resultPositions: Record<string, XYPosition>
  onNodesChange: (changes: NodeChange<ComposerNode>[]) => void
  onEdgesChange: (changes: EdgeChange<ComposerEdge>[]) => void
  connect: (connection: Connection) => void
}

export const useComposerStore = create<ComposerState>((set) => ({
  techNodes: initialTechNodes,
  edges: [],
  resultPositions: {},
  onNodesChange: (changes) => set((state) => {
    const techIds = new Set(state.techNodes.map((node) => node.id))
    const techChanges = changes.filter((change) =>
      techIds.has(change.type === 'add' ? change.item.id : change.id),
    ) as NodeChange<TechNode>[]
    const techNodes = techChanges.length ? applyNodeChanges(techChanges, state.techNodes) : state.techNodes
    const resultPositions = { ...state.resultPositions }
    for (const change of changes) {
      if (change.type === 'position' && change.position && change.id.startsWith('result:')) {
        resultPositions[change.id] = change.position
      }
    }
    return { techNodes, resultPositions }
  }),
  onEdgesChange: (changes) => set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),
  connect: (connection) => set((state) => {
    const source = state.techNodes.find((node) => node.id === connection.source)
    const target = state.techNodes.find((node) => node.id === connection.target)
    if (!source || !target || source.id === target.id) return state
    const key = normalizeComposition([source.data.techId, target.data.techId])
    const exists = state.edges.some((edge) => {
      const a = state.techNodes.find((node) => node.id === edge.source)
      const b = state.techNodes.find((node) => node.id === edge.target)
      return a && b && normalizeComposition([a.data.techId, b.data.techId]) === key
    })
    if (exists) return state
    return { edges: addEdge({ ...connection, id: `composition:${key}`, type: 'smoothstep', animated: false }, state.edges) }
  }),
}))
