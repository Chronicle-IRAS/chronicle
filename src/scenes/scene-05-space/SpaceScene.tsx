import { SceneAtmosphere } from '../../components/SceneAtmosphere'
import { siteContent } from '../../data/siteContent'

export function SpaceScene() {
  return <div className="scene-content space-content" data-scene-content>
    <SceneAtmosphere />
    <div className="scene-body content-column">
      <p className="section-number">05 / WHAT'S NEXT</p>
      <h2 className="scene-title">WHAT'S NEXT</h2>
      <ul className="future-orbits">{siteContent.future.map((topic, i) => <li key={topic}><span className="orbit-index">0{i + 1}</span><span>{topic}</span></li>)}</ul>
    </div>
  </div>
}
