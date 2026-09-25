import { gsap } from '../../lib/gsap'
import type { TransitionFactory } from '../types'

export const dsImpact: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true })
  timeline.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, 0)
  timeline.to(from, { autoAlpha: 0, x: reducedMotion ? 0 : -36, y: reducedMotion ? 0 : 22, duration: 1 }, 0)
  return timeline
}
