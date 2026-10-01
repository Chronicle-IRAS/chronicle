import { useSceneStore } from '../stores/sceneStore'

const chapters = ['welcome', 'composer', 'currently', 'profile', 'space', 'destinations', 'goodbye'] as const
const names = ['Event horizon', 'Composition lab', 'In motion', 'Behind the build', 'Unknown territory', 'Open channels', 'Another beginning']

export function JourneySignature() {
  const scene = useSceneStore((state) => state.currentScene)
  const index = chapters.indexOf(scene)
  return <div className="journey-signature" data-light={scene === 'goodbye'} aria-label={`Chapter ${index + 1} of 7: ${names[index]}`}>
    <span className="journey-wordmark" aria-hidden="true">C<span>↗</span></span>
    <span className="journey-caption" aria-hidden="true">{names[index]}</span>
    <div className="journey-track" aria-hidden="true">{chapters.map((id, i) => <i key={id} data-past={i < index} data-current={i === index} />)}</div>
    <span className="journey-count" aria-hidden="true">0{index + 1}<em>/07</em></span>
  </div>
}
