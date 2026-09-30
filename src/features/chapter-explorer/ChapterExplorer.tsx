import { useState, type CSSProperties } from 'react'

type Entry = { label: string; value: string }

export function ChapterExplorer({ entries, chapter }: { entries: Entry[]; chapter: 'currently' | 'profile' }) {
  const [selected, setSelected] = useState(0)
  const [angle, setAngle] = useState(20)
  const details = chapter === 'currently'
    ? ['A canvas for connecting technologies. Try React + TypeScript in the previous chapter to reveal the Blueprint Editor.', 'A space to explore how tools, context and decisions come together in an agent.', 'An open page for the next thing to learn. This entry is intentionally unwritten.']
    : ['A space for projects shared with others. Personal details will be added here.', 'The story behind the work. This chapter is still being written.', 'A place for the questions that deserve more time. Details are coming later.', 'The tools behind the ideas. Explore the interactive stack in chapter 02.']
  return <div className="chapter-explorer">
    <dl className="text-list explorer-list">{entries.map(({ label, value }, index) => <div key={label} data-impact-piece>
      <dt><button type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}><span>0{index + 1}</span>{label}<b aria-hidden="true">{selected === index ? '−' : '+'}</b></button></dt>
      <dd>{value || 'To be written'}</dd>
    </div>)}</dl>
    <aside className="chapter-detail" aria-label="Selected chapter detail">
      <div className="chapter-sculpture" style={{ '--instrument-angle': `${angle}deg`, '--chapter-index': selected } as CSSProperties} aria-hidden="true">
        <div className="instrument-ring" /><div className="instrument-ring second" /><div className="instrument-core">0{selected + 1}</div>
        {entries.map((entry, index) => <i key={entry.label} data-selected={selected === index} style={{ '--point-angle': `${index * 360 / entries.length}deg` } as CSSProperties} />)}
      </div>
      <div className="chapter-detail-copy" key={selected} aria-live="polite"><small>SELECTED / 0{selected + 1}</small><h3>{entries[selected].value || entries[selected].label}</h3><p>{details[selected]}</p></div>
      <label className="instrument-control">ROTATE THE IDEA <input aria-label="Rotate the chapter sculpture" type="range" min="0" max="360" value={angle} onChange={(event) => setAngle(Number(event.target.value))} /></label>
    </aside>
  </div>
}
