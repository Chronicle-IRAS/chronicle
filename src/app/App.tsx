import { SceneDirector } from './SceneDirector'
import { useCallback, useState } from 'react'
import { OpeningLoader } from '../components/OpeningLoader'
import { JourneySignature } from '../components/JourneySignature'

const INTRO_KEY = 'chronicle.intro.v2'

export function App() {
  const [opening, setOpening] = useState(() => {
    try { return sessionStorage.getItem(INTRO_KEY) !== 'seen' } catch { return true }
  })
  const finishOpening = useCallback(() => {
    try { sessionStorage.setItem(INTRO_KEY, 'seen') } catch { /* Storage may be unavailable in private contexts. */ }
    setOpening(false)
  }, [])
  return <div className="chronicle-app" data-opening={opening}>
    <SceneDirector />
    {!opening && <JourneySignature />}
    {opening && <OpeningLoader onComplete={finishOpening} />}
  </div>
}
