const destinations = ['Blog', 'GitHub', 'Resume', 'Email', 'Source']

export function DestinationsScene() {
  return (
    <div className="scene-content space-content" data-scene-content>
      <div className="stars" aria-hidden="true" />
      <div className="scene-body content-column">
        <p className="section-number">06 / DESTINATIONS</p>
        <h2 className="scene-title">DESTINATIONS</h2>
        <ul className="word-list destinations-list">
          {destinations.map((item) => <li key={item}><span>{item}</span><span aria-hidden="true">↗</span></li>)}
        </ul>
        <p className="muted-note">Links will be connected in a later phase.</p>
        <div className="portal-exit-circle" aria-hidden="true" />
      </div>
    </div>
  )
}
