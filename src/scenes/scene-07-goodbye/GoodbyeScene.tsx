import { useSceneStore } from '../../stores/sceneStore'
import { restartJourney } from '../../transitions/restart'

export function GoodbyeScene() {
  const reducedMotion = useSceneStore((state) => state.reducedMotion)
  return (
    <div className="scene-content" data-scene-content>
      <div className="scene-body content-column">
        <p className="section-number">07 / GOODBYE</p>
        <h2 className="scene-title">GOODBYE</h2>
        <ul className="word-list"><li>Friends</li><li>Blogroll</li><li>Special Thanks</li></ul>
        <button className="restart-button" type="button" onClick={() => restartJourney(reducedMotion)}>RESTART <span aria-hidden="true">↗</span></button>
      </div>
    </div>
  )
}
