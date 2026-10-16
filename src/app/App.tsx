import { SceneDirector } from './SceneDirector'
import { useCallback, useRef, useState } from 'react'
import { OpeningLoader } from '../components/OpeningLoader'
import { JourneySignature } from '../components/JourneySignature'
import { InteractionFeedback } from '../components/InteractionFeedback'

const INTRO_KEY = 'chronicle.intro.v2'

export function App() {
  const surface = useRef<HTMLDivElement>(null)
  const [opening, setOpening] = useState(() => {
    try { return sessionStorage.getItem(INTRO_KEY) !== 'seen' } catch { return true }
  })
  const [contrast, setContrast] = useState(false)
  const finishOpening = useCallback(() => {
    try { sessionStorage.setItem(INTRO_KEY, 'seen') } catch { /* Storage may be unavailable in private contexts. */ }
    setOpening(false)
  }, [])
  return <div ref={surface} className="chronicle-app" data-opening={opening} data-contrast={contrast ? 'inverted' : 'default'}>
    <SceneDirector />
    {!opening && <JourneySignature contrast={contrast} onToggleContrast={() => setContrast((c) => !c)} />}
    {opening && <OpeningLoader onComplete={finishOpening} />}
    <InteractionFeedback surface={surface} />
  </div>
}
