import type { Edge, Node } from '@xyflow/react'

export type TechId = 'react' | 'vue' | 'typescript' | 'nodejs' | 'esp32' | 'ai'
export type TechNode = Node<{ label: string; techId: TechId }, 'tech'>
export type ResultNode = Node<{ label: string; ingredients: string }, 'project' | 'concept'>
export type ComposerNode = TechNode | ResultNode
export type ComposerEdge = Edge
