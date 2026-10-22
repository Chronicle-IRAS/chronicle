import { afterEach, describe, expect, it, vi } from 'vitest'
import { gsap } from '../../lib/gsap'
import { composerToWelcome, welcomeToComposer } from './index'

function fixture() {
  const title = { autoAlpha: 1, scale: 1 }
  const orb = { scale: 1, rotation: 0, '--hole-spin': 0 }
  const loading = { autoAlpha: 0 }
  const backdrop = { autoAlpha: 1 }
  const support = { autoAlpha: 1 }
  const canvas = { autoAlpha: 1, clipPath: 'circle(150% at 50% 44%)' }
  const heading = { autoAlpha: 1 }
  const targets: Record<string, object> = { '[data-enter-grid-title]': title, '[data-enter-grid-orb]': orb, '[data-enter-grid-backdrop]': backdrop, '[data-enter-grid-support]': support, '[data-enter-grid-canvas]': canvas, '[data-enter-grid-heading]': heading }
  targets['[data-enter-grid-loading]'] = loading
  const root = { querySelector: (selector: string) => targets[selector] ?? null } as unknown as HTMLElement
  return { root, title, orb, loading, backdrop, support, canvas, heading }
}
afterEach(() => { gsap.globalTimeline.clear(); vi.unstubAllGlobals() })
describe('Eclipse iris transition', () => {
  it('keeps the mobile masked surface bounded while preserving the rotating zoom', () => {
    vi.stubGlobal('window', { matchMedia: () => ({ matches: true }) })
    const f = fixture()
    const timeline = welcomeToComposer({ from: f.root, to: f.root, reducedMotion: false })
    timeline.progress(1)
    expect(f.orb.scale).toBe(3)
    expect(f.orb.rotation).toBe(18)
    expect(f.canvas.autoAlpha).toBe(1)
  })
  for (const reducedMotion of [false, true]) {
    it(`returns through a faded stage handoff and settles Welcome (reduced motion: ${reducedMotion})`, () => {
      const f = fixture()
      const stage = { autoAlpha: 1 }
      const from = { autoAlpha: 1, querySelector: () => stage }
      const to = { autoAlpha: 0, querySelector: f.root.querySelector }
      const timeline = composerToWelcome({ from: from as unknown as HTMLElement, to: to as unknown as HTMLElement, reducedMotion })
      timeline.time(.1)
      expect(stage.autoAlpha).toBeGreaterThan(0)
      expect(to.autoAlpha).toBe(0)
      timeline.time(.2)
      expect(stage.autoAlpha).toBe(0)
      expect(to.autoAlpha).toBe(0)
      timeline.time(.5)
      expect(to.autoAlpha).toBeGreaterThan(0)
      expect(from.autoAlpha).toBeLessThan(1)
      expect(f.orb.scale).toBeLessThanOrEqual(1.65)
      if (reducedMotion) expect(f.orb.scale).toBe(1)
      timeline.progress(1)
      expect(from.autoAlpha).toBe(0)
      expect(to.autoAlpha).toBe(1)
      expect(f.orb.scale).toBe(1)
      expect(f.orb.rotation).toBe(0)
      expect(f.orb['--hole-spin']).toBe(0)
      expect(f.title.autoAlpha).toBe(1)
    })
  }
  it('passes through the sphere without scaling text and restores the start on return', () => {
    const f = fixture()
    const timeline = welcomeToComposer({ from: f.root, to: f.root, reducedMotion: false })
    timeline.progress(0.25)
    expect(f.orb.scale).toBe(1)
    expect(f.orb['--hole-spin']).toBeGreaterThan(0)
    timeline.progress(0.5)
    expect(f.title.scale).toBe(1)
    expect(f.title.autoAlpha).toBe(0)
    expect(f.orb.scale).toBeGreaterThan(1)
    expect(f.orb.rotation).toBeGreaterThan(0)
    expect(f.loading.autoAlpha).toBe(1)
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
    expect(f.orb.rotation).toBe(0)
    expect(f.loading.autoAlpha).toBe(0)
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
