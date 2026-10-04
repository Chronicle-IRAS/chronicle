import { gsap } from '../../lib/gsap'
import { lockJourneyInput } from '../../lib/lockJourneyInput'

export function restartJourney(reducedMotion: boolean, button?: HTMLButtonElement): void {
  if (document.querySelector('[data-restarting]')) return
  const root = document.querySelector<HTMLElement>('#journey')
  const releaseInput = root ? lockJourneyInput(root) : () => {}
  const veil = document.createElement('div')
  veil.className = 'restart-veil'
  veil.dataset.restarting = 'true'
  veil.setAttribute('aria-hidden', 'true')
  document.body.append(veil)
  if (button) button.disabled = true
  const timeline = gsap.timeline({ onComplete: () => {
    veil.remove()
    releaseInput()
    if (button) button.disabled = false
    const title = document.querySelector<HTMLElement>('.prelude-copy h1')
    title?.setAttribute('tabindex', '-1')
    title?.focus({ preventScroll: true })
  } })
  if (!reducedMotion) {
    const body = button?.closest('[data-scene-content]')?.querySelector('.scene-body')
    if (body) {
      const converge = gsap.to(body, { scale: 0.92, autoAlpha: 0, duration: 0.55 })
      timeline.add(converge, 0).call(() => { converge.revert() }, [], 0.65)
    }
  }
  timeline.fromTo(veil, { opacity: 0 }, { opacity: 1, duration: reducedMotion ? 0.16 : 0.6 }, 0)
  timeline.call(() => {
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
    window.scrollTo(0, 0)
  })
  timeline.to(veil, { opacity: 0, duration: reducedMotion ? 0.16 : 0.85 }, '+=0.08')
}
