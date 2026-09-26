import type { CSSProperties } from 'react'

export function SceneAtmosphere() {
  return <div className="scene-atmosphere" aria-hidden="true">
    <div className="ambient-pointer" />
    <div className="ambient-haze ambient-haze-a" /><div className="ambient-haze ambient-haze-b" />
    <div className="ambient-orbit ambient-orbit-a" /><div className="ambient-orbit ambient-orbit-b" />
    <div className="ambient-trace" />
    {Array.from({ length: 32 }, (_, i) => <i className="ambient-mote" key={i} style={{ '--i': i, left: `${(i * 37 + 7) % 100}%`, top: `${(i * 23 + 13) % 100}%` } as CSSProperties} />)}
  </div>
}
