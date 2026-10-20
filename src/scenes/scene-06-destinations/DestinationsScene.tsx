import { useRef, useState } from 'react'
import { SceneAtmosphere } from '../../components/SceneAtmosphere'
import { siteContent } from '../../data/siteContent'

const descriptions = ['Notes, experiments and things worth keeping.', 'Source code and shared experiments.', 'A closer look at the journey so far.', 'A place to begin a conversation.', 'The machinery behind this little universe.']
const orbitCodes = ['ORB // 01 · ARCHIVE', 'ORB // 02 · REPOS', 'ORB // 03 · DOSSIER', 'ORB // 04 · SIGNAL', 'ORB // 05 · ENGINE']

export function DestinationsScene() {
  const [selected, setSelected] = useState<number | null>(null)
  const [held, setHeld] = useState(false)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const closeDetails = () => { if (selected !== null) buttons.current[selected]?.focus(); setSelected(null) }
  const target = selected === null ? null : siteContent.destinations[selected]
  return <div className="scene-content space-content destination-content" data-scene-content data-orbits-held={held} data-selected-orbit={selected === null ? -1 : selected}>
    <SceneAtmosphere />
    <div className="scene-body content-column">
      <p className="section-number">06 / DESTINATIONS // ORBITAL INDEX</p>
      <h2 className="destination-heading">Choose an orbit.</h2>
      <button type="button" className="quiet-control orbit-control" aria-pressed={held} onClick={() => setHeld(!held)}>{held ? 'RELEASE ORBITS' : 'HOLD ORBITS'} {held ? '▷' : 'Ⅱ'}</button>
      <nav className="destination-orbits" aria-label="Explore destinations">
        {siteContent.destinations.map(({ label }, index) => (
          <button
            ref={(node) => { buttons.current[index] = node }}
            className={`destination destination-${index}`}
            key={label}
            type="button"
            aria-controls="destination-details"
            aria-pressed={selected === index}
            onClick={() => setSelected(index)}
          >
            <span className={`planet planet-${index}`} aria-hidden="true">
              <span className="planet-facet planet-facet-a" />
              <span className="planet-facet planet-facet-b" />
              <span className="planet-facet planet-facet-c" />
              <span className="planet-ring" />
            </span>
            <span className="planet-label">
              {label}
              <small>{selected === index ? `▲ ${orbitCodes[index]}` : 'EXPLORE +'}</small>
            </span>
          </button>
        ))}
      </nav>
      <div className="destination-inspector" id="destination-details" data-selected={selected !== null} aria-live="polite" onKeyDown={(event) => { if (event.key === 'Escape') { event.stopPropagation(); closeDetails() } }}>{target ? <><div key={selected} className="destination-detail-copy"><small>DESTINATION / 0{selected! + 1} · {orbitCodes[selected!]}</small><h3>{target.label}</h3><p>{descriptions[selected!]}</p></div>{target.href ? <a className="quiet-control" href={target.href} target={target.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer">OPEN {target.label.toUpperCase()} ↗</a> : <span className="destination-empty">NOT YET LINKED<br />This address will be added later.</span>}<button type="button" className="inspector-close" aria-label="Close destination details" onClick={closeDetails}>×</button></> : <p>Select a planet to discover what lives there.</p>}</div>
    </div>
  </div>
}
