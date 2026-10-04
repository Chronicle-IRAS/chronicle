import { InkRibbons } from '../../features/ink/InkRibbons'
import { useSceneStore } from '../../stores/sceneStore'

export function PreludeScene() {
  const active = useSceneStore((s) => s.currentScene === 'prelude')
  const reduced = useSceneStore((s) => s.reducedMotion)
  return <div className="scene-content prelude-content" data-scene-content data-ink-surface>
    <div className="prelude-paper" data-prelude-paper />
    <InkRibbons active={active} reduced={reduced} />
    <header className="prelude-header" data-absorb><span>0.5 / BEFORE THE BEGINNING</span><span>CHRONICLE</span></header>
    <div className="prelude-copy"><small data-absorb>A SMALL INVITATION TO THE UNKNOWN</small><h1 tabIndex={-1}><span data-absorb>Everything</span>{' '}<span data-absorb>starts</span><br /><span data-absorb>with</span>{' '}<em><span data-absorb>a little</span>{' '}<span data-absorb>curiosity.</span></em></h1><p data-absorb>A thought becomes a connection.<br />A connection becomes a world.</p></div>
    <footer className="prelude-footer" data-absorb><span>MOVE THROUGH THE WORDS.<br />THEN FOLLOW WHAT PULLS YOU IN.</span><button type="button" data-journey-next>STEP INSIDE <span>↗</span></button><small>SCROLL TO CROSS THE THRESHOLD ↓</small></footer>
  </div>
}
