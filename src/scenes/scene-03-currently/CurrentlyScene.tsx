import { ChapterExplorer } from '../../features/chapter-explorer/ChapterExplorer'
import { SceneAtmosphere } from '../../components/SceneAtmosphere'
import { ImpactActor } from '../../components/CharacterCast'
import { siteContent } from '../../data/siteContent'

export function CurrentlyScene() {
  return <div className="scene-content" data-scene-content>
    <SceneAtmosphere />
    <div className="scene-body content-column">
      <p className="section-number">03 / CURRENTLY</p>
      <h2 className="scene-title" aria-label="In motion."><span aria-hidden="true">{'IN MOTION.'.split('').map((letter, i) => <span className="impact-letter" data-impact-piece key={i}>{letter === ' ' ? '\u00a0' : letter}</span>)}</span></h2>
      <ChapterExplorer entries={siteContent.currently} chapter="currently" />
    </div>
    <ImpactActor />
    <div className="impact-ground" data-impact-ground aria-hidden="true" />
    <div className="impact-dust" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index} data-impact-dust />)}</div>
    <div className="impact-ripple" data-impact-ripple aria-hidden="true" />
  </div>
}
