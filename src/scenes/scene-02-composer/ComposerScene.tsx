import { StackComposer } from '../../features/stack-composer/components/StackComposer'

export function ComposerScene() {
  return (
    <div className="scene-content composer-content" data-scene-content>
      <div className="scene-body composer-layout">
        <div className="composer-heading" data-enter-grid-heading>
          <h2 className="composer-label">02 / STACK COMPOSER</h2>
          <p className="composer-hint">Drag nodes · Connect technologies · Delete selected edges</p>
        </div>
        <div className="composer-reveal" data-enter-grid-canvas><StackComposer /></div>
      </div>
    </div>
  )
}
