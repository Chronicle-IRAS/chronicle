import { useRef, useState } from 'react'
import { useComposerStore } from '../store/composerStore'
import { resolveComposition } from '../engine/composition'

export function ComposerWorkbench() {
  const nodes = useComposerStore((state) => state.techNodes)
  const edges = useComposerStore((state) => state.edges)
  const connect = useComposerStore((state) => state.connect)
  const removeEdges = useComposerStore((state) => state.onEdgesChange)
  const selectNodes = useComposerStore((state) => state.onNodesChange)
  const [message, setMessage] = useState('Try Vue + ESP32, C++ + Qt, or TypeScript + AI to discover a real project.')
  const [expanded, setExpanded] = useState(() => typeof window === 'undefined' || window.innerWidth > 700)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const selected = nodes.filter((node) => node.selected)
  const latestEdge = edges.at(-1)
  const latestPair = latestEdge ? nodes.filter(node => node.id === latestEdge.source || node.id === latestEdge.target) : []
  const latestProject = latestPair.length === 2 ? resolveComposition(latestPair.map(node => node.data.techId)) : null
  const toggle = (id: string) => {
    const node = nodes.find((item) => item.id === id)
    if (!node) return
    if (!node.selected && selected.length >= 2) {
      setMessage('Two at a time — deselect one to try another pairing.')
      return
    }
    selectNodes([{ id, type: 'select', selected: !node.selected }])
    const count = selected.length + (node.selected ? -1 : 1)
    setMessage(count === 0 ? 'Choose two technologies. See what they become.' : count === 1 ? 'One selected. Choose another technology.' : 'Your pair is ready. Connect to discover the result.')
  }
  const compose = () => {
    if (selected.length !== 2) return
    const [a, b] = selected
    const exists = edges.some((edge) => (edge.source === a.id && edge.target === b.id) || (edge.source === b.id && edge.target === a.id))
    connect({ source: a.id, target: b.id, sourceHandle: null, targetHandle: null })
    setMessage(exists ? 'Already connected. Try another pairing.' : `${a.data.label} + ${b.data.label} connected. Your result is on the board.`)
    selectNodes(selected.map((node) => ({ id: node.id, type: 'select', selected: false })))
    if (window.innerWidth <= 700) { setExpanded(false); toggleRef.current?.focus() }
  }
  return <aside className="composer-workbench" aria-label="Composition workbench">
    <div className="workbench-title"><strong>THE COMPOSITION LAB</strong><span>{edges.length} {edges.length === 1 ? 'CONNECTION' : 'CONNECTIONS'}</span><button ref={toggleRef} className="workbench-toggle" type="button" aria-expanded={expanded} aria-controls="workbench-editor" onClick={() => setExpanded(!expanded)}>{expanded ? 'CLOSE −' : 'COMPOSE +'}</button></div>
    {!expanded && <p className="workbench-summary" role="status">{message}</p>}
    {!expanded && latestProject?.href && <a className="workbench-project-link" href={latestProject.href} target="_blank" rel="noopener noreferrer">Open {latestProject.label}<span aria-hidden="true">↗</span></a>}
    <div id="workbench-editor" hidden={!expanded}>
    <div className="workbench-techs">{nodes.map((node) => <button key={node.id} type="button" aria-label={`Select ${node.data.label}`} aria-pressed={!!node.selected} onClick={() => toggle(node.id)}>{node.data.label}<span aria-hidden="true">{node.selected ? '−' : '+'}</span></button>)}</div>
    <div className="workbench-action"><p aria-live="polite">{message}</p><button type="button" disabled={selected.length !== 2} onClick={compose}>CONNECT ↗</button></div>
    {edges.length > 0 && <div className="workbench-connections">{edges.map((edge) => {
      const label = `${nodes.find((node) => node.id === edge.source)?.data.label} + ${nodes.find((node) => node.id === edge.target)?.data.label}`
      return <button type="button" key={edge.id} aria-label={`Disconnect ${label}`} onClick={() => { removeEdges([{ id: edge.id, type: 'remove' }]); setMessage(`${label} disconnected.`) }}>{label} ×</button>
    })}</div>}
    </div>
  </aside>
}
