import type { TransitionFactory } from '../../transitions/types'
import type { SceneId } from '../../types/scene'
import type { SpaceCamera } from './field'

export function addSpaceMotion(timeline: ReturnType<TransitionFactory>, id: SceneId, world: HTMLElement, camera: SpaceCamera, reducedMotion: boolean) {
  const motion = { ease: 'none', immediateRender: false }
  if (id === 'profile') {
    timeline.fromTo(world, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ...motion }, 0.05)
    timeline.fromTo(camera, { visible: 0, depth: 0, turn: 0, pan: 0, warp: 0 }, { visible: 1, depth: reducedMotion ? 0 : 700, turn: 0, pan: 0, warp: 0, duration: 0.85, ...motion }, 0.05)
  }
  if (id === 'space') {
    timeline.fromTo(camera, { depth: reducedMotion ? 0 : 700, turn: 0, pan: 0 }, { depth: reducedMotion ? 0 : 3900, turn: 0, pan: 0, duration: 1, ...motion, ease: 'power2.inOut' }, 0)
    timeline.fromTo(camera, { warp: 0 }, { warp: reducedMotion ? 0 : 1, duration: 0.35, ...motion, ease: 'power2.in' }, 0.15)
    timeline.to(camera, { warp: 0, duration: 0.35, ...motion, ease: 'power2.out' }, 0.65)
  }
  if (id === 'destinations') {
    timeline.fromTo(camera, { depth: reducedMotion ? 0 : 3900, turn: 0, pan: 0, warp: 0, visible: 1 }, { depth: reducedMotion ? 0 : 150, turn: 0, pan: 0, warp: 0, visible: 1, duration: 0.85, ...motion }, 0.1)
    timeline.fromTo(world, { autoAlpha: 1, clipPath: 'circle(150% at 70% 60%)' }, { autoAlpha: reducedMotion ? 0 : 1, clipPath: reducedMotion ? 'circle(150% at 70% 60%)' : 'circle(0% at 70% 60%)', duration: 0.85, ...motion }, 0.1)
    timeline.to(world, { autoAlpha: 0, duration: 0.05, ...motion }, 0.95)
    timeline.to(camera, { visible: 0, duration: 0.05, ...motion }, 0.95)
  }
}
