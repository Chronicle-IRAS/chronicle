export type XYPosition = { x: number; y: number }
type Node<Data, Kind extends string> = {
  id: string; type: Kind; data: Data; position: XYPosition
  selected?: boolean; measured?: { width?: number; height?: number }
  draggable?: boolean; connectable?: boolean; deletable?: boolean
}
export type Connection = { source: string; target: string; sourceHandle?: string | null; targetHandle?: string | null }
export type NodeChange<T extends { id: string }> =
  | { type: 'add'; item: T }
  | { type: 'remove'; id: string }
  | { type: 'select'; id: string; selected: boolean }
  | { type: 'position'; id: string; position?: XYPosition }
  | { type: 'dimensions'; id: string; dimensions?: { width: number; height: number } }
export type EdgeChange<T extends { id: string }> = { type: 'remove'; id: string } | { type: 'add'; item: T }

export type TechId = 'react' | 'vue' | 'typescript' | 'nodejs' | 'esp32' | 'ai' | 'cpp' | 'qt'
export type TechNode = Node<{ label: string; techId: TechId }, 'tech'>
export type ResultNode = Node<{ label: string; ingredients: string; href?: string }, 'project' | 'concept'>
export type ComposerNode = TechNode | ResultNode
export type ComposerEdge = Connection & { id: string; type?: string; animated?: boolean }
