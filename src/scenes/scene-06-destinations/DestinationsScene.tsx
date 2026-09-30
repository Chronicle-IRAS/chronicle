import { useState } from 'react'
import { SceneAtmosphere } from '../../components/SceneAtmosphere'
import { siteContent } from '../../data/siteContent'

const descriptions = ['Notes, experiments and things worth keeping.', 'Source code and shared experiments.', 'A closer look at the journey so far.', 'A place to begin a conversation.', 'The machinery behind this little universe.']
export function DestinationsScene() {
  const [selected, setSelected] = useState<number | null>(null)
  const [held, setHeld] = useState(false)
  const target = selected === null ? null : siteContent.destinations[selected]
  return <div className="scene-content space-content destination-content" data-scene-content data-orbits-held={held}>
    <SceneAtmosphere />
    <div className="scene-body content-column">
      <p className="section-number">06 / DESTINATIONS</p>
      <h2 className="destination-heading">Choose an orbit.</h2>
      <button type="button" className="quiet-control orbit-control" aria-pressed={held} onClick={() => setHeld(!held)}>{held ? 'RELEASE ORBITS' : 'HOLD ORBITS'} {held ? '▷' : 'Ⅱ'}</button>
      <nav className="destination-orbits" aria-label="Explore destinations">
        {siteContent.destinations.map(({ label }, index) => <button className={`destination destination-${index}`} key={label} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}><span className={`planet planet-${index}`} aria-hidden="true" /><span className="planet-label">{label}<small>{selected === index ? 'IN FOCUS' : 'EXPLORE +'}</small></span></button>)}
      </nav>
      <div className="destination-inspector" aria-live="polite">{target ? <><div><small>DESTINATION / 0{selected! + 1}</small><h3>{target.label}</h3><p>{descriptions[selected!]}</p></div>{target.href ? <a className="quiet-control" href={target.href} target={target.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer">OPEN {target.label.toUpperCase()} ↗</a> : <span className="destination-empty">Address not added yet.<br />You can still explore the other planets.</span>}<button type="button" className="inspector-close" aria-label="Close destination details" onClick={() => setSelected(null)}>×</button></> : <p>Select a planet to discover what lives there.</p>}</div>
    </div>
  </div>
}
