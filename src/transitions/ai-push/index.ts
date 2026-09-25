import { gsap } from '../../lib/gsap'
import type { TransitionFactory } from '../types'

export const aiPush: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true })
  timeline.fromTo(to, { autoAlpha: 0, xPercent: reducedMotion ? 0 : -8 }, { autoAlpha: 1, xPercent: 0, duration: 1 }, 0)
  timeline.to(from, { autoAlpha: 0, xPercent: reducedMotion ? 0 : 22, duration: 1 }, 0)
  return timeline
}
