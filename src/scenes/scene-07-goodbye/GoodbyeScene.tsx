import { SceneAtmosphere } from '../../components/SceneAtmosphere'
import { useSceneStore } from '../../stores/sceneStore'
import { restartJourney } from '../../transitions/restart'
import { siteContent } from '../../data/siteContent'

export function GoodbyeScene() {
  const reducedMotion = useSceneStore((state) => state.reducedMotion)
  return <div className="scene-content" data-scene-content>
    <SceneAtmosphere />
    <div className="scene-body content-column">
      <p className="section-number">07 / GOODBYE</p>
      <h2 className="scene-title">GOODBYE</h2>
      <ul className="goodbye-notes">{siteContent.thanks.map((label) => <li key={label}>{label}</li>)}</ul>
      <button className="restart-button" type="button" onClick={(event) => restartJourney(reducedMotion, event.currentTarget)}>RESTART <span aria-hidden="true">↗</span></button>
    </div>
  </div>
}
