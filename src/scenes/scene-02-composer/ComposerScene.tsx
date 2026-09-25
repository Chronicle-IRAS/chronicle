import { StackComposer } from '../../features/stack-composer/components/StackComposer'

export function ComposerScene() {
  return (
    <div className="scene-content composer-content" data-scene-content>
      <div className="scene-body composer-layout">
        <div className="composer-heading" data-enter-grid-heading>
          <p className="section-number">02 / STACK COMPOSER</p>
          <h2 className="scene-title">STACK COMPOSER</h2>
          <p>Connect any two technologies to discover a project or concept.</p>
          <p className="muted-note">Drag nodes to arrange. Select an edge and press Delete to remove its result.</p>
        </div>
        <div className="composer-reveal" data-enter-grid-canvas><StackComposer /></div>
      </div>
    </div>
  )
}
