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
    <header className="prelude-header" data-prelude-chrome><span>0.5 / BEFORE THE BEGINNING</span><span>CHRONICLE</span></header>
    <div className="prelude-copy"><small data-prelude-chrome>A SMALL INVITATION TO THE UNKNOWN</small><h1 tabIndex={-1} aria-label="Everything starts with a little curiosity."><span aria-hidden="true"><InkWord>Everything</InkWord>{' '}<InkWord>starts</InkWord><br /><InkWord>with</InkWord>{' '}<em><InkWord>a</InkWord>{' '}<InkWord>little</InkWord>{' '}<InkWord>curiosity.</InkWord></em></span></h1><p data-prelude-chrome>A thought becomes a connection.<br />A connection becomes a world.</p></div>
    <footer className="prelude-footer" data-prelude-chrome><span>MOVE THROUGH THE WORDS.<br />THEN FOLLOW WHAT PULLS YOU IN.</span><button type="button" data-journey-next>STEP INSIDE <span>↗</span></button><small>SCROLL TO CROSS THE THRESHOLD ↓</small></footer>
  </div>
}
