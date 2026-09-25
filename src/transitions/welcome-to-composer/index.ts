import { gsap } from '../../lib/gsap'
import type { TransitionFactory } from '../types'

export const welcomeToComposer: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none' } })
  const copy = from.querySelector('[data-enter-grid-copy]')
  const heading = to.querySelector('[data-enter-grid-heading]')
  const canvas = to.querySelector('[data-enter-grid-canvas]')

  if (copy) timeline.to(copy, { autoAlpha: 0, yPercent: reducedMotion ? 0 : -12, scale: reducedMotion ? 1 : 0.96, duration: 0.38 }, 0.04)
  if (heading) timeline.fromTo(heading, { autoAlpha: 0, y: reducedMotion ? 0 : 18 }, { autoAlpha: 1, y: 0, duration: 0.38 }, 0.42)
  if (canvas) timeline.fromTo(canvas, { autoAlpha: 0, scale: reducedMotion ? 1 : 0.965 }, { autoAlpha: 1, scale: 1, duration: 0.42 }, 0.43)
  timeline.to(from, { autoAlpha: 0, duration: 0.24 }, 0.7)

  if (!reducedMotion) {
    const farGrid = from.querySelector('[data-enter-grid-far]')
    const nearGrid = from.querySelector('[data-enter-grid-near]')
    const vignette = from.querySelector('[data-enter-grid-vignette]')
    if (farGrid) timeline.to(farGrid, { scale: 1.8, autoAlpha: 0, duration: 0.55 }, 0.05)
    if (nearGrid) timeline.fromTo(nearGrid, { autoAlpha: 0, scale: 0.82 }, { autoAlpha: 0.7, scale: 1, duration: 0.62 }, 0.12)
    if (vignette) timeline.to(vignette, { autoAlpha: 0, duration: 0.52 }, 0.08)
  }
  return timeline
}
