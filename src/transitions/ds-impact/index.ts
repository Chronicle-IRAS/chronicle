import { gsap } from '../../lib/gsap'
import { createTextImpact } from '../../features/text-impact/createTextImpact'
import type { TransitionFactory } from '../types'

export const dsImpact: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none', immediateRender: false } })
  if (!reducedMotion) {
    const actor = from.querySelector('[data-impact-actor]')
    if (actor) {
      const poses = ['fall', 'preImpact', 'impact', 'recover', 'run']
      timeline.fromTo(actor, { autoAlpha: 0, y: -window.innerHeight, x: 0 }, { autoAlpha: 1, y: -window.innerHeight * 0.6, duration: 0.12 }, 0.06)
      timeline.to(actor, { y: 0, rotation: 8, duration: 0.19, ease: 'power2.in' }, 0.18)
      poses.forEach((pose, i) => {
        const image = actor.querySelector(`[data-impact-pose="${pose}"]`)
        if (!image) return
        timeline.fromTo(image, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.001 }, [0.06, 0.29, 0.37, 0.52, 0.67][i])
        if (i < 4) timeline.to(image, { autoAlpha: 0, duration: 0.001 }, [0.29, 0.37, 0.52, 0.67][i])
      })
      timeline.to(actor, { rotation: 0, duration: 0.15 }, 0.52)
      timeline.to(actor, { x: window.innerWidth, autoAlpha: 0, duration: 0.26, ease: 'power2.in' }, 0.67)
    }
    // The impact impulse drives the separate, deterministic text system.
    const textMotion = createTextImpact(from)
    timeline.fromTo(textMotion, { progress: 0 }, { progress: 1, duration: 0.45 }, 0.37)
    const ripple = from.querySelector('[data-impact-ripple]')
    if (ripple) {
      timeline.fromTo(ripple, { autoAlpha: 0, scale: 0.1 }, { autoAlpha: 0.45, scale: 1, duration: 0.08 }, 0.37)
      timeline.to(ripple, { autoAlpha: 0, scale: 4, duration: 0.25 }, 0.45)
    }
    const body = from.querySelector('.scene-body')
    if (body) {
      timeline.fromTo(body, { x: 0 }, { x: -5, duration: 0.025 }, 0.37)
      timeline.to(body, { x: 5, duration: 0.025 }, 0.395)
      timeline.to(body, { x: 0, duration: 0.025 }, 0.42)
    }
  }
  if (reducedMotion) {
    timeline.fromTo(from, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3 }, 0.3)
    timeline.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.3)
  } else {
    // Keep the shared chapter behind the impact; only Profile's copy floats up.
    timeline.to(from, { backgroundColor: 'transparent', duration: 0.16 }, 0.58)
    const body = from.querySelector('.scene-body')
    if (body) timeline.to(body, { autoAlpha: 0, duration: 0.2 }, 0.58)
    timeline.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0.58)
    const copy = to.querySelectorAll('.section-number, .scene-title, .text-list > div')
    if (copy.length) timeline.fromTo(copy, { y: 44, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.62, stagger: 0.075, ease: 'power2.out' }, 0.62)
    timeline.fromTo(from, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.12 }, 0.93)
  }
  return timeline
}
