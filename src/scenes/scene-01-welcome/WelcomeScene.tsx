export function WelcomeScene() {
  return (
    <div className="scene-content welcome-content" data-scene-content>
      <div className="welcome-grid" aria-hidden="true">
        <div className="welcome-grid-far" data-enter-grid-far />
        <div className="welcome-grid-near" data-enter-grid-near />
        <div className="welcome-grid-vignette" data-enter-grid-vignette />
      </div>
      <div className="welcome-title-layer" data-enter-grid-title>
        <h1 className="display-title">CHRONICLE</h1>
      </div>
      <div className="scene-body welcome-body" data-enter-grid-support>
        <p className="scene-subtitle">Developer · Builder · Explorer</p>
        <p className="scroll-cue">SCROLL TO ENTER <span aria-hidden="true">↓</span></p>
      </div>
    </div>
  )
}
