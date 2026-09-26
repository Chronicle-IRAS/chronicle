export function WelcomeScene() {
  return (
    <div className="scene-content welcome-content" data-scene-content>
      <div className="welcome-grid" data-enter-grid-backdrop aria-hidden="true">
        <div className="welcome-grid-far" data-enter-grid-far />
        <div className="welcome-grid-near" data-enter-grid-near />
        <div className="welcome-grid-vignette" data-enter-grid-vignette />
        <div className="welcome-atmosphere" />
        <span className="welcome-signal welcome-signal-one" />
        <span className="welcome-signal welcome-signal-two" />
        <span className="welcome-signal welcome-signal-three" />
      </div>
      <div className="welcome-title-layer" data-enter-grid-title>
        <h1 className="display-title">CHRONICLE</h1>
        <p className="scene-subtitle">Developer · Builder · Explorer</p>
      </div>
      <p className="scroll-cue" data-enter-grid-support>SCROLL TO ENTER <span aria-hidden="true">↓</span></p>
    </div>
  )
}
