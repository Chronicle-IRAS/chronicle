import { gsap } from '../../lib/gsap'
import type { TransitionFactory } from '../types'

export const portalExit: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true })
  const portal = from.querySelector('.portal-exit-circle')
  if (portal && !reducedMotion) timeline.fromTo(portal, { scale: 30 }, { scale: 1, duration: 1 }, 0)
  timeline.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 0.2)
  timeline.to(from, { autoAlpha: 0, duration: 0.4 }, 0.6)
  return timeline
}
