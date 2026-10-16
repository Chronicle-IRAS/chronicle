import { useSceneStore } from '../stores/sceneStore'

const chapters = ['welcome', 'composer', 'currently', 'profile', 'space', 'destinations', 'goodbye'] as const
const names = ['Event horizon', 'Composition lab', 'In motion', 'Behind the build', 'Unknown territory', 'Open channels', 'Another beginning']
const keys = ['#aw-0001/07', '#aw-0002/07', '#ip-0003/07', '#ip-0004/07', '#sp-0005/07', '#nd-0006/07', '#gb-0007/07']

export function JourneySignature({ contrast = false, onToggleContrast }: { contrast?: boolean; onToggleContrast?: () => void }) {
  const scene = useSceneStore((state) => state.currentScene)
  const index = scene === 'prelude' ? -1 : chapters.indexOf(scene)
  return <div className="journey-signature" data-light={scene === 'goodbye' || scene === 'prelude'} aria-label={index < 0 ? 'Preface: before the beginning' : `Chapter ${index + 1} of 7: ${names[index]}`}>
    <span className="journey-eye" aria-hidden="true">
      <span className="journey-pupil"><i /><i /></span>
    </span>
    <span className="journey-wordmark" aria-hidden="true">C<span>↗</span></span>
    <span className="journey-key" aria-hidden="true">{index < 0 ? '#pr-0000/07' : keys[index]}</span>
    <span className="journey-caption" aria-hidden="true">{index < 0 ? 'Before the beginning' : names[index]}</span>
    <div className="journey-track" aria-hidden="true">{chapters.map((id, i) => <i key={id} data-past={i < index} data-current={i === index} />)}</div>
    <span className="journey-count" aria-hidden="true">{index < 0 ? '0.5' : `0${index + 1}`}<em>/07</em></span>
    {onToggleContrast && <button type="button" className="journey-contrast" aria-pressed={contrast} aria-label="Toggle high-contrast polarity" onClick={onToggleContrast} title="Change contrast">
      <svg viewBox="0 0 20 20" width="12" height="12" aria-hidden="true">
        <path fill="currentColor" d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20Zm1-2.08A8 8 0 0 0 11 2.08v15.84Z" />
      </svg>
    </button>}
  </div>
}

