import type { CSSProperties } from 'react'

const STAR_PATH = 'm24.5 0 3.3 21.2L49 24.5l-21.2 3.3L24.5 49l-3.3-21.2L0 24.5l21.2-3.3L24.5 0z'
const BINARIES = ['1000011 1001000', '1010010 1001111', '1001110 1001001', '1000011 1001100']

export function SceneAtmosphere() {
  return <div className="scene-atmosphere" aria-hidden="true">
    <div className="ambient-pointer" />
    <div className="ambient-haze ambient-haze-a" /><div className="ambient-haze ambient-haze-b" />
    <div className="ambient-orbit ambient-orbit-a" /><div className="ambient-orbit ambient-orbit-b" />
    <div className="ambient-trace" />
    <svg className="aw-perspective-grid" viewBox="0 0 1440 900" preserveAspectRatio="none">
      <path className="aw-grid-frame" d="M72 54 H1368 V846 H72 Z M180 144 H1260 V756 H180 Z" />
      <path className="aw-grid-rays" d="M0 0 L180 144 M1440 0 L1260 144 M0 900 L180 756 M1440 900 L1260 756 M720 0 L720 144 M720 756 L720 900 M0 450 L180 450 M1260 450 L1440 450" />
      <path className="aw-grid-wave" d="M72 450 Q 410 410, 720 450 T 1368 450" />
    </svg>
    <div className="aw-separator aw-separator-top">
      <span className="aw-triangle" />
      <div className="aw-binaries">
        {BINARIES.map((code, idx) => <span key={idx} className="aw-binary-group">
          <span className="aw-code">{code}</span>
          <span className="aw-stripes" />
        </span>)}
      </div>
      <span className="aw-triangle aw-triangle-right" />
    </div>
    <svg className="ambient-contours" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      {[0, 1, 2, 3].map(index => <g key={index} style={{ '--contour-index': index } as CSSProperties} transform={`translate(0 ${index * 30})`}>
        <path d="M-180 590 C180 150 300 790 670 520 S1090 70 1630 390" />
        <path className="ambient-contour-light" d="M-180 590 C180 150 300 790 670 520 S1090 70 1630 390" />
      </g>)}
    </svg>
    <svg className="aw-star aw-star-tl" viewBox="0 0 49 49"><path d={STAR_PATH} /></svg>
    <svg className="aw-star aw-star-br" viewBox="0 0 49 49"><path d={STAR_PATH} /></svg>
    <div className="ambient-wave ambient-wave-a" /><div className="ambient-wave ambient-wave-b" />
    <div className="ambient-streaks">{Array.from({ length: 6 }, (_, i) => <i key={i} style={{ '--i': i } as CSSProperties} />)}</div>
    {Array.from({ length: 18 }, (_, i) => <i className="ambient-mote" key={i} style={{ '--i': i, left: `${(i * 37 + 7) % 100}%`, top: `${(i * 23 + 13) % 100}%` } as CSSProperties} />)}
  </div>
}

