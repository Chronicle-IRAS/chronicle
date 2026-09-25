import { afterEach, describe, expect, it } from 'vitest'
import { gsap } from '../../lib/gsap'
import { welcomeToComposer } from './index'

function fixture() {
  const copy = { autoAlpha: 1, yPercent: 0, scale: 1 }
  const far = { autoAlpha: 1, scale: 1 }
  const near = { autoAlpha: 0, scale: 1 }
  const vignette = { autoAlpha: 1 }
  const heading = { autoAlpha: 1, y: 0 }
  const canvas = { autoAlpha: 1, scale: 1 }
  const fromTargets: Record<string, object> = {
    '[data-enter-grid-copy]': copy,
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
  return { from: fromState as unknown as HTMLElement, to: toState as unknown as HTMLElement, fromState, toState, copy, far, near, heading, canvas }
}

afterEach(() => gsap.globalTimeline.clear())

describe('Enter the Grid timeline', () => {
  it('reverses back to the welcome state after reaching the composer', () => {
    const elements = fixture()
    const timeline = welcomeToComposer({ from: elements.from, to: elements.to, reducedMotion: false })

    timeline.progress(1)
    expect(elements.copy.autoAlpha).toBe(0)
    expect(elements.near.scale).toBe(1)
    expect(elements.toState.autoAlpha).toBe(1)
    expect(elements.heading.autoAlpha).toBe(1)
    expect(elements.canvas.autoAlpha).toBe(1)

    timeline.progress(0)
    expect(elements.copy.autoAlpha).toBe(1)
    expect(elements.fromState.autoAlpha).toBe(1)
    expect(elements.toState.autoAlpha).toBe(1)
    expect(elements.far.scale).toBe(1)
    expect(elements.near.autoAlpha).toBe(0)
  })

  it('uses fades without depth movement when motion is reduced', () => {
    const elements = fixture()
    const timeline = welcomeToComposer({ from: elements.from, to: elements.to, reducedMotion: true })

    timeline.progress(1)
    expect(elements.copy.scale).toBe(1)
    expect(elements.far.scale).toBe(1)
    expect(elements.near.scale).toBe(1)
    expect(elements.canvas.scale).toBe(1)
    expect(elements.heading.y).toBe(0)
    expect(elements.heading.autoAlpha).toBe(1)
  })
})
