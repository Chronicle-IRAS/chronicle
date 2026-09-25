import { gsap } from '../../lib/gsap'
import type { TransitionFactory } from '../types'

export const welcomeToComposer: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none' } })
  const support = from.querySelector('[data-enter-grid-support]')
  const title = from.querySelector('[data-enter-grid-title]')
  const heading = to.querySelector('[data-enter-grid-heading]')
  const canvas = to.querySelector('[data-enter-grid-canvas]')

  if (support) timeline.to(support, { autoAlpha: 0, yPercent: reducedMotion ? 0 : -12, duration: 0.24 }, 0.02)
  if (canvas) timeline.fromTo(canvas, { autoAlpha: 0 }, { autoAlpha: 1, duration: reducedMotion ? 0.4 : 0.38 }, 0.5)
  if (heading) timeline.fromTo(heading, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.22 }, 0.76)

  if (reducedMotion) {
    if (title) timeline.to(title, { autoAlpha: 0, scale: 1.08, duration: 0.42 }, 0.46)
  } else {
    const farGrid = from.querySelector('[data-enter-grid-far]')
    const nearGrid = from.querySelector('[data-enter-grid-near]')
    const vignette = from.querySelector('[data-enter-grid-vignette]')
    if (title) {
      timeline.to(title, { scale: 8, duration: 0.62 }, 0.22)
      timeline.to(title, { yPercent: -850, autoAlpha: 0, duration: 0.18 }, 0.82)
    }
    if (farGrid) timeline.to(farGrid, { scale: 1.06, autoAlpha: 0, duration: 0.56 }, 0.3)
    if (nearGrid) timeline.fromTo(nearGrid, { autoAlpha: 0 }, { autoAlpha: 0.45, duration: 0.46 }, 0.3)
    if (vignette) timeline.to(vignette, { autoAlpha: 0, duration: 0.5 }, 0.35)
  }
  return timeline
}
