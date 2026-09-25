import type { TechNode } from '../types'

export const initialTechNodes: TechNode[] = [
  { id: 'tech:react', type: 'tech', position: { x: 40, y: 55 }, data: { label: 'React', techId: 'react' }, deletable: false },
  { id: 'tech:vue', type: 'tech', position: { x: 40, y: 205 }, data: { label: 'Vue', techId: 'vue' }, deletable: false },
  { id: 'tech:typescript', type: 'tech', position: { x: 290, y: 55 }, data: { label: 'TypeScript', techId: 'typescript' }, deletable: false },
  { id: 'tech:esp32', type: 'tech', position: { x: 290, y: 205 }, data: { label: 'ESP32', techId: 'esp32' }, deletable: false },
  { id: 'tech:nodejs', type: 'tech', position: { x: 540, y: 55 }, data: { label: 'Node.js', techId: 'nodejs' }, deletable: false },
  { id: 'tech:ai', type: 'tech', position: { x: 540, y: 205 }, data: { label: 'AI', techId: 'ai' }, deletable: false },
]
