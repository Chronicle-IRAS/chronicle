import { useSceneStore } from '../../stores/sceneStore'
import { restartJourney } from '../../transitions/restart'
import { WordBloom } from '../../features/word-bloom/WordBloom'

export function GoodbyeScene() {
  const reducedMotion = useSceneStore((state) => state.reducedMotion)
  return <div className="scene-content paper-goodbye" data-scene-content>
    <div className="scene-body paper-layout"><header className="paper-header"><span>07 / GOODBYE</span><span>CHRONICLE</span></header><WordBloom /><button className="restart-button paper-restart" type="button" onClick={(event) => restartJourney(reducedMotion, event.currentTarget)}>RESTART <span aria-hidden="true">↗</span></button></div>
  </div>
}
