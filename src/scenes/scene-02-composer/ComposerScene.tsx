import { SceneAtmosphere } from '../../components/SceneAtmosphere'
import { StackComposer } from '../../features/stack-composer/components/StackComposer'
import { CharacterCast } from '../../components/CharacterCast'

export function ComposerScene() {
  return (
    <div className="scene-content composer-content" data-scene-content>
      <div className="composer-board" data-composer-board>
        <SceneAtmosphere />
        <div className="scene-body composer-layout">
          <div className="composer-heading" data-enter-grid-heading>
            <h2 className="composer-label">02 / STACK COMPOSER</h2>
            <p className="composer-hint">Drift & collide · Hover to pause · Drag to nudge · Connect to discover</p>
          </div>
          <div className="composer-reveal" data-enter-grid-canvas><StackComposer /></div>
        </div>
      </div>
      <CharacterCast />
    </div>
  )
}
