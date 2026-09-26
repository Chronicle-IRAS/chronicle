import { gsap } from '../../lib/gsap'
import { createTextImpact } from '../../features/text-impact/createTextImpact'
import type { TransitionFactory } from '../types'

export const dsImpact: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none', immediateRender: false } })
  if (!reducedMotion) {
    const actor = from.querySelector('[data-impact-actor]')
    if (actor) {
      const poses = ['fall', 'preImpact', 'impact', 'recover', 'run']
      timeline.fromTo(actor, { autoAlpha: 0, y: -window.innerHeight, x: 0 }, { autoAlpha: 1, y: -window.innerHeight * 0.78, duration: 0.24 }, 0.08)
      timeline.to(actor, { y: 0, rotation: 8, duration: 0.52, ease: 'power1.in' }, 0.32)
      poses.forEach((pose, i) => {
        const image = actor.querySelector(`[data-impact-pose="${pose}"]`)
        if (!image) return
        timeline.fromTo(image, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.001 }, [0.08, 0.65, 0.84, 1.05, 1.22][i])
        if (i < 4) timeline.to(image, { autoAlpha: 0, duration: 0.001 }, [0.65, 0.84, 1.05, 1.22][i])
      })
      timeline.to(actor, { rotation: 0, duration: 0.17 }, 1.05)
      timeline.to(actor, { x: window.innerWidth, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, 1.22)
    }
    // The impact impulse drives the separate, deterministic text system.
    const textMotion = createTextImpact(from)
    timeline.fromTo(textMotion, { progress: 0 }, { progress: 1, duration: 0.55 }, 0.84)
    const ripple = from.querySelector('[data-impact-ripple]')
    if (ripple) {
      timeline.fromTo(ripple, { autoAlpha: 0, scale: 0.1 }, { autoAlpha: 0.45, scale: 1, duration: 0.1 }, 0.84)
      timeline.to(ripple, { autoAlpha: 0, scale: 4, duration: 0.3 }, 0.94)
    }
    const body = from.querySelector('.scene-body')
    if (body) {
      timeline.fromTo(body, { x: 0 }, { x: -5, duration: 0.025 }, 0.84)
      timeline.to(body, { x: 5, duration: 0.025 }, 0.865)
      timeline.to(body, { x: 0, duration: 0.025 }, 0.89)
    }
  }
  if (reducedMotion) {
    timeline.fromTo(from, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3 }, 0.3)
    timeline.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.3)
  } else {
    // Keep the shared chapter behind the impact; only Profile's copy floats up.
    timeline.to(from, { backgroundColor: 'transparent', duration: 0.22 }, 1.1)
    const body = from.querySelector('.scene-body')
    if (body) timeline.to(body, { autoAlpha: 0, duration: 0.24 }, 1.1)
    timeline.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 1.1)
    const copy = to.querySelectorAll('.section-number, .scene-title, .text-list > div')
    if (copy.length) timeline.fromTo(copy, { y: 44, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.78, stagger: 0.075, ease: 'power2.out' }, 1.17)
    timeline.fromTo(from, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.15 }, 1.65)
  }
  return timeline
}

/** Return to the chapter without resurrecting the impact or rewinding the fall. */
export const profileReturn: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true, defaults: { immediateRender: false } })
  const incoming = to.querySelectorAll('.section-number, .scene-title, .text-list > div')
  timeline.set(to.querySelectorAll('[data-impact-actor], [data-impact-ripple]'), { autoAlpha: 0 }, 0)
  timeline.set(to.querySelectorAll('[data-impact-piece]'), { x: 0, y: 0, rotation: 0 }, 0)
  timeline.set(to, { autoAlpha: 1, backgroundColor: 'transparent' }, 0)
  timeline.set(to.querySelector('.scene-body'), { autoAlpha: 1, x: 0 }, 0)
  timeline.set(incoming, { autoAlpha: 0 }, 0)
  timeline.fromTo(from.querySelector('.scene-body'), { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: reducedMotion ? 0 : -14, duration: 0.35, ease: 'power1.inOut' }, 0)
  timeline.fromTo(incoming, { autoAlpha: 0, y: reducedMotion ? 0 : 24 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: reducedMotion ? 0 : 0.055, ease: 'power2.out' }, 0.36)
  timeline.fromTo(from, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.1 }, 0.84)
  timeline.set(from.querySelector('.scene-body'), { y: 0, autoAlpha: 1 }, 0.94)
  return timeline
}
