import { gsap } from '../../lib/gsap'
import type { TransitionFactory } from '../types'
import { inkCapture } from '../../features/ink/capture'

export const preludeToWelcome: TransitionFactory = ({ from, to, reducedMotion }) => {
  const t = gsap.timeline({ paused: true })
  const paper = from.querySelector('[data-prelude-paper]')
  const pieces = from.querySelectorAll('[data-absorb]')
  const chrome = from.querySelectorAll('[data-prelude-chrome]')
  const hole = to.querySelector('[data-enter-grid-orb]')
  const title = to.querySelector('[data-enter-grid-title]')
  const cue = to.querySelector('[data-enter-grid-support]')
  const back = to.querySelector('[data-journey-prev]')
  t.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: .05, immediateRender: false }, 0)
  if (reducedMotion) return t.to(from, { autoAlpha: 0, duration: .35 }, 0)
  // The same WebGL hole stays in its Welcome host throughout the handoff.
  if (hole) t.fromTo(hole, { scale: .82 }, { scale: 1, duration: 4.6, ease: 'sine.inOut', immediateRender: false }, 0)
  const welcomeCopy = [title, cue, back].filter(Boolean)
  if (welcomeCopy.length) {
    t.set(welcomeCopy, { autoAlpha: 0 }, 0)
    t.to(welcomeCopy, { autoAlpha: 1, duration: 1, stagger: .1 }, 4)
  }
  if (chrome.length) t.fromTo(chrome, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -10, duration: .65, stagger: .04, ease: 'sine.in', immediateRender: false }, .1)
  // Reveal the entire disk together; a circular cutout reads as a second, unrelated hole.
  if (paper) t.fromTo(paper, { opacity: 1 }, { opacity: .12, duration: 1.6, ease: 'sine.inOut', immediateRender: false }, .3)
    .to(paper, { opacity: 0, duration: .8, ease: 'sine.out' }, 1.9)
  t.fromTo(from, { '--paper-halo': 1 }, { '--paper-halo': 0, duration: 1.2, immediateRender: false }, .2)
  t.fromTo(from, { '--ink-collapse': 0 }, { '--ink-collapse': 1, duration: 3.3, ease: 'sine.inOut', immediateRender: false }, .65)
  if (pieces.length) t.to(pieces, { color: '#f0d8af', duration: .9, stagger: .006, ease: 'sine.inOut' }, .65)
  // Capture measured glyph centers once, then animate without per-frame layout reads.
  const orbit = { progress: 0 }
  let origins: { node: Element; dx: number; dy: number; lag: number }[] = []
  t.set(pieces, { x: 0, y: 0, scale: 1, rotation: 0, autoAlpha: 1 }, 0)
  t.to(orbit, { progress: 1, duration: 3.6, ease: 'none', onStart: () => {
    if (!pieces.length) return
    const target = hole?.getBoundingClientRect()
    const cx = target ? target.left + target.width / 2 : window.innerWidth * .5
    const cy = target ? target.top + target.height / 2 : window.innerHeight * .43
    gsap.set(from, { '--capture-x': cx, '--capture-y': cy })
    origins = Array.from(pieces).map((node, index) => {
      const rect = node.getBoundingClientRect()
      const dx = rect.left + rect.width / 2 - cx, dy = rect.top + rect.height / 2 - cy
      const lag = Math.min(.18, Math.hypot(dx, dy) / Math.max(window.innerWidth, 1) * .3) + (index % 5) * .012
      return { node, dx, dy, lag }
    })
  }, onUpdate: () => {
    origins.forEach(({ node, dx, dy, lag }, i) => {
      const pose = inkCapture(dx, dy, (orbit.progress - lag) / (1 - lag), (i % 7) / 7)
      gsap.set(node, { x: pose.x - dx, y: pose.y - dy, rotation: pose.rotation, scale: pose.scale, autoAlpha: pose.opacity })
    })
  } }, .3)
  return t.to(from, { autoAlpha: 0, duration: .4 }, 4)
}

/** The return releases ink onto a settling sheet, rather than reversing the implosion. */
export const welcomeToPrelude: TransitionFactory = ({ from, to, reducedMotion }) => {
  const t = gsap.timeline({ paused: true })
  const pieces = to.querySelectorAll('[data-absorb]')
  const paper = to.querySelector('[data-prelude-paper]')
  const chrome = to.querySelectorAll('[data-prelude-chrome]')
  const hole = from.querySelector('[data-enter-grid-orb]')
  const welcomeCopy = [from.querySelector('[data-enter-grid-title]'), from.querySelector('[data-enter-grid-support]'), from.querySelector('[data-journey-prev]')].filter(Boolean)
  t.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: .1, immediateRender: false }, 0)
  if (reducedMotion) return t.to(from, { autoAlpha: 0, duration: .3 }, 0)
  if (welcomeCopy.length) t.to(welcomeCopy, { autoAlpha: 0, duration: .45 }, 0)
  if (hole) t.fromTo(hole, { scale: 1 }, { scale: .86, duration: 1.8, ease: 'sine.inOut', immediateRender: false }, 0)
  if (paper) t.fromTo(paper, { opacity: 0 }, { opacity: 1, duration: 1.7, ease: 'sine.inOut', immediateRender: false }, .25)
  t.fromTo(to, { '--paper-halo': 0 }, { '--paper-halo': 1, duration: 1.5, immediateRender: false }, .5)
  t.fromTo(to, { '--ink-collapse': 1 }, { '--ink-collapse': 0, duration: 2.3, ease: 'power2.out', immediateRender: false }, .3)
  // A new typesetting gesture: letters rise in a short wave rather than flying backward.
  t.fromTo(pieces, { x: 0, y: 22, scale: .9, rotation: -5, autoAlpha: 0 }, { x: 0, y: 0, scale: 1, rotation: 0, autoAlpha: 1, stagger: { amount: .5, from: 'center' }, duration: 1, ease: 'power3.out', immediateRender: false }, 1.1)
  if (pieces.length) t.set(pieces, { clearProps: 'color' }, 0)
  if (chrome.length) t.fromTo(chrome, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .6, stagger: .08, immediateRender: false }, 2)
  return t.to(from, { autoAlpha: 0, duration: .4 }, 2.5)
}
