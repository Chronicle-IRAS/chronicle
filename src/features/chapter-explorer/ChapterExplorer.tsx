import { useState, type CSSProperties } from 'react'

type Entry = { label: string; value: string }

export function ChapterExplorer({ entries, chapter }: { entries: Entry[]; chapter: 'currently' | 'profile' }) {
  const [selected, setSelected] = useState(0)
  const [angle, setAngle] = useState(20)
  const [playing, setPlaying] = useState(true)
  const details = chapter === 'currently'
    ? ['A visual blueprint editor for Qt 6 projects. Connect C++ + Qt in the previous chapter to discover its public repository.', 'A space to explore how tools, context and decisions come together in an agent.', 'An open page for the next thing to learn. This entry is intentionally unwritten.']
    : ['A space for projects shared with others. Personal details will be added here.', 'The story behind the work. This chapter is still being written.', 'A place for the questions that deserve more time. Details are coming later.', 'The tools behind the ideas. Explore the interactive stack in chapter 02.']
  return <div className="chapter-explorer">
    <dl className="text-list explorer-list">{entries.map(({ label, value }, index) => <div key={label} data-impact-piece>
      <dt><button type="button" aria-label={`${label}: ${value || 'To be written'}`} aria-controls={`${chapter}-detail`} aria-pressed={selected === index} onClick={() => setSelected(index)}><span>0{index + 1}</span>{label}<b aria-hidden="true">{selected === index ? '−' : '+'}</b></button></dt>
      <dd>{value || 'To be written'}</dd>
    </div>)}</dl>
    <aside className="chapter-detail" id={`${chapter}-detail`} aria-label="Selected chapter detail">
      <div className="chapter-sculpture" data-playing={playing} data-form={selected} style={{ '--instrument-angle': `${angle}deg`, '--chapter-index': selected } as CSSProperties} aria-hidden="true">
        <div className="sculpture-object">{Array.from({length: 12}, (_, i) => <div className="sculpture-rib" key={i} style={{ '--rib': i } as CSSProperties} />)}</div>
        <div className="sculpture-coordinate">EXPERIMENT / 0{selected + 1}</div>
      </div>
      <div className="chapter-detail-copy" key={selected} aria-live="polite"><small>SELECTED / 0{selected + 1}</small><h3>{entries[selected].value || entries[selected].label}</h3><p>{details[selected]}</p></div>
      <label className="instrument-control">ROTATE THE IDEA <input aria-label="Rotate the chapter sculpture" type="range" min="0" max="360" value={angle} onChange={(event) => setAngle(Number(event.target.value))} /></label>
      <button className="sculpture-toggle" type="button" aria-pressed={!playing} onClick={() => setPlaying(!playing)}>{playing ? 'Ⅱ FREEZE FORM' : '▷ SET IN MOTION'}<span aria-hidden="true">↗</span></button>
    </aside>
  </div>
}
