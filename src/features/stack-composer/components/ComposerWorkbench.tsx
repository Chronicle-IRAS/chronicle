import { useState } from 'react'
import { useComposerStore } from '../store/composerStore'

export function ComposerWorkbench() {
  const nodes = useComposerStore((state) => state.techNodes)
  const edges = useComposerStore((state) => state.edges)
  const connect = useComposerStore((state) => state.connect)
  const removeEdges = useComposerStore((state) => state.onEdgesChange)
  const selectNodes = useComposerStore((state) => state.onNodesChange)
  const [message, setMessage] = useState('Choose two technologies. See what they become.')
  const selected = nodes.filter((node) => node.selected)
  const toggle = (id: string) => {
    const node = nodes.find((item) => item.id === id)
    if (!node) return
    if (!node.selected && selected.length >= 2) {
      setMessage('Two at a time — deselect one to try another pairing.')
      return
    }
    selectNodes([{ id, type: 'select', selected: !node.selected }])
    setMessage('Connect your selection to discover a new result.')
  }
  const compose = () => {
    if (selected.length !== 2) return
    const [a, b] = selected
    const exists = edges.some((edge) => (edge.source === a.id && edge.target === b.id) || (edge.source === b.id && edge.target === a.id))
    connect({ source: a.id, target: b.id, sourceHandle: null, targetHandle: null })
    setMessage(exists ? 'Already connected. Try another pairing.' : `${a.data.label} + ${b.data.label} connected. Your result is on the board.`)
    selectNodes(selected.map((node) => ({ id: node.id, type: 'select', selected: false })))
  }
  return <aside className="composer-workbench" aria-label="Composition workbench">
    <div className="workbench-title"><strong>THE COMPOSITION LAB</strong><span>{edges.length} CONNECTIONS</span></div>
    <div className="workbench-techs">{nodes.map((node) => <button key={node.id} type="button" aria-pressed={!!node.selected} onClick={() => toggle(node.id)}>{node.data.label}<span>{node.selected ? '−' : '+'}</span></button>)}</div>
    <div className="workbench-action"><p aria-live="polite">{message}</p><button type="button" disabled={selected.length !== 2} onClick={compose}>CONNECT ↗</button></div>
    {edges.length > 0 && <div className="workbench-connections">{edges.map((edge) => {
      const label = `${nodes.find((node) => node.id === edge.source)?.data.label} + ${nodes.find((node) => node.id === edge.target)?.data.label}`
      return <button type="button" key={edge.id} aria-label={`Disconnect ${label}`} onClick={() => { removeEdges([{ id: edge.id, type: 'remove' }]); setMessage(`${label} disconnected.`) }}>{label} ×</button>
    })}</div>}
  </aside>
}
