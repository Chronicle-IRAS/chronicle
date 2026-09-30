import { gsap } from '../../lib/gsap'
import { createTextImpact } from '../../features/text-impact/createTextImpact'
import type { TransitionFactory } from '../types'

export const dsImpact: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none', immediateRender: false } })
  if (!reducedMotion) {
    const actor = from.querySelector('[data-impact-actor]')
    if (actor) {
      const poses = ['fall', 'preImpact', 'impact', 'recover', 'run']
      timeline.fromTo(actor, { autoAlpha: 0, y: -window.innerHeight * 0.75, x: -55, rotation: -18, scaleX: 0.94, scaleY: 1.06 }, { autoAlpha: 1, y: -window.innerHeight * 0.42, x: -30, rotation: 12, duration: 0.38, ease: 'sine.out' }, 0.02)
      timeline.to(actor, { y: 0, x: 0, rotation: -3, duration: 0.44, ease: 'power2.in' }, 0.4)
      timeline.to(actor, { scaleX: 1.17, scaleY: 0.8, y: 12, duration: 0.065, ease: 'power2.out' }, 0.84)
      timeline.to(actor, { scaleX: 0.96, scaleY: 1.04, y: -26, rotation: 4, duration: 0.12, ease: 'power2.out' }, 0.905)
      timeline.to(actor, { scaleX: 1, scaleY: 1, y: 0, rotation: 0, duration: 0.15, ease: 'power2.in' }, 1.025)
      poses.forEach((pose, i) => {
        const image = actor.querySelector(`[data-impact-pose="${pose}"]`)
        if (!image) return
        timeline.fromTo(image, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.001 }, [0.08, 0.65, 0.84, 1.05, 1.22][i])
        if (i < 4) timeline.to(image, { autoAlpha: 0, duration: 0.001 }, [0.65, 0.84, 1.05, 1.22][i])
      })
      timeline.to(actor, { x: -14, rotation: -8, duration: 0.12, ease: 'sine.inOut' }, 1.18)
      timeline.to(actor, { x: window.innerWidth, rotation: 6, duration: 0.46, ease: 'power2.in' }, 1.3)
      timeline.to(actor, { y: -9, duration: 0.055, repeat: 5, yoyo: true, ease: 'sine.inOut' }, 1.3)
      const trail = actor.querySelector('[data-impact-trail]')
      if (trail) {
        timeline.fromTo(trail, { autoAlpha: 0, scaleY: 0.2 }, { autoAlpha: 0.6, scaleY: 1, duration: 0.3 }, 0.4)
        timeline.to(trail, { autoAlpha: 0, duration: 0.08 }, 0.8)
      }
    }
    const ground = from.querySelector('[data-impact-ground]')
    if (ground) {
      timeline.fromTo(ground, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 0.65, scale: 1, duration: 0.7, ease: 'power2.in' }, 0.14)
      timeline.to(ground, { autoAlpha: 0, scale: 1.4, duration: 0.6 }, 0.9)
    }
    const dust = from.querySelectorAll('[data-impact-dust]')
    dust.forEach((particle, index) => {
      const angle = Math.PI * 2 * index / 8
      timeline.fromTo(particle, { x: 0, y: 0, scale: 0, autoAlpha: 0 }, { x: Math.cos(angle) * 120, y: Math.sin(angle) * 38 - 15, scale: 1.5, autoAlpha: 0.7, duration: 0.16, ease: 'power2.out' }, 0.84)
      timeline.to(particle, { x: Math.cos(angle) * 190, y: Math.sin(angle) * 50 + 15, scale: 0.2, autoAlpha: 0, duration: 0.45, ease: 'sine.out' }, 1)
    })
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
    // GSAP parses 'transparent' as rgba(255, 255, 255, 0), so tweening to it drags the
    // chapter through light grey. Hold the chapter RGB and fade alpha only.
    timeline.to(from, { backgroundColor: 'rgba(22, 32, 40, 0)', duration: 0.22 }, 1.1)
    const body = from.querySelector('.scene-body')
    if (body) timeline.to(body, { autoAlpha: 0, duration: 0.24 }, 1.1)
    timeline.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 1.1)
    const copy = to.querySelectorAll('.section-number, .scene-title, .text-list > div, .chapter-detail')
    if (copy.length) timeline.fromTo(copy, { y: 44, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.78, stagger: 0.075, ease: 'power2.out' }, 1.17)
    timeline.fromTo(from, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.15 }, 1.65)
  }
  return timeline
}

/** Return to the chapter without resurrecting the impact or rewinding the fall. */
export const profileReturn: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true, defaults: { immediateRender: false } })
  const incoming = to.querySelectorAll('.section-number, .scene-title, .text-list > div, .chapter-detail')
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
