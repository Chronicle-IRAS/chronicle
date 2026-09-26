import { gsap } from '../../lib/gsap'
import type { TransitionFactory } from '../types'

export const spaceTransition: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none', immediateRender: false } })
  const body = from.querySelector('.scene-body')
  const incoming = to.querySelector('.scene-body')
  // Travel along the view axis: pass the future copy, cross open space, arrive at planets.
  if (body) timeline.fromTo(body, { scale: 1, z: 0, xPercent: 0, rotationY: 0, transformPerspective: 1200 }, { scale: reducedMotion ? 1 : 2.8, z: reducedMotion ? 0 : 500, duration: 0.48, ease: 'power2.in' }, 0)
  timeline.fromTo(from, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.2 }, 0.28)
  timeline.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.58)
  if (incoming) timeline.fromTo(incoming, { scale: reducedMotion ? 1 : 0.8, z: reducedMotion ? 0 : -2600, xPercent: 0, rotationY: 0, transformPerspective: 1200 }, { scale: 1, z: 0, duration: 0.45, ease: 'power3.out' }, 0.55)
  return timeline
}
