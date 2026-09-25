import { gsap } from '../../lib/gsap'
import type { TransitionFactory } from '../types'

export const spaceTransition: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true })
  timeline.fromTo(to, { autoAlpha: 0, scale: reducedMotion ? 1 : 0.96 }, { autoAlpha: 1, scale: 1, duration: 1 }, 0)
  timeline.to(from, { autoAlpha: 0, duration: 1 }, 0)
  return timeline
}
