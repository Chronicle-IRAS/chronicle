import { SceneAtmosphere } from '../../components/SceneAtmosphere'
import { ImpactActor } from '../../components/CharacterCast'
import { siteContent } from '../../data/siteContent'

export function CurrentlyScene() {
  return <div className="scene-content" data-scene-content>
    <SceneAtmosphere />
    <div className="scene-body content-column">
      <p className="section-number">03 / CURRENTLY</p>
      <h2 className="scene-title" aria-label="CURRENTLY"><span aria-hidden="true">{'CURRENTLY'.split('').map((letter, i) => <span className="impact-letter" data-impact-piece key={i}>{letter}</span>)}</span></h2>
      <dl className="text-list">{siteContent.currently.map(({ label, value }) => <div data-impact-piece key={label}><dt>{label}</dt><dd>{value || '—'}</dd></div>)}</dl>
    </div>
    <ImpactActor />
    <div className="impact-ripple" data-impact-ripple aria-hidden="true" />
  </div>
}
