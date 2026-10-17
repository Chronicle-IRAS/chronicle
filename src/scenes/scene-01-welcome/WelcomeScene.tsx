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
        <div className="welcome-eclipse black-hole" data-enter-grid-orb>
          <div className="black-hole-lensing" />
          <div className="black-hole-disk" />
          <div className="black-hole-core" />
          <svg className="welcome-astrolabe" viewBox="0 0 500 500" aria-hidden="true">
            <circle cx="250" cy="250" r="236" className="astrolabe-ring-outer" />
            <circle cx="250" cy="250" r="212" className="astrolabe-ring-ticks" />
            <circle cx="250" cy="250" r="176" className="astrolabe-ring-inner" />
            <line x1="14" y1="250" x2="72" y2="250" className="astrolabe-axis" />
            <line x1="428" y1="250" x2="486" y2="250" className="astrolabe-axis" />
            <line x1="250" y1="14" x2="250" y2="72" className="astrolabe-axis" />
            <line x1="250" y1="428" x2="250" y2="486" className="astrolabe-axis" />
            <polygon points="250,4 245,16 255,16" className="astrolabe-marker" />
            <polygon points="250,496 245,484 255,484" className="astrolabe-marker" />
          </svg>
          <svg className="black-hole-loading" data-enter-grid-loading viewBox="0 0 400 400">
            <defs><path id="loading-orbit" d="M200,200 m-166,0 a166,166 0 1,1 332,0 a166,166 0 1,1 -332,0" /></defs>
            <text><textPath href="#loading-orbit" textLength="1043">LOADING · ENTERING THE BLUEPRINT · LOADING · ENTERING THE BLUEPRINT · </textPath></text>
          </svg>
        </div>
        <div className="welcome-orbital-field">
          <div className="welcome-orbit welcome-orbit-a" />
          <div className="welcome-orbit welcome-orbit-b" />
          <div className="welcome-orbit welcome-orbit-c" />
          <span className="welcome-orbit-core" />
        </div>
        <div className="welcome-floor" />
        <div className="welcome-grain" />
      </div>
      <div className="welcome-title-layer" data-enter-grid-title>
        <div className="welcome-meta welcome-entry">
          <span>01 / THE BEGINNING // EVENT HORIZON</span>
          <span>CODE · CURIOSITY · POSSIBILITY // #AW-01</span>
        </div>
        <p className="welcome-kicker welcome-entry"><span /> STEP INSIDE THE UNEXPECTED</p>
        <h1 className="display-title" aria-label="CHRONICLE">
          <span className="welcome-word" aria-hidden="true">
            {'CHRONICLE'.split('').map((letter, index) => (
              <span key={index} data-char={letter} style={{ '--letter-index': index } as CSSProperties}>{letter}</span>
            ))}
          </span>
        </h1>
        <p className="scene-subtitle">Developer · Builder · Explorer</p>
        <p className="welcome-manifesto welcome-entry">Not just a page.<br /><em>A world to move through.</em></p>
        <p className="welcome-side-note welcome-entry">A place to build, connect,<br />and see what happens next.</p>
      </div>
      <button type="button" className="welcome-back" data-journey-prev>← BACK TO THE PREFACE</button>
      <p className="scroll-cue" data-enter-grid-support>SCROLL TO ENTER <span aria-hidden="true">↓</span></p>
    </div>
  )
}
