import type { ComposerEdge, ResultNode, TechId, TechNode } from '../types'

export type Composition = { key: string; kind: 'project' | 'concept'; label: string }

const recipes: Record<string, string> = {
  'esp32+vue': 'ESP32 Monitor',
  'react+typescript': 'Blueprint Editor',
}

export function normalizeComposition(techIds: readonly string[]): string {
  return [...new Set(techIds)].sort().join('+')
}

export function resolveComposition(techIds: readonly string[]): Composition {
  const key = normalizeComposition(techIds)
  const project = recipes[key]
  return { key, kind: project ? 'project' : 'concept', label: project ?? 'Experimental Concept' }
}

export function deriveResultNodes(
  techNodes: readonly TechNode[],
  edges: readonly ComposerEdge[],
  positions: Readonly<Record<string, { x: number; y: number }>>,
): ResultNode[] {
  const byId = new Map(techNodes.map((node) => [node.id, node]))
  const results = new Map<string, ResultNode>()

  for (const edge of edges) {
    const source = byId.get(edge.source)
    const target = byId.get(edge.target)
    if (!source || !target || source.id === target.id) continue
    const ingredients: TechId[] = [source.data.techId, target.data.techId]
    const composition = resolveComposition(ingredients)
    const id = `result:${composition.key}`
    if (results.has(id)) continue
    results.set(id, {
      id,
      type: composition.kind,
      data: { label: composition.label, ingredients: ingredients.join(' + ') },
      position: positions[id] ?? {
        x: (source.position.x + target.position.x) / 2 + 80,
        y: Math.max(source.position.y, target.position.y) + 90,
      },
      draggable: true,
      connectable: false,
      deletable: false,
    })
  }
  return [...results.values()]
}
