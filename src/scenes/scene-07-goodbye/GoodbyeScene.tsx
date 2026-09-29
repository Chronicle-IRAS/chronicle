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
        <h2 className="scene-title">GOODBYE, FOR NOW.</h2>
        <p className="goodbye-intro">MOVE THROUGH THE WORDS ↗</p>
      </header>
      <div className="goodbye-letter">
        <FlowLetter text={siteContent.goodbye.letter} />
      </div>
      <footer className="goodbye-footer">
        <p className="letter-signoff">{siteContent.goodbye.closing}</p>
        <button className="restart-button" type="button" onClick={(event) => restartJourney(reducedMotion, event.currentTarget)}>RESTART <span aria-hidden="true">↗</span></button>
      </footer>
    </div>
  </div>
}
