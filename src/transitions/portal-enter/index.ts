import { gsap } from '../../lib/gsap'
import type { TransitionFactory } from '../types'

export const portalEnter: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true })
  const portal = from.querySelector('.portal-enter-circle')
  if (portal && !reducedMotion) timeline.fromTo(portal, { scale: 1 }, { scale: 30, duration: 1 }, 0)
  timeline.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 0.4)
  timeline.to(from, { autoAlpha: 0, duration: 0.35 }, 0.65)
  return timeline
}
