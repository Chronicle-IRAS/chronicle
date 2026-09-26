import { siteContent } from '../../data/siteContent'

export function ProfileScene() {
  return <div className="scene-content profile-content" data-scene-content>
    <div className="page-sheet" data-page-sheet aria-hidden="true" />
    <div className="scene-body content-column">
      <p className="section-number">04 / PROFILE</p>
      <h2 className="scene-title">PROFILE</h2>
      <dl className="text-list profile-list">{siteContent.profile.map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{value || '—'}</dd></div>)}</dl>
    </div>
    <div className="portal-mouth" data-portal-mouth aria-hidden="true"><i /><i /><i /></div>
  </div>
}
