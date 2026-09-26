import { gsap } from '../../lib/gsap'
import type { TransitionFactory } from '../types'

export const spaceTransition: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none', immediateRender: false } })
  const body = from.querySelector('.scene-body')
  if (body) timeline.fromTo(body, { scale: 1, y: 0 }, { scale: reducedMotion ? 1 : 0.9, y: reducedMotion ? 0 : -30, duration: 0.6 }, 0.15)
  timeline.fromTo(from, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.5 }, 0.25)
  timeline.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.55 }, 0.4)
  const planets = to.querySelectorAll('.destination')
  if (planets.length) timeline.fromTo(planets, { scale: reducedMotion ? 1 : 0.7, y: reducedMotion ? 0 : 30 }, { scale: 1, y: 0, duration: 0.45, stagger: 0.025 }, 0.43)
  return timeline
}
