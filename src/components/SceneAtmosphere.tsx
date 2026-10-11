import type { CSSProperties } from 'react'

export function SceneAtmosphere() {
  return <div className="scene-atmosphere" aria-hidden="true">
    <div className="ambient-pointer" />
    <div className="ambient-haze ambient-haze-a" /><div className="ambient-haze ambient-haze-b" />
    <div className="ambient-orbit ambient-orbit-a" /><div className="ambient-orbit ambient-orbit-b" />
    <div className="ambient-trace" />
    <svg className="ambient-contours" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      {[0, 1, 2, 3].map(index => <g key={index} style={{ '--contour-index': index } as CSSProperties} transform={`translate(0 ${index * 30})`}>
        <path d="M-180 590 C180 150 300 790 670 520 S1090 70 1630 390" />
        <path className="ambient-contour-light" d="M-180 590 C180 150 300 790 670 520 S1090 70 1630 390" />
      </g>)}
    </svg>
    <div className="ambient-wave ambient-wave-a" /><div className="ambient-wave ambient-wave-b" />
    <div className="ambient-streaks">{Array.from({ length: 6 }, (_, i) => <i key={i} style={{ '--i': i } as CSSProperties} />)}</div>
    {Array.from({ length: 18 }, (_, i) => <i className="ambient-mote" key={i} style={{ '--i': i, left: `${(i * 37 + 7) % 100}%`, top: `${(i * 23 + 13) % 100}%` } as CSSProperties} />)}
  </div>
}
