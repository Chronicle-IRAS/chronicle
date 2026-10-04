import { afterEach, describe, expect, it } from 'vitest'
import { gsap } from '../../lib/gsap'
import { preludeToWelcome, welcomeToPrelude } from './index'

const surface = (autoAlpha: number) => ({ autoAlpha, querySelector: () => null, querySelectorAll: () => [] })
afterEach(() => gsap.globalTimeline.clear())

describe('prologue boundary visibility', () => {
  for (const reducedMotion of [false, true]) {
    it(`supports repeated entry and a separate return (reduced=${reducedMotion})`, () => {
      const paper = surface(1), welcome = surface(0)
      const enter = preludeToWelcome({ from: paper as unknown as HTMLElement, to: welcome as unknown as HTMLElement, reducedMotion })
      const back = welcomeToPrelude({ from: welcome as unknown as HTMLElement, to: paper as unknown as HTMLElement, reducedMotion })
      for (let cycle = 0; cycle < 2; cycle++) {
        enter.progress(1)
        expect(paper.autoAlpha).toBe(0)
        expect(welcome.autoAlpha).toBe(1)
        back.progress(0).progress(1)
        expect(paper.autoAlpha).toBe(1)
        expect(welcome.autoAlpha).toBe(0)
        enter.progress(0)
        expect(paper.autoAlpha).toBe(1)
        expect(welcome.autoAlpha).toBe(0)
      }
    })
  }
})
