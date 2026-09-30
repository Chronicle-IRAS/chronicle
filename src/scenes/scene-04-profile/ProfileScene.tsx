import { ChapterExplorer } from '../../features/chapter-explorer/ChapterExplorer'
import { SceneAtmosphere } from '../../components/SceneAtmosphere'
import { siteContent } from '../../data/siteContent'

export function ProfileScene() {
  return <div className="scene-content profile-content" data-scene-content>
    <div className="page-sheet" data-page-sheet aria-hidden="true"><SceneAtmosphere /></div>
    <div className="scene-body content-column">
      <p className="section-number">04 / PROFILE</p>
      <h2 className="scene-title">PROFILE</h2>
      <ChapterExplorer entries={siteContent.profile} chapter="profile" />
    </div>
    <div className="portal-mouth" data-portal-mouth aria-hidden="true"><i /><i /><i /></div>
  </div>
}
