import { useState, type CSSProperties } from 'react'

type Entry = { label: string; value: string }
type Shard = { p: string; c: string; z: number }

// Inspired by Bryan James' "Species in Pieces": every form is built from the exact same 18 triangles,
// allowing native CSS interpolation of polygon(x1 y1, x2 y2, x3 y3) coordinates between chapters.
const POLYGON_FORMS: Shard[][] = [
  // Form 0: Origami Peregrine Falcon (Building / Open Source)
  [
    { p: '50% 6%, 41% 24%, 59% 24%', c: '#f40c3f', z: 18 },
    { p: '41% 24%, 59% 24%, 50% 44%', c: '#c81e38', z: 14 },
    { p: '41% 24%, 10% 14%, 31% 42%', c: '#fdfaf5', z: 10 },
    { p: '59% 24%, 90% 14%, 69% 42%', c: '#e8e2d5', z: 10 },
    { p: '10% 14%, 4% 38%, 31% 42%', c: '#f40c3f', z: 6 },
    { p: '90% 14%, 96% 38%, 69% 42%', c: '#d11536', z: 6 },
    { p: '31% 42%, 50% 44%, 38% 64%', c: '#294045', z: 12 },
    { p: '69% 42%, 50% 44%, 62% 64%', c: '#1f3237', z: 12 },
    { p: '31% 42%, 14% 58%, 38% 64%', c: '#f2c97d', z: 4 },
    { p: '69% 42%, 86% 58%, 62% 64%', c: '#deb368', z: 4 },
    { p: '50% 44%, 38% 64%, 62% 64%', c: '#fdfaf5', z: 16 },
    { p: '38% 64%, 62% 64%, 50% 82%', c: '#f40c3f', z: 11 },
    { p: '38% 64%, 26% 86%, 50% 82%', c: '#38575c', z: 5 },
    { p: '62% 64%, 74% 86%, 50% 82%', c: '#2b454a', z: 5 },
    { p: '50% 82%, 42% 96%, 58% 96%', c: '#f2c97d', z: 8 },
    { p: '4% 38%, 14% 58%, 31% 42%', c: '#4d7378', z: 2 },
    { p: '96% 38%, 86% 58%, 69% 42%', c: '#3b5d62', z: 2 },
    { p: '50% 6%, 32% 18%, 41% 24%', c: '#f2c97d', z: 15 },
  ],
  // Form 1: Geometric Sentinel Fox (Exploring / Background)
  [
    { p: '24% 8%, 18% 36%, 40% 28%', c: '#f40c3f', z: 14 },
    { p: '76% 8%, 82% 36%, 60% 28%', c: '#d11536', z: 14 },
    { p: '24% 8%, 32% 28%, 40% 28%', c: '#160000', z: 18 },
    { p: '76% 8%, 68% 28%, 60% 28%', c: '#160000', z: 18 },
    { p: '40% 28%, 60% 28%, 50% 48%', c: '#e85338', z: 16 },
    { p: '18% 36%, 40% 28%, 32% 54%', c: '#f28b50', z: 10 },
    { p: '82% 36%, 60% 28%, 68% 54%', c: '#d9743b', z: 10 },
    { p: '40% 28%, 50% 48%, 32% 54%', c: '#f40c3f', z: 12 },
    { p: '60% 28%, 50% 48%, 68% 54%', c: '#c81e38', z: 12 },
    { p: '18% 36%, 12% 62%, 32% 54%', c: '#fdfaf5', z: 6 },
    { p: '82% 36%, 88% 62%, 68% 54%', c: '#e8e2d5', z: 6 },
    { p: '32% 54%, 50% 48%, 50% 78%', c: '#f40c3f', z: 15 },
    { p: '68% 54%, 50% 48%, 50% 78%', c: '#b8142c', z: 15 },
    { p: '12% 62%, 32% 54%, 38% 78%', c: '#fdfaf5', z: 8 },
    { p: '88% 62%, 68% 54%, 62% 78%', c: '#ded7c8', z: 8 },
    { p: '32% 54%, 38% 78%, 50% 78%', c: '#f2c97d', z: 11 },
    { p: '68% 54%, 62% 78%, 50% 78%', c: '#deb368', z: 11 },
    { p: '38% 78%, 62% 78%, 50% 93%', c: '#160000', z: 20 },
  ],
  // Form 2: Ascending Origami Crane (Learning / Focus)
  [
    { p: '84% 12%, 66% 22%, 74% 28%', c: '#f40c3f', z: 18 },
    { p: '66% 22%, 74% 28%, 54% 48%', c: '#fdfaf5', z: 14 },
    { p: '54% 48%, 36% 44%, 46% 64%', c: '#e8e2d5', z: 12 },
    { p: '36% 44%, 8% 16%, 28% 58%', c: '#f2c97d', z: 16 },
    { p: '54% 48%, 88% 36%, 64% 62%', c: '#deb368', z: 8 },
    { p: '8% 16%, 20% 42%, 36% 44%', c: '#f40c3f', z: 15 },
    { p: '88% 36%, 96% 52%, 64% 62%', c: '#c81e38', z: 6 },
    { p: '28% 58%, 46% 64%, 34% 78%', c: '#355459', z: 10 },
    { p: '46% 64%, 64% 62%, 52% 80%', c: '#284145', z: 10 },
    { p: '36% 44%, 54% 48%, 64% 62%', c: '#fdfaf5', z: 13 },
    { p: '28% 58%, 12% 88%, 34% 78%', c: '#f40c3f', z: 9 },
    { p: '34% 78%, 46% 64%, 52% 80%', c: '#f2c97d', z: 11 },
    { p: '52% 80%, 44% 95%, 60% 92%', c: '#4d7378', z: 5 },
    { p: '66% 22%, 52% 36%, 54% 48%', c: '#d8d0c1', z: 11 },
    { p: '8% 16%, 4% 34%, 28% 58%', c: '#4d7378', z: 7 },
    { p: '12% 88%, 24% 94%, 34% 78%', c: '#1f3237', z: 4 },
    { p: '64% 62%, 78% 76%, 52% 80%', c: '#3b5d62', z: 6 },
    { p: '84% 12%, 92% 16%, 74% 28%', c: '#160000', z: 19 },
  ],
  // Form 3: Bauhaus Tessellated Crystal Monolith (Tools)
  [
    { p: '50% 4%, 26% 22%, 50% 30%', c: '#fdfaf5', z: 16 },
    { p: '50% 4%, 74% 22%, 50% 30%', c: '#e0d8c8', z: 16 },
    { p: '26% 22%, 14% 46%, 50% 30%', c: '#f40c3f', z: 12 },
    { p: '74% 22%, 86% 46%, 50% 30%', c: '#b8142c', z: 12 },
    { p: '14% 46%, 50% 30%, 34% 58%', c: '#f2c97d', z: 18 },
    { p: '86% 46%, 50% 30%, 66% 58%', c: '#d6ab5e', z: 18 },
    { p: '50% 30%, 34% 58%, 66% 58%', c: '#fdfaf5', z: 22 },
    { p: '14% 46%, 22% 74%, 34% 58%', c: '#355459', z: 8 },
    { p: '86% 46%, 78% 74%, 66% 58%', c: '#243c40', z: 8 },
    { p: '34% 58%, 66% 58%, 50% 76%', c: '#f40c3f', z: 19 },
    { p: '22% 74%, 34% 58%, 50% 76%', c: '#4d7378', z: 14 },
    { p: '78% 74%, 66% 58%, 50% 76%', c: '#325054', z: 14 },
    { p: '22% 74%, 50% 76%, 50% 96%', c: '#f2c97d', z: 10 },
    { p: '78% 74%, 50% 76%, 50% 96%', c: '#c4984a', z: 10 },
    { p: '26% 22%, 8% 30%, 14% 46%', c: '#294045', z: 4 },
    { p: '74% 22%, 92% 30%, 86% 46%', c: '#1b2d30', z: 4 },
    { p: '14% 46%, 8% 64%, 22% 74%', c: '#f40c3f', z: 5 },
    { p: '86% 46%, 92% 64%, 78% 74%', c: '#9e1126', z: 5 },
  ],
]

const FORM_NAMES = ['ORIGAMI PEREGRINE', 'SENTINEL VULPES', 'ASCENDING CRANE', 'BAUHAUS MONOLITH']

export function ChapterExplorer({ entries, chapter }: { entries: Entry[]; chapter: 'currently' | 'profile' }) {
  const [selected, setSelected] = useState(0)
  const [angle, setAngle] = useState(20)
  const [playing, setPlaying] = useState(true)
  const details = chapter === 'currently'
    ? ['A visual blueprint editor for Qt 6 projects. Connect C++ + Qt in the previous chapter to discover its public repository.', 'A space to explore how tools, context and decisions come together in an agent.', 'An open page for the next thing to learn. This entry is intentionally unwritten.']
    : ['A space for projects shared with others. Personal details will be added here.', 'The story behind the work. This chapter is still being written.', 'A place for the questions that deserve more time. Details are coming later.', 'The tools behind the ideas. Explore the interactive stack in chapter 02.']
  const formIndex = (chapter === 'profile' ? selected : selected % 3) % POLYGON_FORMS.length
  const shards = POLYGON_FORMS[formIndex]

  return <div className="chapter-explorer">
    <dl className="text-list explorer-list">{entries.map(({ label, value }, index) => <div key={label} data-impact-piece>
      <dt><button type="button" aria-label={`${label}: ${value || 'To be written'}`} aria-controls={`${chapter}-detail`} aria-pressed={selected === index} onClick={() => setSelected(index)}><span>0{index + 1}</span>{label}<b aria-hidden="true">{selected === index ? '−' : '+'}</b></button></dt>
      <dd>{value || 'To be written'}</dd>
    </div>)}</dl>
    <aside className="chapter-detail" id={`${chapter}-detail`} aria-label="Selected chapter detail">
      <div className="chapter-sculpture" data-playing={playing} data-form={selected} style={{ '--instrument-angle': `${angle}deg`, '--chapter-index': selected } as CSSProperties} aria-hidden="true">
        <div className="sculpture-object">
          {shards.map((shard, i) => <div
            className="sculpture-rib"
            key={i}
            style={{
              '--rib': i,
              '--shard-bg': shard.c,
              '--shard-z': `${shard.z}px`,
              clipPath: `polygon(${shard.p})`,
            } as CSSProperties}
          />)}
        </div>
        <div className="sculpture-coordinate">IN PIECES // 18 SHARDS · {FORM_NAMES[formIndex]} · 0{selected + 1}</div>
      </div>
      <div className="chapter-detail-copy" key={selected} aria-live="polite"><small>SELECTED / 0{selected + 1} · #IP-000{selected + 1}</small><h3>{entries[selected].value || entries[selected].label}</h3><p>{details[selected]}</p></div>
      <label className="instrument-control">ROTATE THE IDEA <input aria-label="Rotate the chapter sculpture" type="range" min="0" max="360" value={angle} onChange={(event) => setAngle(Number(event.target.value))} /></label>
      <button className="sculpture-toggle" type="button" aria-pressed={!playing} onClick={() => setPlaying(!playing)}>{playing ? 'Ⅱ FREEZE FORM' : '▷ SET IN MOTION'}<span aria-hidden="true">↗</span></button>
    </aside>
  </div>
}

