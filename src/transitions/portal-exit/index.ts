import { gsap } from '../../lib/gsap'
import type { TransitionFactory } from '../types'

export const portalExit: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none', immediateRender: false } })
  timeline.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.05)
  const body = from.querySelector('.scene-body')
  if (body) timeline.fromTo(body, { scale: 1 }, { scale: reducedMotion ? 1 : 0.55, duration: 0.8 }, 0.1)
  timeline.fromTo(from, { autoAlpha: 1, clipPath: 'circle(150% at 70% 60%)' }, { autoAlpha: reducedMotion ? 0 : 1, clipPath: reducedMotion ? 'circle(150% at 70% 60%)' : 'circle(0% at 70% 60%)', duration: 0.8 }, 0.15)
  timeline.to(from, { autoAlpha: 0, duration: 0.05 }, 0.95)
  return timeline
}
