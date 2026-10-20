import { gsap } from '../../lib/gsap'
import type { TransitionFactory } from '../types'

/** The carrier follows the board; local actor motion supplies weight and personality. */
export const aiPush: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true, defaults: { ease: 'sine.inOut', immediateRender: false } })
  const board = from.querySelector('[data-composer-board]') ?? from
  const cast = from.querySelector('.character-cast')
  const composerStage = from.querySelector('[data-composer-stage]')
  const incomingStage = to.querySelector('[data-sculpture-stage]')
  if (composerStage) timeline.set(composerStage, { autoAlpha: 1 }, 0)
  if (incomingStage) timeline.set(incomingStage, { autoAlpha: 0 }, 0)
  timeline.set(from.querySelectorAll('[data-pose="pull"], [data-pose="hard"]'), { autoAlpha: 0 }, 0)
  timeline.set(from.querySelectorAll('[data-pose="push"]'), { autoAlpha: 1 }, 0)
  timeline.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.05)
  if (reducedMotion) {
    if (composerStage) timeline.to(composerStage, { autoAlpha: 0, duration: .25 }, .2)
    if (incomingStage) timeline.to(incomingStage, { autoAlpha: 1, duration: .25 }, .5)
    timeline.fromTo(board, { autoAlpha: 1, xPercent: 0 }, { autoAlpha: 0, duration: 0.5 }, 0.2)
    timeline.fromTo(from, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.2 }, 0.7)
    return timeline
  }
  if (cast) timeline.fromTo(cast, { autoAlpha: 0, xPercent: 0 }, { autoAlpha: 1, duration: 0.16 }, 0)
  const actors = ['deepseek', 'grok', 'gemini', 'claude', 'gpt'] as const
  actors.forEach((id, index) => {
    const actor = from.querySelector(`[data-cast="${id}"]`)
    if (!actor) return
    const helper = index > 1
    timeline.fromTo(actor, { x: -45 - index * 12, y: 12, rotation: -8, scaleX: 1, scaleY: 1 }, { x: 0, y: 0, rotation: 0, duration: 0.25 + index * 0.035, ease: 'power2.out' }, index * 0.025)
    if (!helper) {
      timeline.to(actor, { rotation: 7 - index * 2, scaleX: 0.96, scaleY: 1.04, duration: 0.16 }, 0.3)
      timeline.to(actor, { rotation: -3, scaleX: 1.03, scaleY: 0.97, duration: 0.14 }, 0.46)
      timeline.to(actor, { rotation: 4, scaleX: 1, scaleY: 1, y: -5, duration: 0.085, repeat: 5, yoyo: true }, 0.62)
    } else if (id === 'gemini') {
      timeline.to(actor, { y: -65, rotation: -12, duration: 0.2, ease: 'power2.out' }, 0.35)
      timeline.to(actor, { y: 0, rotation: 7, duration: 0.18, ease: 'power2.in' }, 0.55)
      timeline.to(actor, { y: -32, rotation: -5, duration: 0.15, repeat: 1, yoyo: true }, 0.76)
    } else {
      timeline.to(actor, { y: id === 'claude' ? -4 : -10, rotation: id === 'claude' ? 2 : -3, duration: 0.14 + index * 0.02, repeat: 3, yoyo: true }, 0.32)
    }
  })
  const hard = from.querySelector('[data-cast="deepseek"] [data-pose="hard"]')
  const push = from.querySelector('[data-cast="deepseek"] [data-pose="push"]')
  if (hard) timeline.to(hard, { autoAlpha: 1, duration: 0.08 }, 0.46)
  if (push) timeline.to(push, { autoAlpha: 0, duration: 0.08 }, 0.46)
  const carriers = cast ? [board, cast] : [board]
  // First overcome friction, rock back a little, then gain momentum together.
  timeline.fromTo(carriers, { xPercent: 0 }, { xPercent: 12, duration: 0.22, ease: 'power2.out' }, 0.3)
  timeline.to(carriers, { xPercent: 10, duration: 0.12 }, 0.52)
  timeline.to(carriers, { xPercent: 105, duration: 0.65, ease: 'power2.inOut' }, 0.64)
  timeline.fromTo(board, { autoAlpha: 1, scale: 1 }, { scale: 0.985, duration: 0.25 }, 0.3)
  timeline.to(board, { scale: 1, duration: 0.3 }, 0.99)
  // Keep the live lattice attached to the board until it is off screen, then
  // fade the incoming sculpture in after the shared canvas changes host.
  if (composerStage) timeline.to(composerStage, { autoAlpha: 0, duration: .13 }, .99)
  if (incomingStage) timeline.to(incomingStage, { autoAlpha: 1, duration: .27 }, 1.12)
  const wake = from.querySelector('[data-cast-wake]')
  if (wake) {
    timeline.fromTo(wake, { autoAlpha: 0, scaleX: 0.3 }, { autoAlpha: 0.7, scaleX: 1, duration: 0.22 }, 0.65)
    timeline.to(wake, { autoAlpha: 0, duration: 0.3 }, 0.98)
  }
  timeline.fromTo(from, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.1 }, 1.29)
  return timeline
}

/** Pulling leads with a backward lean, then decelerates into a soft landing. */
export const aiPull: TransitionFactory = ({ from, to, reducedMotion }) => {
  const timeline = gsap.timeline({ paused: true, defaults: { immediateRender: false } })
  const board = to.querySelector('[data-composer-board]') ?? to
  const cast = to.querySelector('.character-cast')
  const outgoingStage = from.querySelector('[data-sculpture-stage]')
  const composerStage = to.querySelector('[data-composer-stage]')
  if (outgoingStage) timeline.fromTo(outgoingStage, { autoAlpha: 1 }, { autoAlpha: 0, duration: .12 }, 0)
  if (composerStage) timeline.fromTo(composerStage, { autoAlpha: 0 }, { autoAlpha: 1, duration: .2 }, .12)
  timeline.fromTo(to, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, 0)
  timeline.fromTo(board, { xPercent: reducedMotion ? 0 : 105, autoAlpha: reducedMotion ? 0 : 1 }, { xPercent: 0, autoAlpha: 1, duration: 0.95, ease: 'power2.inOut' }, 0.12)
  if (cast && !reducedMotion) {
    timeline.set(to.querySelectorAll('[data-pose="push"], [data-pose="hard"]'), { autoAlpha: 0 }, 0)
    timeline.set(to.querySelectorAll('[data-pose="pull"]'), { autoAlpha: 1 }, 0)
    timeline.fromTo(cast, { xPercent: 105, autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12 }, 0)
    timeline.to(cast, { xPercent: 0, duration: 0.95, ease: 'power2.inOut' }, 0.12)
    for (const [id, lift, tilt, phase] of [['deepseek', -7, -9, 0.08], ['grok', -5, -6, 0.11], ['gemini', -36, 8, 0.15], ['claude', -3, 2, 0.2], ['gpt', -9, -3, 0.12]] as const) {
      const actor = to.querySelector(`[data-cast="${id}"]`)
      if (!actor) continue
      timeline.fromTo(actor, { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1 }, { y: lift, rotation: tilt, duration: 0.14, repeat: 5, yoyo: true, ease: 'sine.inOut' }, phase)
      timeline.to(actor, { y: 0, rotation: 0, duration: 0.18, ease: 'back.out(1.4)' }, 1.04)
    }
    timeline.to(cast, { autoAlpha: 0, duration: 0.18 }, 1.08)
  }
  timeline.fromTo(from, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.25 }, 0.82)
  return timeline
}
