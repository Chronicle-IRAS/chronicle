import { gsap } from '../../lib/gsap'
import type { TransitionFactory } from '../types'

/** The eclipse becomes an iris into the board; typography stays at its original size. */
export const welcomeToComposer: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true, defaults: { ease: 'sine.inOut' } })
  const back = from.querySelector('[data-journey-prev]')
  if (back) timeline.to(back, { autoAlpha: 0, duration: .18 }, 0)
  const support = from.querySelector('[data-enter-grid-support]')
  const title = from.querySelector('[data-enter-grid-title]')
  const backdrop = from.querySelector('[data-enter-grid-backdrop]')
  const orb = from.querySelector('[data-enter-grid-orb]')
  const loading = from.querySelector('[data-enter-grid-loading]')
  const heading = to.querySelector('[data-enter-grid-heading]')
  const canvas = to.querySelector('[data-enter-grid-canvas]')
  if (support) timeline.to(support, { autoAlpha: 0, duration: 0.18 }, 0)
  if (title) timeline.to(title, { autoAlpha: 0, duration: 0.35 }, 0.06)
  if (loading) timeline.fromTo(loading, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12 }, 0.08).to(loading, { autoAlpha: 0, duration: 0.25 }, 0.7)
  if (orb && !reducedMotion) {
    timeline.fromTo(orb, { '--hole-spin': 0 }, { '--hole-spin': 32, duration: 1.2, ease: 'power2.in' }, 0)
    timeline.fromTo(orb, { scale: 1, rotation: 0 }, { scale: 9, rotation: 18, duration: 0.77, ease: 'power2.in' }, 0.48)
  }
  if (backdrop) timeline.to(backdrop, { autoAlpha: 0, duration: 0.45 }, 0.8)
  if (canvas) timeline.fromTo(canvas,
    { autoAlpha: 0, clipPath: reducedMotion ? 'circle(150% at 50% 44%)' : 'circle(0% at 50% 44%)' },
    { autoAlpha: 1, clipPath: 'circle(150% at 50% 44%)', duration: 0.65, ease: 'power2.inOut' }, 0.6)
  if (heading) timeline.fromTo(heading, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.95)
  return timeline
}
