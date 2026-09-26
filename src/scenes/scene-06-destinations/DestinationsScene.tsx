import { SceneAtmosphere } from '../../components/SceneAtmosphere'
import { siteContent } from '../../data/siteContent'

export function DestinationsScene() {
  return <div className="scene-content space-content destination-content" data-scene-content>
    <SceneAtmosphere />
    <div className="scene-body content-column">
      <p className="section-number">06 / DESTINATIONS</p>
      <h2 className="destination-heading">Choose an orbit.</h2>
      <nav className="destination-orbits" aria-label="External destinations">
        {siteContent.destinations.map(({ label, href }, i) => {
          const content = <><span className={`planet planet-${i}`} aria-hidden="true" /><span className="planet-label">{label}<small>{href ? 'OPEN ↗' : 'NOT CONNECTED'}</small></span></>
          return href
            ? <a className={`destination destination-${i}`} key={label} href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer">{content}</a>
            : <button className={`destination destination-${i}`} key={label} type="button" disabled aria-label={`${label}: address not configured`}>{content}</button>
        })}
      </nav>
    </div>
  </div>
}
