import { useState, type CSSProperties } from 'react'
import { SceneAtmosphere } from '../../components/SceneAtmosphere'
import { siteContent } from '../../data/siteContent'

const positions = [[17, 30], [44, 65], [69, 23], [86, 62]]
const coords = ['RA 04h 18m · +22°', 'RA 11h 05m · −14°', 'RA 17h 42m · +48°', 'RA 22h 31m · −09°']
const notes = ['Tools that reason, act and learn from context.', 'Small instruments that make building feel better.', 'Ideas become more useful when they can be shared.', 'Where code meets the physical world.']

export function SpaceScene() {
  const [route, setRoute] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const choose = (index: number) => { setSelected(index); setRoute((previous) => previous.includes(index) ? previous : [...previous, index]) }
  return <div className="scene-content space-content" data-scene-content>
    <SceneAtmosphere />
    <div className="scene-body content-column star-atlas">
      <p className="section-number">05 / WHAT&apos;S NEXT // CELESTIAL RADAR</p>
      <h2 className="scene-title">Chart the unknown.</h2>
      <p className="atlas-instruction">Choose stars. Make your own constellation.</p>
      <div className="constellation-map">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <g className="atlas-radar-grid">
            <line x1="0" y1="50" x2="100" y2="50" />
            <line x1="50" y1="0" x2="50" y2="100" />
            <line x1="15" y1="15" x2="85" y2="85" />
            <line x1="85" y1="15" x2="15" y2="85" />
          </g>
          <polyline points={route.map((index) => positions[index].join(',')).join(' ')} />
          {route.length > 1 && <polyline key={route.join('-')} className="atlas-route-reveal" pathLength="1" points={route.map(index => positions[index].join(',')).join(' ')} />}
        </svg>
        {siteContent.future.map((topic, index) => (
          <button
            type="button"
            className="atlas-star"
            style={{ left: `${positions[index][0]}%`, top: `${positions[index][1]}%`, '--star-order': index } as CSSProperties}
            key={topic}
            aria-pressed={route.includes(index)}
            onClick={() => choose(index)}
          >
            <span className="atlas-star-core" />
            <small>0{index + 1} // {coords[index]}</small>
            <strong>{topic}</strong>
          </button>
        ))}
      </div>
      <div className="atlas-footer">
        <div aria-live="polite">
          <small>{route.length} / 4 STARS CONNECTED · VECTOR LOCK {route.length ? `ACTIVE [#0${route.join('-0')}]` : 'STANDBY'}</small>
          <p>{selected === null ? 'There is no prescribed route.' : notes[selected]}</p>
        </div>
        <button type="button" className="quiet-control" onClick={() => { setRoute([]); setSelected(null) }} disabled={!route.length}>CLEAR ROUTE ↺</button>
      </div>
    </div>
  </div>
}
