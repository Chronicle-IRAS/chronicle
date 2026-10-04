import { gsap } from '../../lib/gsap'
import type { TransitionFactory } from '../types'

export const preludeToWelcome: TransitionFactory = ({ from, to, reducedMotion }) => {
  const t = gsap.timeline({ paused: true })
  const paper = from.querySelector('[data-prelude-paper]')
  const pieces = from.querySelectorAll('[data-absorb]')
  const hole = to.querySelector('[data-enter-grid-orb]')
  const title = to.querySelector('[data-enter-grid-title]')
  const cue = to.querySelector('[data-enter-grid-support]')
  const back = to.querySelector('[data-journey-prev]')
  t.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: .05, immediateRender: false }, 0)
  if (reducedMotion) return t.to(from, { autoAlpha: 0, duration: .35 }, 0)
  // The same WebGL hole stays in its Welcome host throughout the handoff.
  if (hole) t.fromTo(hole, { scale: .46 }, { scale: 1, duration: 3.1, ease: 'sine.inOut', immediateRender: false }, 0)
  const welcomeCopy = [title, cue, back].filter(Boolean)
  if (welcomeCopy.length) t.fromTo(welcomeCopy, { autoAlpha: 0 }, { autoAlpha: 1, duration: .65, stagger: .07, immediateRender: false }, 2.65)
  if (paper) t.fromTo(paper, { '--aperture': '0%' }, { '--aperture': '24%', duration: .85, ease: 'sine.out', immediateRender: false }, 0)
    .to(paper, { '--aperture': '115%', duration: 2.1, ease: 'sine.inOut' }, .85)
  t.fromTo(from, { '--ink-collapse': 0 }, { '--ink-collapse': 1, duration: 2.65, ease: 'sine.inOut', immediateRender: false }, .35)
  // Each word has its own delayed, elliptical orbit instead of shrinking a whole text block.
  const orbit = { progress: 0 }
  let origins: { node: Element; dx: number; dy: number }[] = []
  t.set(pieces, { x: 0, y: 0, scale: 1, rotation: 0, autoAlpha: 1 }, 0)
  t.to(orbit, { progress: 1, duration: 2.45, ease: 'none', onStart: () => {
    origins = Array.from(pieces).map((node) => {
      const rect = node.getBoundingClientRect()
      return { node, dx: rect.left + rect.width / 2 - window.innerWidth * .5, dy: rect.top + rect.height / 2 - window.innerHeight * .43 }
    })
  }, onUpdate: () => {
    origins.forEach(({ node, dx, dy }, i) => {
      const p = Math.max(0, Math.min(1, (orbit.progress - i * .018) / .82))
      const shrink = 1 - p * p
      const turn = p * p * (2.8 + i * .08)
      const x = (dx * Math.cos(turn) - dy * Math.sin(turn) * 1.3) * shrink - dx
      const y = (dx * Math.sin(turn) * .55 + dy * Math.cos(turn)) * shrink - dy
      gsap.set(node, { x, y, rotation: p * (i % 2 ? 35 : -25), scale: 1 - p * .96, autoAlpha: 1 - Math.pow(p, 4) })
    })
  } }, .45)
  return t.to(from, { autoAlpha: 0, duration: .3 }, 2.95)
}

/** The return releases ink onto a settling sheet, rather than reversing the implosion. */
export const welcomeToPrelude: TransitionFactory = ({ from, to, reducedMotion }) => {
  const t = gsap.timeline({ paused: true })
  const pieces = to.querySelectorAll('[data-absorb]')
  const paper = to.querySelector('[data-prelude-paper]')
  t.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: .1, immediateRender: false }, 0)
  if (reducedMotion) return t.to(from, { autoAlpha: 0, duration: .3 }, 0)
  if (paper) t.fromTo(paper, { '--aperture': '110%' }, { '--aperture': '0%', duration: 1.35, ease: 'power2.inOut', immediateRender: false }, 0)
  t.fromTo(to, { '--ink-collapse': 1 }, { '--ink-collapse': 0, duration: 1.6, ease: 'power2.out', immediateRender: false }, .35)
  t.fromTo(pieces, { x: 0, y: 35, scale: .94, rotation: -3, autoAlpha: 0 }, { x: 0, y: 0, scale: 1, rotation: 0, autoAlpha: 1, stagger: .12, duration: .95, ease: 'power3.out', immediateRender: false }, .6)
  return t.to(from, { autoAlpha: 0, duration: .25 }, 1.5)
}
