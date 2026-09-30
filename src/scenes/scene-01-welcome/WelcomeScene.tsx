import { SceneAtmosphere } from '../../components/SceneAtmosphere'
import type { CSSProperties } from 'react'
export function WelcomeScene() {
  return (
    <div className="scene-content welcome-content" data-scene-content>
      <div className="welcome-grid" data-enter-grid-backdrop aria-hidden="true">
        <SceneAtmosphere />
        <div className="welcome-grid-far" data-enter-grid-far />
        <div className="welcome-grid-near" data-enter-grid-near />
        <div className="welcome-grid-vignette" data-enter-grid-vignette />
        <div className="welcome-atmosphere" />
        <span className="welcome-signal welcome-signal-one" />
        <span className="welcome-signal welcome-signal-two" />
        <span className="welcome-signal welcome-signal-three" />
        <div className="welcome-aurora" />
        <div className="welcome-eclipse" data-enter-grid-orb><div className="welcome-eclipse-rim" /><div className="welcome-eclipse-body" /><span className="welcome-eclipse-flare" /></div>
        <div className="welcome-orbital-field"><div className="welcome-orbit welcome-orbit-a" /><div className="welcome-orbit welcome-orbit-b" /><div className="welcome-orbit welcome-orbit-c" /><span className="welcome-orbit-core" /></div>
        <div className="welcome-floor" />
        <div className="welcome-grain" />
      </div>
      <div className="welcome-title-layer" data-enter-grid-title>
        <div className="welcome-meta welcome-entry"><span>01 / THE BEGINNING</span><span>CODE · CURIOSITY · POSSIBILITY</span></div>
        <p className="welcome-kicker welcome-entry"><span /> STEP INSIDE THE UNEXPECTED</p>
        <h1 className="display-title" aria-label="CHRONICLE"><span className="welcome-word" aria-hidden="true">{'CHRONICLE'.split('').map((letter, index) => <span key={index} style={{ '--letter-index': index } as CSSProperties}>{letter}</span>)}</span></h1>
        <p className="scene-subtitle">Developer · Builder · Explorer</p>
        <p className="welcome-manifesto welcome-entry">Not just a page.<br /><em>A world to move through.</em></p>
        <p className="welcome-side-note welcome-entry">A place to build, connect,<br />and see what happens next.</p>
      </div>
      <p className="scroll-cue" data-enter-grid-support>SCROLL TO ENTER <span aria-hidden="true">↓</span></p>
    </div>
  )
}
