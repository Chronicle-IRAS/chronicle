import { InkRibbons } from '../../features/ink/InkRibbons'
import { useSceneStore } from '../../stores/sceneStore'

function InkWord({ children }: { children: string }) {
  return <span className="prelude-word">{Array.from(children).map((letter, index) => <span data-absorb key={index}>{letter}</span>)}</span>
}

export function PreludeScene() {
  const active = useSceneStore((s) => s.currentScene === 'prelude')
  const reduced = useSceneStore((s) => s.reducedMotion)
  return <div className="scene-content prelude-content" data-scene-content data-ink-surface>
    <div className="prelude-paper" data-prelude-paper />
    <InkRibbons active={active} reduced={reduced} />
    <div className="prelude-blueprint" data-prelude-chrome aria-hidden="true">
      <span className="prelude-crosshair prelude-ch-tl">+</span>
      <span className="prelude-crosshair prelude-ch-tr">+</span>
      <span className="prelude-crosshair prelude-ch-bl">+</span>
      <span className="prelude-crosshair prelude-ch-br">+</span>
      <span className="prelude-rail-left">SYS // 01000011 · ARCHIVE EDITION 2026</span>
      <span className="prelude-rail-right">48°51&apos;24&quot;N · 02°21&apos;08&quot;E // WODNIACK-INSPIRED</span>
      <svg className="prelude-seal" viewBox="0 0 140 140">
        <defs>
          <path id="prelude-seal-path" d="M70,70 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0" />
        </defs>
        <circle cx="70" cy="70" r="64" className="prelude-seal-ring" />
        <text><textPath href="#prelude-seal-path" textLength="326">CHRONICLE · ARCHITECTURE · IN PIECES · </textPath></text>
        <path className="prelude-seal-star" d="M70 48 L74 66 L92 70 L74 74 L70 92 L66 74 L48 70 L66 66 Z" />
      </svg>
    </div>
    <header className="prelude-header" data-prelude-chrome><span>0.5 / BEFORE THE BEGINNING // #AW-00</span><span>CHRONICLE</span></header>
    <div className="prelude-copy">
      <div className="prelude-watermark" data-prelude-chrome aria-hidden="true">00 // PROLOGUE</div>
      <small data-prelude-chrome>▲ A SMALL INVITATION TO THE UNKNOWN // 01000011</small>
      <h1 tabIndex={-1} aria-label="Everything starts with a little curiosity.">
        <span aria-hidden="true">
          <InkWord>Everything</InkWord>{' '}<InkWord>starts</InkWord><br />
          <InkWord>with</InkWord>{' '}<em><InkWord>a</InkWord>{' '}<InkWord>little</InkWord>{' '}<InkWord>curiosity.</InkWord></em>
        </span>
      </h1>
      <p data-prelude-chrome>A thought becomes a connection.<br />A connection becomes a world.</p>
    </div>
    <footer className="prelude-footer" data-prelude-chrome>
      <span>MOVE THROUGH THE WORDS.<br />THEN FOLLOW WHAT PULLS YOU IN.</span>
      <button type="button" data-journey-next>STEP INSIDE <span>↗</span></button>
      <small>SCROLL TO CROSS THE THRESHOLD ↓</small>
    </footer>
  </div>
}
