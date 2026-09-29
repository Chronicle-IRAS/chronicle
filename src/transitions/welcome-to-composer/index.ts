import { gsap } from '../../lib/gsap'
import type { TransitionFactory } from '../types'

export const welcomeToComposer: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none' } })
  const support = from.querySelector('[data-enter-grid-support]')
  const title = from.querySelector('[data-enter-grid-title]')
  const backdrop = from.querySelector('[data-enter-grid-backdrop]')
  const heading = to.querySelector('[data-enter-grid-heading]')
  const canvas = to.querySelector('[data-enter-grid-canvas]')

  if (support) timeline.to(support, { autoAlpha: 0, duration: 0.24 }, 0.02)
  if (backdrop) timeline.to(backdrop, { autoAlpha: 0, duration: 0.65, ease: 'sine.inOut' }, 0.48)
  // The canvas only reveals once the typography group starts receding, so the oversized
  // CHRONICLE stays in the foreground instead of double-exposing with sharp Scene 02 nodes.
  // No blur: TRANSITIONS.md locks out heavy motion blur, and a full-screen filter is the
  // most expensive thing this boundary could animate.
  if (canvas) timeline.fromTo(
    canvas,
    { autoAlpha: 0, scale: reducedMotion ? 1 : 0.94 },
    { autoAlpha: 1, scale: 1, duration: 0.55, ease: 'sine.out' },
    0.7,
  )
  if (heading) timeline.fromTo(heading, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: 'sine.inOut' }, 0.9)

  if (reducedMotion) {
    if (title) timeline.to(title, { autoAlpha: 0, scale: 1.08, duration: 0.42 }, 0.46)
  } else {
    const farGrid = from.querySelector('[data-enter-grid-far]')
    const nearGrid = from.querySelector('[data-enter-grid-near]')
    const vignette = from.querySelector('[data-enter-grid-vignette]')
    if (title) {
      // A single acceleration curve avoids the old velocity jump between two zooms.
      timeline.to(title, { scale: 12, duration: 1.02, ease: 'power2.in' }, 0.04)
      timeline.to(title, { autoAlpha: 0, duration: 0.46, ease: 'sine.inOut' }, 0.6)
    }
    if (farGrid) timeline.to(farGrid, { scale: 1.06, autoAlpha: 0, duration: 0.56 }, 0.3)
    if (nearGrid) timeline.fromTo(nearGrid, { autoAlpha: 0 }, { autoAlpha: 0.45, duration: 0.46 }, 0.3)
    if (vignette) timeline.to(vignette, { autoAlpha: 0, duration: 0.5 }, 0.35)
  }
  return timeline
}
