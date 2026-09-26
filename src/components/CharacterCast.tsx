import { characterAssets } from '../assets/characters/registry'

export function CharacterCast() {
  return <div className="character-cast" aria-hidden="true">
    <div className="cast-actor cast-ds" data-cast="deepseek"><img data-pose="push" src={characterAssets.deepseek.push} alt="" /><img data-pose="hard" src={characterAssets.deepseek.hard} alt="" /></div>
    <div className="cast-actor cast-grok" data-cast="grok"><img src={characterAssets.grok.push} alt="" /></div>
    <div className="cast-actor cast-gemini" data-cast="gemini"><img src={characterAssets.gemini.hop} alt="" /></div>
    <div className="cast-actor cast-claude" data-cast="claude"><img src={characterAssets.claude.follow} alt="" /></div>
    <div className="cast-actor cast-gpt" data-cast="gpt"><img src={characterAssets.gpt.observe} alt="" /></div>
  </div>
}

export function ImpactActor() {
  return <div className="impact-actor" data-impact-actor aria-hidden="true">
    {(['fall', 'preImpact', 'impact', 'recover', 'run'] as const).map((pose) => <img key={pose} data-impact-pose={pose} src={characterAssets.deepseek[pose]} alt="" />)}
  </div>
}
