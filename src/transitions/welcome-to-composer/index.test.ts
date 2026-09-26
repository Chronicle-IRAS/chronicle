import { afterEach, describe, expect, it } from 'vitest'
import { gsap } from '../../lib/gsap'
import { welcomeToComposer } from './index'

function fixture() {
  const support = { autoAlpha: 1, yPercent: 0 }
  const title = { autoAlpha: 1, yPercent: 0, scale: 1 }
  const backdrop = { autoAlpha: 1 }
  const far = { autoAlpha: 1, scale: 1 }
  const near = { autoAlpha: 0, scale: 1 }
  const vignette = { autoAlpha: 1 }
  const heading = { autoAlpha: 1 }
  const canvas = { autoAlpha: 1, scale: 1, filter: 'none' }
  const fromTargets: Record<string, object> = {
    '[data-enter-grid-support]': support,
    '[data-enter-grid-title]': title,
    '[data-enter-grid-backdrop]': backdrop,
    '[data-enter-grid-far]': far,
    '[data-enter-grid-near]': near,
    '[data-enter-grid-vignette]': vignette,
  }
  const toTargets: Record<string, object> = {
    '[data-enter-grid-heading]': heading,
    '[data-enter-grid-canvas]': canvas,
  }
  const fromState = {
    autoAlpha: 1,
    querySelector: (selector: string) => fromTargets[selector] ?? null,
  }
  const toState = {
    autoAlpha: 1,
    querySelector: (selector: string) => toTargets[selector] ?? null,
  }
  return { from: fromState as unknown as HTMLElement, to: toState as unknown as HTMLElement, fromState, toState, support, title, backdrop, far, near, heading, canvas }
}

afterEach(() => gsap.globalTimeline.clear())

describe('Enter the Grid timeline', () => {
  it('pushes the title through while the canvas appears, then reverses to Welcome', () => {
    const elements = fixture()
    const timeline = welcomeToComposer({ from: elements.from, to: elements.to, reducedMotion: false })

    timeline.progress(0.28)
    expect(elements.support.autoAlpha).toBe(0)
    expect(elements.title.autoAlpha).toBe(1)
    expect(elements.title.scale).toBeGreaterThan(1)

    timeline.progress(0.8)
    expect(elements.title.scale).toBeGreaterThan(5)
    expect(elements.title.autoAlpha).toBe(1)
    expect(elements.canvas.autoAlpha).toBeGreaterThan(0)
    expect(elements.backdrop.autoAlpha).toBeLessThan(1)

    timeline.progress(1)
    expect(elements.title.autoAlpha).toBe(0)
    expect(elements.backdrop.autoAlpha).toBe(0)
    expect(elements.near.scale).toBe(1)
    expect(elements.toState.autoAlpha).toBe(1)
    expect(elements.heading.autoAlpha).toBe(1)
    expect(elements.canvas.autoAlpha).toBe(1)
    expect(elements.canvas.scale).toBe(1)

    timeline.progress(0)
    expect(elements.support.autoAlpha).toBe(1)
    expect(elements.title.autoAlpha).toBe(1)
    expect(elements.title.scale).toBe(1)
    expect(elements.backdrop.autoAlpha).toBe(1)
    expect(elements.fromState.autoAlpha).toBe(1)
    expect(elements.toState.autoAlpha).toBe(1)
    expect(elements.far.scale).toBe(1)
    expect(elements.near.autoAlpha).toBe(0)
  })

  it('reveals the composer without a large title scale when motion is reduced', () => {
    const elements = fixture()
    const timeline = welcomeToComposer({ from: elements.from, to: elements.to, reducedMotion: true })

    timeline.progress(1)
    expect(elements.support.autoAlpha).toBe(0)
    expect(elements.title.scale).toBeCloseTo(1.08)
    expect(elements.title.autoAlpha).toBe(0)
    expect(elements.far.scale).toBe(1)
    expect(elements.near.scale).toBe(1)
    expect(elements.canvas.autoAlpha).toBe(1)
    expect(elements.canvas.scale).toBe(1)
    expect(elements.canvas.filter).toBe('none')
    expect(elements.heading.autoAlpha).toBe(1)
    expect(elements.backdrop.autoAlpha).toBe(0)
  })
})
