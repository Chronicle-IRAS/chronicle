import { afterEach, describe, expect, it } from 'vitest'
import { gsap } from '../../lib/gsap'
import { welcomeToComposer } from './index'

function fixture() {
  const title = { autoAlpha: 1, scale: 1 }
  const orb = { scale: 1 }
  const backdrop = { autoAlpha: 1 }
  const support = { autoAlpha: 1 }
  const canvas = { autoAlpha: 1, clipPath: 'circle(150% at 50% 44%)' }
  const heading = { autoAlpha: 1 }
  const targets: Record<string, object> = { '[data-enter-grid-title]': title, '[data-enter-grid-orb]': orb, '[data-enter-grid-backdrop]': backdrop, '[data-enter-grid-support]': support, '[data-enter-grid-canvas]': canvas, '[data-enter-grid-heading]': heading }
  const root = { querySelector: (selector: string) => targets[selector] ?? null } as unknown as HTMLElement
  return { root, title, orb, backdrop, support, canvas, heading }
}
afterEach(() => gsap.globalTimeline.clear())
describe('Eclipse iris transition', () => {
  it('passes through the sphere without scaling text and restores the start on return', () => {
    const f = fixture()
    const timeline = welcomeToComposer({ from: f.root, to: f.root, reducedMotion: false })
    timeline.progress(0.5)
    expect(f.title.scale).toBe(1)
    expect(f.title.autoAlpha).toBe(0)
    expect(f.orb.scale).toBeGreaterThan(1)
    expect(f.canvas.autoAlpha).toBeGreaterThan(0)
    expect(f.backdrop.autoAlpha).toBeGreaterThan(0)
    timeline.progress(1)
    expect(f.backdrop.autoAlpha).toBe(0)
    expect(f.canvas.autoAlpha).toBe(1)
    expect(f.canvas.clipPath).toBe('circle(150% at 50% 44%)')
    expect(f.heading.autoAlpha).toBe(1)
    timeline.progress(0)
    expect(f.title.autoAlpha).toBe(1)
    expect(f.orb.scale).toBe(1)
    expect(f.backdrop.autoAlpha).toBe(1)
    expect(f.support.autoAlpha).toBe(1)
  })
  it('uses an open iris and static sphere for reduced motion', () => {
    const f = fixture()
    const timeline = welcomeToComposer({ from: f.root, to: f.root, reducedMotion: true })
    timeline.progress(0.5)
    expect(f.orb.scale).toBe(1)
    expect(f.title.scale).toBe(1)
    expect(f.canvas.clipPath).toBe('circle(150% at 50% 44%)')
    timeline.progress(1)
    expect(f.canvas.autoAlpha).toBe(1)
    expect(f.backdrop.autoAlpha).toBe(0)
  })
})
