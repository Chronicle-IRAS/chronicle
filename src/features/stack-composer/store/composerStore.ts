import type { Connection, EdgeChange, NodeChange, XYPosition } from '../types'
import { create } from 'zustand'
import { createInitialTechNodes } from '../data/initialNodes'
import { normalizeComposition } from '../engine/composition'
import type { ComposerEdge, ComposerNode, TechNode } from '../types'

type ComposerState = {
  techNodes: TechNode[]
  edges: ComposerEdge[]
  resultPositions: Record<string, XYPosition>
  resultMeasurements: Record<string, { width: number; height: number }>
  onNodesChange: (changes: NodeChange<ComposerNode>[]) => void
  onEdgesChange: (changes: EdgeChange<ComposerEdge>[]) => void
  connect: (connection: Connection) => void
}

export const useComposerStore = create<ComposerState>((set) => ({
  techNodes: createInitialTechNodes(typeof window === 'undefined' ? 1280 : window.innerWidth),
  edges: [],
  resultPositions: {},
  resultMeasurements: {},
  onNodesChange: (changes) => set((state) => {
    const techIds = new Set(state.techNodes.map((node) => node.id))
    const techChanges = changes.filter((change) =>
      techIds.has(change.type === 'add' ? change.item.id : change.id),
    ) as NodeChange<TechNode>[]
    let techNodes = state.techNodes
    for (const change of techChanges) {
      if (change.type === 'add') { techNodes = [...techNodes, change.item]; continue }
      if (change.type === 'remove') { techNodes = techNodes.filter(node => node.id !== change.id); continue }
      techNodes = techNodes.map(node => {
        if (node.id !== change.id) return node
        if (change.type === 'select') return { ...node, selected: change.selected }
        if (change.type === 'position' && change.position) return { ...node, position: change.position }
        if (change.type === 'dimensions' && change.dimensions) return { ...node, measured: change.dimensions }
        return node
      })
    }
    let resultPositions = state.resultPositions
    let resultMeasurements = state.resultMeasurements
    for (const change of changes) {
      if (change.type === 'position' && change.position && change.id.startsWith('result:')) {
        resultPositions = { ...resultPositions, [change.id]: change.position }
      }
      if (change.type === 'dimensions' && change.dimensions && change.id.startsWith('result:')) {
        resultMeasurements = { ...resultMeasurements, [change.id]: change.dimensions }
      }
    }
    return { techNodes, resultPositions, resultMeasurements }
  }),
  onEdgesChange: (changes) => set((state) => ({ edges: changes.reduce((edges, change) => change.type === 'remove' ? edges.filter(edge => edge.id !== change.id) : [...edges, change.item], state.edges) })),
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
    return { edges: [...state.edges, { ...connection, id: `composition:${key}`, type: 'default', animated: false }] }
  }),
}))
