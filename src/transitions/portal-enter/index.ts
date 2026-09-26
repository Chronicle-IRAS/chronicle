import { gsap } from '../../lib/gsap'
import type { TransitionFactory } from '../types'

export const portalEnter: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true, defaults: { ease: 'none', immediateRender: false } })
  const sheet = from.querySelector('[data-page-sheet]')
  const mouth = from.querySelector('[data-portal-mouth]')
  const body = from.querySelector('.scene-body')
  if (!reducedMotion) {
    if (sheet) timeline.fromTo(sheet, { '--portal-radius': '0vmax' }, { '--portal-radius': '145vmax', duration: 0.8, ease: 'power2.in' }, 0.12)
    if (mouth) {
      timeline.fromTo(mouth, { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.17 }, 0.05)
      timeline.to(mouth, { scale: 24, rotation: 35, autoAlpha: 0, duration: 0.63, ease: 'power2.in' }, 0.22)
    }
    if (body) timeline.fromTo(body, { scale: 1, xPercent: 0, yPercent: 0, autoAlpha: 1 }, { scale: 0.75, xPercent: 12, yPercent: 8, autoAlpha: 0, duration: 0.55 }, 0.15)
  }
  timeline.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.27 }, 0.68)
  timeline.fromTo(from, { autoAlpha: 1 }, { autoAlpha: 0, duration: reducedMotion ? 0.3 : 0.1 }, reducedMotion ? 0.65 : 0.9)
  return timeline
}
