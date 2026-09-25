import { gsap } from '../../lib/gsap'

export function restartJourney(reducedMotion: boolean): void {
  if (reducedMotion) {
    window.scrollTo(0, 0)
    return
  }
  gsap.to(window, { scrollTo: 0, duration: 1.2, ease: 'power2.inOut' })
}
