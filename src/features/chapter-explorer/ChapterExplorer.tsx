import { useState, type CSSProperties } from 'react'

type Entry = { label: string; value: string; detail?: string }
type Shard = { p: string; c: string; z: number; dx: number; dy: number }

// Inspired by Bryan James' "Species in Pieces": every form is built from the exact same 18 triangles,
// allowing native CSS interpolation of polygon(x1 y1, x2 y2, x3 y3) coordinates between chapters,
// plus radial explosion vectors (dx, dy) for interactive 3D shard disassembly.
const POLYGON_FORMS: Shard[][] = [
  // Form 0: Origami Peregrine Falcon (Building / Open Source)
  [
    { p: '50% 4%, 39% 23%, 61% 23%', c: '#f40c3f', z: 24, dx: 0, dy: -36 },
    { p: '39% 23%, 61% 23%, 50% 45%', c: '#c81e38', z: 18, dx: 0, dy: -16 },
    { p: '39% 23%, 6% 10%, 28% 42%', c: '#fdfaf5', z: 14, dx: -38, dy: -22 },
    { p: '61% 23%, 94% 10%, 72% 42%', c: '#e8e2d5', z: 14, dx: 38, dy: -22 },
    { p: '6% 10%, 2% 38%, 28% 42%', c: '#f40c3f', z: 8, dx: -48, dy: -10 },
    { p: '94% 10%, 98% 38%, 72% 42%', c: '#d11536', z: 8, dx: 48, dy: -10 },
    { p: '28% 42%, 50% 45%, 36% 66%', c: '#294045', z: 16, dx: -18, dy: 4 },
    { p: '72% 42%, 50% 45%, 64% 66%', c: '#1f3237', z: 16, dx: 18, dy: 4 },
    { p: '28% 42%, 10% 60%, 36% 66%', c: '#f2c97d', z: 6, dx: -36, dy: 14 },
    { p: '72% 42%, 90% 60%, 64% 66%', c: '#deb368', z: 6, dx: 36, dy: 14 },
    { p: '50% 45%, 36% 66%, 64% 66%', c: '#fdfaf5', z: 22, dx: 0, dy: 10 },
    { p: '36% 66%, 64% 66%, 50% 84%', c: '#f40c3f', z: 15, dx: 0, dy: 24 },
    { p: '36% 66%, 22% 88%, 50% 84%', c: '#38575c', z: 7, dx: -22, dy: 32 },
    { p: '64% 66%, 78% 88%, 50% 84%', c: '#2b454a', z: 7, dx: 22, dy: 32 },
    { p: '50% 84%, 40% 98%, 60% 98%', c: '#f2c97d', z: 11, dx: 0, dy: 44 },
    { p: '2% 38%, 10% 60%, 28% 42%', c: '#4d7378', z: 3, dx: -44, dy: 6 },
    { p: '98% 38%, 90% 60%, 72% 42%', c: '#3b5d62', z: 3, dx: 44, dy: 6 },
    { p: '50% 4%, 29% 16%, 39% 23%', c: '#f2c97d', z: 20, dx: -16, dy: -32 },
  ],
  // Form 1: Geometric Sentinel Fox (Exploring / Background)
  [
    { p: '22% 6%, 16% 36%, 39% 27%', c: '#f40c3f', z: 18, dx: -28, dy: -34 },
    { p: '78% 6%, 84% 36%, 61% 27%', c: '#d11536', z: 18, dx: 28, dy: -34 },
    { p: '22% 6%, 31% 27%, 39% 27%', c: '#160000', z: 24, dx: -22, dy: -38 },
    { p: '78% 6%, 69% 27%, 61% 27%', c: '#160000', z: 24, dx: 22, dy: -38 },
    { p: '39% 27%, 61% 27%, 50% 49%', c: '#e85338', z: 21, dx: 0, dy: -14 },
    { p: '16% 36%, 39% 27%, 30% 55%', c: '#f28b50', z: 13, dx: -32, dy: -6 },
    { p: '84% 36%, 61% 27%, 70% 55%', c: '#d9743b', z: 13, dx: 32, dy: -6 },
    { p: '39% 27%, 50% 49%, 30% 55%', c: '#f40c3f', z: 16, dx: -14, dy: 0 },
    { p: '61% 27%, 50% 49%, 70% 55%', c: '#c81e38', z: 16, dx: 14, dy: 0 },
    { p: '16% 36%, 10% 64%, 30% 55%', c: '#fdfaf5', z: 8, dx: -42, dy: 12 },
    { p: '84% 36%, 90% 64%, 70% 55%', c: '#e8e2d5', z: 8, dx: 42, dy: 12 },
    { p: '30% 55%, 50% 49%, 50% 80%', c: '#f40c3f', z: 20, dx: -10, dy: 18 },
    { p: '70% 55%, 50% 49%, 50% 80%', c: '#b8142c', z: 20, dx: 10, dy: 18 },
    { p: '10% 64%, 30% 55%, 37% 80%', c: '#fdfaf5', z: 10, dx: -30, dy: 26 },
    { p: '90% 64%, 70% 55%, 63% 80%', c: '#ded7c8', z: 10, dx: 30, dy: 26 },
    { p: '30% 55%, 37% 80%, 50% 80%', c: '#f2c97d', z: 14, dx: -12, dy: 28 },
    { p: '70% 55%, 63% 80%, 50% 80%', c: '#deb368', z: 14, dx: 12, dy: 28 },
    { p: '37% 80%, 63% 80%, 50% 95%', c: '#160000', z: 26, dx: 0, dy: 42 },
  ],
  // Form 2: Ascending Origami Crane (Learning / Focus)
  [
    { p: '86% 10%, 66% 21%, 75% 28%', c: '#f40c3f', z: 24, dx: 34, dy: -32 },
    { p: '66% 21%, 75% 28%, 54% 48%', c: '#fdfaf5', z: 18, dx: 22, dy: -16 },
    { p: '54% 48%, 35% 43%, 46% 65%', c: '#e8e2d5', z: 15, dx: -6, dy: 6 },
    { p: '35% 43%, 4% 12%, 26% 58%', c: '#f2c97d', z: 22, dx: -40, dy: -18 },
    { p: '54% 48%, 92% 34%, 65% 63%', c: '#deb368', z: 10, dx: 36, dy: -2 },
    { p: '4% 12%, 18% 41%, 35% 43%', c: '#f40c3f', z: 19, dx: -36, dy: -24 },
    { p: '92% 34%, 98% 53%, 65% 63%', c: '#c81e38', z: 8, dx: 44, dy: 8 },
    { p: '26% 58%, 46% 65%, 33% 80%', c: '#355459', z: 13, dx: -20, dy: 22 },
    { p: '46% 65%, 65% 63%, 52% 82%', c: '#284145', z: 13, dx: 8, dy: 24 },
    { p: '35% 43%, 54% 48%, 65% 63%', c: '#fdfaf5', z: 17, dx: 4, dy: 2 },
    { p: '26% 58%, 10% 90%, 33% 80%', c: '#f40c3f', z: 12, dx: -34, dy: 34 },
    { p: '33% 80%, 46% 65%, 52% 82%', c: '#f2c97d', z: 14, dx: -6, dy: 28 },
    { p: '52% 82%, 43% 97%, 61% 94%', c: '#4d7378', z: 7, dx: 4, dy: 42 },
    { p: '66% 21%, 51% 35%, 54% 48%', c: '#d8d0c1', z: 14, dx: 12, dy: -14 },
    { p: '4% 12%, 2% 33%, 26% 58%', c: '#4d7378', z: 9, dx: -46, dy: -8 },
    { p: '10% 90%, 23% 96%, 33% 80%', c: '#1f3237', z: 5, dx: -28, dy: 40 },
    { p: '65% 63%, 80% 78%, 52% 82%', c: '#3b5d62', z: 8, dx: 24, dy: 28 },
    { p: '86% 10%, 95% 15%, 75% 28%', c: '#160000', z: 26, dx: 42, dy: -36 },
  ],
  // Form 3: Bauhaus Tessellated Crystal Monolith (Tools)
  [
    { p: '50% 3%, 24% 21%, 50% 30%', c: '#fdfaf5', z: 22, dx: -18, dy: -36 },
    { p: '50% 3%, 76% 21%, 50% 30%', c: '#e0d8c8', z: 22, dx: 18, dy: -36 },
    { p: '24% 21%, 12% 46%, 50% 30%', c: '#f40c3f', z: 16, dx: -34, dy: -14 },
    { p: '76% 21%, 88% 46%, 50% 30%', c: '#b8142c', z: 16, dx: 34, dy: -14 },
    { p: '12% 46%, 50% 30%, 33% 59%', c: '#f2c97d', z: 24, dx: -22, dy: -2 },
    { p: '88% 46%, 50% 30%, 67% 59%', c: '#d6ab5e', z: 24, dx: 22, dy: -2 },
    { p: '50% 30%, 33% 59%, 67% 59%', c: '#fdfaf5', z: 28, dx: 0, dy: -4 },
    { p: '12% 46%, 20% 75%, 33% 59%', c: '#355459', z: 11, dx: -36, dy: 16 },
    { p: '88% 46%, 80% 75%, 67% 59%', c: '#243c40', z: 11, dx: 36, dy: 16 },
    { p: '33% 59%, 67% 59%, 50% 78%', c: '#f40c3f', z: 25, dx: 0, dy: 18 },
    { p: '20% 75%, 33% 59%, 50% 78%', c: '#4d7378', z: 18, dx: -18, dy: 24 },
    { p: '80% 75%, 67% 59%, 50% 78%', c: '#325054', z: 18, dx: 18, dy: 24 },
    { p: '20% 75%, 50% 78%, 50% 97%', c: '#f2c97d', z: 14, dx: -16, dy: 38 },
    { p: '80% 75%, 50% 78%, 50% 97%', c: '#c4984a', z: 14, dx: 16, dy: 38 },
    { p: '24% 21%, 6% 29%, 12% 46%', c: '#294045', z: 6, dx: -44, dy: -18 },
    { p: '76% 21%, 94% 29%, 88% 46%', c: '#1b2d30', z: 6, dx: 44, dy: -18 },
    { p: '12% 46%, 6% 65%, 20% 75%', c: '#f40c3f', z: 8, dx: -44, dy: 20 },
    { p: '88% 46%, 94% 65%, 80% 75%', c: '#9e1126', z: 8, dx: 44, dy: 20 },
  ],
]

const FORM_NAMES = ['ORIGAMI PEREGRINE', 'SENTINEL VULPES', 'ASCENDING CRANE', 'BAUHAUS MONOLITH']

export function ChapterExplorer({ entries, chapter }: { entries: Entry[]; chapter: 'currently' | 'profile' }) {
  const [selected, setSelected] = useState(0)
  const [angle, setAngle] = useState(20)
  const [playing, setPlaying] = useState(true)
  const [exploded, setExploded] = useState(false)
  const formIndex = (chapter === 'profile' ? selected : selected % 3) % POLYGON_FORMS.length
  const shards = POLYGON_FORMS[formIndex]

  return <div className="chapter-explorer">
    <dl className="text-list explorer-list">{entries.map(({ label, value }, index) => <div key={label} data-impact-piece>
      <dt><button type="button" aria-label={`${label}: ${value || 'To be written'}`} aria-controls={`${chapter}-detail`} aria-pressed={selected === index} onClick={() => setSelected(index)}><span>0{index + 1}</span>{label}<b aria-hidden="true">{selected === index ? '−' : '+'}</b></button></dt>
      <dd>{value || 'To be written'}</dd>
    </div>)}</dl>
    <aside className="chapter-detail" id={`${chapter}-detail`} aria-label="Selected chapter detail">
      <div
        className="chapter-sculpture"
        data-playing={playing}
        data-exploded={exploded}
        data-form={selected}
        style={{ '--instrument-angle': `${angle}deg`, '--chapter-index': selected } as CSSProperties}
        onClick={() => setExploded((prev) => !prev)}
        aria-hidden="true"
      >
        <svg className="sculpture-reticle" viewBox="0 0 320 320">
          <circle cx="160" cy="160" r="148" className="reticle-ring-outer" />
          <circle cx="160" cy="160" r="118" className="reticle-ring-inner" />
          <line x1="160" y1="0" x2="160" y2="320" className="reticle-axis" />
          <line x1="0" y1="160" x2="320" y2="160" className="reticle-axis" />
          <polygon points="160,6 155,16 165,16" className="reticle-tick" />
          <polygon points="160,314 155,304 165,304" className="reticle-tick" />
        </svg>
        <div className="sculpture-three-stage" data-sculpture-stage />
        <div className="sculpture-object">
          {shards.map((shard, i) => <div
            className="sculpture-rib"
            key={i}
            style={{
              '--rib': i,
              '--shard-bg': shard.c,
              '--shard-z': `${shard.z}px`,
              '--shard-dx': `${shard.dx}px`,
              '--shard-dy': `${shard.dy}px`,
              clipPath: `polygon(${shard.p})`,
            } as CSSProperties}
          />)}
        </div>
        <div className="sculpture-coordinate">
          IN PIECES // 18 SHARDS · {FORM_NAMES[formIndex]} · {exploded ? 'EXPLODED VIEW' : `FORM 0${selected + 1}`}
        </div>
      </div>
      <div className="chapter-detail-copy" key={selected} aria-live="polite"><small>SELECTED / 0{selected + 1} · #IP-000{selected + 1}</small><h3>{entries[selected].value || entries[selected].label}</h3><p>{entries[selected].detail}</p></div>
      <label className="instrument-control">ROTATE THE IDEA <input aria-label="Rotate the chapter sculpture" type="range" min="0" max="360" value={angle} onChange={(event) => setAngle(Number(event.target.value))} /></label>
      <div className="sculpture-actions">
        <button className="sculpture-toggle" type="button" aria-pressed={exploded} onClick={() => setExploded(!exploded)}>{exploded ? '◈ ASSEMBLE SHARDS' : '◇ SHATTER SHARDS'}</button>
        <button className="sculpture-toggle" type="button" aria-pressed={!playing} onClick={() => setPlaying(!playing)}>{playing ? 'Ⅱ FREEZE' : '▷ ORBIT'}<span aria-hidden="true">↗</span></button>
      </div>
    </aside>
  </div>
}
