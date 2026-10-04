import { gsap } from '../../lib/gsap'
import type { TransitionFactory } from '../types'

export const preludeToWelcome: TransitionFactory = ({ from, to, reducedMotion }) => {
  const t = gsap.timeline({ paused: true })
  const paper = from.querySelector('[data-prelude-paper]')
  const pieces = from.querySelectorAll('[data-absorb]')
  const aperture = from.querySelector('[data-prelude-aperture]')
  t.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: .05, immediateRender: false }, 0)
  if (reducedMotion) return t.to(from, { autoAlpha: 0, duration: .35 }, 0)
  if (aperture) t.fromTo(aperture, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: .65, ease: 'power2.out', immediateRender: false }, .05)
  t.fromTo(from, { '--ink-collapse': 0 }, { '--ink-collapse': 1, duration: 1.7, ease: 'power2.in', immediateRender: false }, .2)
  t.to(pieces, { x: (_, target: HTMLElement) => window.innerWidth * .5 - (target.getBoundingClientRect().left + target.getBoundingClientRect().width * .5), y: (_, target: HTMLElement) => window.innerHeight * .44 - (target.getBoundingClientRect().top + target.getBoundingClientRect().height * .5), scale: .015, rotation: 100, autoAlpha: 0, stagger: .09, duration: 1.45, ease: 'power3.in' }, .3)
  if (paper) t.fromTo(paper, { '--aperture': '0%' }, { '--aperture': '110%', duration: 1.35, ease: 'power3.in', immediateRender: false }, .8)
  if (aperture) t.to(aperture, { scale: 4, autoAlpha: 0, duration: 1, ease: 'power2.in' }, 1)
  return t.to(from, { autoAlpha: 0, duration: .2 }, 2.05)
}

/** The return releases ink onto a settling sheet, rather than reversing the implosion. */
export const welcomeToPrelude: TransitionFactory = ({ from, to, reducedMotion }) => {
  const t = gsap.timeline({ paused: true })
  const pieces = to.querySelectorAll('[data-absorb]')
  const paper = to.querySelector('[data-prelude-paper]')
  const aperture = to.querySelector('[data-prelude-aperture]')
  t.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: .1, immediateRender: false }, 0)
  if (reducedMotion) return t.to(from, { autoAlpha: 0, duration: .3 }, 0)
  if (aperture) t.set(aperture, { autoAlpha: 0 }, 0)
  if (paper) t.fromTo(paper, { '--aperture': '110%' }, { '--aperture': '0%', duration: 1.35, ease: 'power2.inOut', immediateRender: false }, 0)
  t.fromTo(to, { '--ink-collapse': 1 }, { '--ink-collapse': 0, duration: 1.6, ease: 'power2.out', immediateRender: false }, .35)
  t.fromTo(pieces, { x: 0, y: 35, scale: .94, rotation: -3, autoAlpha: 0 }, { x: 0, y: 0, scale: 1, rotation: 0, autoAlpha: 1, stagger: .12, duration: .95, ease: 'power3.out', immediateRender: false }, .6)
  return t.to(from, { autoAlpha: 0, duration: .25 }, 1.5)
}
