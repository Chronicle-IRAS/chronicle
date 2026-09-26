import { gsap } from '../../lib/gsap'
import type { TransitionFactory } from '../types'

export const aiPush: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none', immediateRender: false } })
  timeline.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 0.1)
  if (!reducedMotion) {
    const cast = from.querySelector('.character-cast')
    const ds = from.querySelector('[data-cast="deepseek"]')
    const grok = from.querySelector('[data-cast="grok"]')
    const gemini = from.querySelector('[data-cast="gemini"]')
    const claude = from.querySelector('[data-cast="claude"]')
    const gpt = from.querySelector('[data-cast="gpt"]')
    if (cast) timeline.fromTo(cast, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, 0.04)
    if (ds) {
      timeline.fromTo(ds, { x: -180, rotation: -10 }, { x: 0, rotation: 5, duration: 0.2 }, 0.04)
      timeline.fromTo(ds.querySelector('[data-pose="push"]'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.01 }, 0.23)
      timeline.fromTo(ds.querySelector('[data-pose="hard"]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0.23)
    }
    if (grok) timeline.fromTo(grok, { x: -200, rotation: -4 }, { x: 0, rotation: 2, duration: 0.23 }, 0.04)
    if (gemini) {
      timeline.fromTo(gemini, { x: -240, y: 0 }, { x: 0, y: -55, duration: 0.16 }, 0.08)
      timeline.to(gemini, { y: 0, duration: 0.13 }, 0.24)
      timeline.to(gemini, { y: -30, duration: 0.12 }, 0.4)
      timeline.to(gemini, { y: 0, duration: 0.12 }, 0.52)
    }
    if (claude) timeline.fromTo(claude, { x: -240 }, { x: 0, duration: 0.48 }, 0.1)
    if (gpt) timeline.fromTo(gpt, { x: -160, y: -5 }, { x: 0, y: 0, duration: 0.42 }, 0.12)
  }
  // Friction beat: the page holds until the cast has visibly exerted force.
  timeline.fromTo(from, { xPercent: 0, autoAlpha: 1 }, { xPercent: reducedMotion ? 0 : 105, autoAlpha: reducedMotion ? 0 : 1, duration: 0.65, ease: 'power2.in' }, 0.3)
  timeline.to(from, { autoAlpha: 0, duration: 0.05 }, 0.95)
  return timeline
}
