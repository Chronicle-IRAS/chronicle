import { afterEach, describe, expect, it } from 'vitest'
import { gsap } from '../lib/gsap'
import { aiPush } from './ai-push'
import { dsImpact } from './ds-impact'
import { portalEnter } from './portal-enter'
import { portalExit } from './portal-exit'
import { spaceTransition } from './space-transition'

afterEach(() => gsap.globalTimeline.clear())

describe('Remaining scene boundaries', () => {
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
