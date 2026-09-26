import { gsap } from '../../lib/gsap'
import type { TransitionFactory } from '../types'

export const spaceTransition: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none', immediateRender: false } })
  const body = from.querySelector('.scene-body')
  const incoming = to.querySelector('.scene-body')
  if (body) timeline.fromTo(body, { scale: 1, xPercent: 0, rotationY: 0, transformPerspective: 1200 }, { scale: reducedMotion ? 1 : 0.7, xPercent: reducedMotion ? 0 : -110, rotationY: reducedMotion ? 0 : -12, duration: 0.9, ease: 'power2.inOut' }, 0)
  timeline.fromTo(from, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.25 }, 0.65)
  timeline.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 0.1)
  if (incoming) timeline.fromTo(incoming, { scale: reducedMotion ? 1 : 1.25, xPercent: reducedMotion ? 0 : 110, rotationY: reducedMotion ? 0 : 12, transformPerspective: 1200 }, { scale: 1, xPercent: 0, rotationY: 0, duration: 0.9, ease: 'power2.inOut' }, 0.1)
  return timeline
}
