import type { ComposerEdge, ResultNode, TechId, TechNode } from '../types'

export type Composition = { key: string; kind: 'project' | 'concept'; label: string; href?: string }

// Verified against the owner's public repository READMEs. Unmatched pairs are concepts.
const recipes: Record<string, { label: string; href: string }> = {
  'esp32+vue': { label: 'ESP32 Monitor', href: 'https://github.com/Chronicle-IRAS/monitor' },
  'cpp+qt': { label: 'Qt Blueprint Generator', href: 'https://github.com/Chronicle-IRAS/qt-blueprint-generator' },
  'ai+typescript': { label: 'PaLM Netlify Proxy', href: 'https://github.com/Chronicle-IRAS/palm-netlify-proxy' },
}

export function normalizeComposition(techIds: readonly string[]): string {
  return [...new Set(techIds)].sort().join('+')
}

export function resolveComposition(techIds: readonly string[]): Composition {
  const key = normalizeComposition(techIds)
  const project = recipes[key]
  return project ? { key, kind: 'project', ...project } : { key, kind: 'concept', label: 'A new possibility' }
}

export function deriveResultNodes(
  techNodes: readonly TechNode[],
  edges: readonly ComposerEdge[],
  positions: Readonly<Record<string, { x: number; y: number }>>,
): ResultNode[] {
  const byId = new Map(techNodes.map((node) => [node.id, node]))
  const results = new Map<string, ResultNode>()
  const occupied = techNodes.map(node => ({ ...node.position, width: node.measured?.width ?? 220, height: node.measured?.height ?? 130 }))

  for (const edge of edges) {
    const source = byId.get(edge.source)
    const target = byId.get(edge.target)
    if (!source || !target || source.id === target.id) continue
    const ingredients: TechId[] = [source.data.techId, target.data.techId]
    const composition = resolveComposition(ingredients)
    const id = `result:${composition.key}`
    if (results.has(id)) continue
    const width = 260, height = 176
    const position = positions[id] ? { ...positions[id] } : {
      x: (source.position.x + target.position.x) / 2 + 80,
      y: Math.max(source.position.y, target.position.y) + 160,
    }
    if (!positions[id]) {
      // New results settle in free space; deliberate user positioning stays untouched.
      for (let attempts = 0; attempts <= occupied.length; attempts++) {
        const hits = occupied.filter(rect => position.x < rect.x + rect.width + 24 && position.x + width + 24 > rect.x && position.y < rect.y + rect.height + 24 && position.y + height + 24 > rect.y)
        if (!hits.length) break
        position.y = Math.max(...hits.map(rect => rect.y + rect.height + 32))
      }
    }
    occupied.push({ ...position, width, height })
    results.set(id, {
      id,
      type: composition.kind,
      data: { label: composition.label, ingredients: `${source.data.label} + ${target.data.label}`, href: composition.href },
      position,
      draggable: true,
      connectable: false,
      deletable: false,
    })
  }
  return [...results.values()]
}
