import { SceneAtmosphere } from '../../components/SceneAtmosphere'
import { useSceneStore } from '../../stores/sceneStore'
import { restartJourney } from '../../transitions/restart'
import { siteContent } from '../../data/siteContent'
import { FlowLetter } from '../../features/goodbye-letter/FlowLetter'

export function GoodbyeScene() {
  const reducedMotion = useSceneStore((state) => state.reducedMotion)
  return <div className="scene-content" data-scene-content>
    <SceneAtmosphere />
    <div className="scene-body goodbye-layout">
      <header className="goodbye-heading">
        <p className="section-number">07 / GOODBYE</p>
        <h2 className="scene-title">GOODBYE<span className="goodbye-echo" aria-hidden="true">FOR NOW.</span></h2>
        <p className="goodbye-intro">{siteContent.goodbye.intro}</p>
        <span className="goodbye-coordinate" aria-hidden="true">END OF CHAPTER / START OF SOMETHING</span>
      </header>
      <div className="goodbye-letter">
        <p className="letter-label"><span>A NOTE BEFORE YOU GO</span><span className="letter-invitation" aria-hidden="true">MOVE THROUGH THE WORDS ↗</span></p>
        <FlowLetter text={siteContent.goodbye.letter} />
        <p className="letter-signoff">{siteContent.goodbye.closing}</p>
      </div>
      <footer className="goodbye-footer">
        <ul className="goodbye-notes">{siteContent.thanks.map((label) => <li key={label}>{label}</li>)}</ul>
        <button className="restart-button" type="button" onClick={(event) => restartJourney(reducedMotion, event.currentTarget)}>RESTART <span aria-hidden="true">↗</span></button>
      </footer>
    </div>
  </div>
}
