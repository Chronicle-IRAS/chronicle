import { gsap } from '../../lib/gsap'
import type { TransitionFactory } from '../types'

/** The eclipse becomes an iris into the board; typography stays at its original size. */
export const welcomeToComposer: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true, defaults: { ease: 'sine.inOut' } })
  timeline.set(to, { autoAlpha: 1 }, 0)
  const stage = to.querySelector('[data-composer-stage]')
  if (stage) timeline.set(stage, { autoAlpha: 1 }, 0)
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
    // A phone-sized hole already fills the screen at 3x. A 9x masked surface
    // can exceed mobile compositor texture limits while it is fading out.
    const zoom = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches ? 3 : 9
    timeline.fromTo(orb, { scale: 1, rotation: 0 }, { scale: zoom, rotation: 18, duration: 0.77, ease: 'power2.in' }, 0.48)
  }
  if (backdrop) timeline.to(backdrop, { autoAlpha: 0, duration: 0.45 }, 0.8)
  if (canvas) timeline.fromTo(canvas,
    { autoAlpha: 0, clipPath: reducedMotion ? 'circle(150% at 50% 44%)' : 'circle(0% at 50% 44%)' },
    { autoAlpha: 1, clipPath: 'circle(150% at 50% 44%)', duration: 0.65, ease: 'power2.inOut' }, 0.6)
  if (heading) timeline.fromTo(heading, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.95)
  return timeline
}

/** Leave the board gently, then pull the camera back to the settled black hole. */
export const composerToWelcome: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true, defaults: { immediateRender: false } })
  const stage = from.querySelector('[data-composer-stage]')
  const backdrop = to.querySelector('[data-enter-grid-backdrop]')
  const orb = to.querySelector('[data-enter-grid-orb]')
  const loading = to.querySelector('[data-enter-grid-loading]')
  const copy = [to.querySelector('[data-enter-grid-title]'), to.querySelector('[data-enter-grid-support]'), to.querySelector('[data-journey-prev]')].filter(Boolean)
  timeline.set(to, { autoAlpha: 0 }, 0)
  if (backdrop) timeline.set(backdrop, { autoAlpha: 1 }, 0)
  if (loading) timeline.set(loading, { autoAlpha: 0 }, 0)
  if (copy.length) timeline.set(copy, { autoAlpha: 0, y: 0 }, 0)
  if (stage) timeline.fromTo(stage, { autoAlpha: 1 }, { autoAlpha: 0, duration: .18 }, 0)
  if (orb) {
    timeline.fromTo(orb,
      { scale: reducedMotion ? 1 : 1.65, rotation: reducedMotion ? 0 : -6, '--hole-spin': reducedMotion ? 0 : 10 },
      { scale: 1, rotation: 0, '--hole-spin': 0, duration: 1.15, ease: 'power2.out' }, .22)
  }
  timeline.fromTo(from, { autoAlpha: 1 }, { autoAlpha: 0, duration: .55, ease: 'sine.inOut' }, .22)
  timeline.to(to, { autoAlpha: 1, duration: .55, ease: 'sine.inOut' }, .22)
  if (copy.length) timeline.to(copy, { autoAlpha: 1, duration: .4, stagger: .035, ease: 'sine.out' }, .85)
  return timeline
}
