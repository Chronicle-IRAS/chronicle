import { useSceneStore } from '../stores/sceneStore'

const chapters = ['prelude', 'welcome', 'composer', 'currently', 'profile', 'space', 'destinations', 'goodbye'] as const
const names = ['Preface', 'Event horizon', 'Composition lab', 'In motion', 'Behind the build', 'Unknown territory', 'Open channels', 'Another beginning']

/** A reliable way out of touch-driven canvases and independently scrolling copy. */
export function MobileJourneyNav() {
  const scene = useSceneStore(state => state.currentScene)
  const index = chapters.indexOf(scene)
  return <nav className="mobile-journey-nav" data-paper={scene === 'prelude' || scene === 'goodbye'} aria-label="Chapter navigation">
    <button type="button" data-journey-prev disabled={index <= 0} aria-label={`Previous chapter: ${names[Math.max(0, index - 1)]}`}>←</button>
    <span>{index === 0 ? '0.5' : `0${index}`} / {names[index]}</span>
    <button type="button" data-journey-next disabled={index === chapters.length - 1} aria-label={`Next chapter: ${names[Math.min(chapters.length - 1, index + 1)]}`}>→</button>
  </nav>
}
