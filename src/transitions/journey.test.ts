import { afterEach, describe, expect, it } from 'vitest'
import { gsap } from '../lib/gsap'
import { aiPush } from './ai-push'
import { dsImpact } from './ds-impact'
import { portalEnter } from './portal-enter'
import { portalExit } from './portal-exit'
import { spaceTransition } from './space-transition'

afterEach(() => gsap.globalTimeline.clear())

describe('Remaining scene boundaries', () => {
  it('holds the board for exertion, then keeps the ensemble at the moving board edge', () => {
    const board = { autoAlpha: 1, xPercent: 0 }
    const cast = { autoAlpha: 0, xPercent: 0 }
    const from = { autoAlpha: 1, querySelector: (selector: string) => selector === '[data-composer-board]' ? board : selector === '.character-cast' ? cast : null }
    const to = { autoAlpha: 0 }
    const timeline = aiPush({ from: from as unknown as HTMLElement, to: to as unknown as HTMLElement, reducedMotion: false })
    timeline.progress(0.2)
    expect(board.xPercent).toBe(0)
    expect(cast.autoAlpha).toBe(1)
    timeline.progress(0.6)
    expect(board.xPercent).toBeGreaterThan(0)
    expect(cast.xPercent).toBeCloseTo(board.xPercent)
    timeline.progress(1)
    expect(board.xPercent).toBe(105)
    expect(from.autoAlpha).toBe(0)
    timeline.progress(0)
    expect(board.xPercent).toBe(0)
    expect(cast.xPercent).toBe(0)
    expect(cast.autoAlpha).toBe(0)
  })

  it('reveals Profile in place without a vertical slide', () => {
    const body = { y: 0 }
    const from = { autoAlpha: 1, querySelector: () => null, querySelectorAll: () => [] }
    const to = { autoAlpha: 0, querySelector: () => body }
    const timeline = dsImpact({ from: from as unknown as HTMLElement, to: to as unknown as HTMLElement, reducedMotion: false })
    timeline.progress(0.8)
    expect(to.autoAlpha).toBeGreaterThan(0)
    expect(body.y).toBe(0)
    timeline.progress(0.7)
    expect(body.y).toBe(0)
  })

  for (const factory of [aiPush, dsImpact, portalEnter, spaceTransition, portalExit]) {
    it(`${factory.name} hands off and reverses without moving reduced-motion content`, () => {
      const from = { autoAlpha: 1, xPercent: 0, querySelector: () => null, querySelectorAll: () => [] }
      const to = { autoAlpha: 0, querySelector: () => null, querySelectorAll: () => [] }
      const timeline = factory({ from: from as unknown as HTMLElement, to: to as unknown as HTMLElement, reducedMotion: true })
      timeline.progress(1)
      expect(from.autoAlpha).toBe(0)
      expect(to.autoAlpha).toBe(1)
      timeline.progress(0)
      expect(from.autoAlpha).toBe(1)
      expect(from.xPercent).toBe(0)
      expect(to.autoAlpha).toBe(0)
    })
  }
})
