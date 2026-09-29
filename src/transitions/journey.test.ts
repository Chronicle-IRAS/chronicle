import { afterEach, describe, expect, it, vi } from 'vitest'
import { gsap } from '../lib/gsap'
import { aiPull, aiPush } from './ai-push'
import { dsImpact, profileReturn } from './ds-impact'
import { portalEnter } from './portal-enter'
import { portalExit } from './portal-exit'
import { spaceTransition } from './space-transition'
import { addSpaceMotion } from '../features/space/addSpaceMotion'

afterEach(() => { gsap.globalTimeline.clear(); vi.unstubAllGlobals() })

describe('Remaining scene boundaries', () => {
  it('returns the board with pulling poses and repeated exertion while staying at its edge', () => {
    const board = { autoAlpha: 1, xPercent: 105 }
    const cast = { autoAlpha: 0, xPercent: 105 }
    const push = { autoAlpha: 1 }
    const pull = { autoAlpha: 0 }
    const actor = { x: 0, y: 0, rotation: 0 }
    const to = {
      autoAlpha: 0,
      querySelector: (s: string) => s === '[data-composer-board]' ? board : s === '.character-cast' ? cast : s === '[data-cast="deepseek"]' ? actor : null,
      querySelectorAll: (s: string) => s.includes('hard') ? [push] : [pull],
    }
    const from = { autoAlpha: 1 }
    const timeline = aiPull({ from: from as unknown as HTMLElement, to: to as unknown as HTMLElement, reducedMotion: false })
    timeline.time(0.3)
    expect(push.autoAlpha).toBe(0)
    expect(pull.autoAlpha).toBe(1)
    expect(cast.xPercent).toBeCloseTo(board.xPercent)
    const y = actor.y
    timeline.time(0.35)
    expect(actor.y).not.toBe(y)
    expect(board.xPercent).toBeLessThan(105)
    expect(cast.xPercent).toBeCloseTo(board.xPercent)
    timeline.progress(1)
    expect(board.xPercent).toBe(0)
    expect(cast.autoAlpha).toBe(0)
    expect(actor.y).toBe(0)
    expect(to.autoAlpha).toBe(1)
    expect(from.autoAlpha).toBe(0)
  })

  it('returns from Profile with settled text and no replay of falling or impact poses', () => {
    const actor = { autoAlpha: 1 }
    const piece = { x: 100, y: 200, rotation: 20 }
    const copy = { autoAlpha: 0, y: 0 }
    const body = { autoAlpha: 0, x: 0 }
    const outgoing = { autoAlpha: 1, y: 0 }
    const from = { autoAlpha: 1, querySelector: () => outgoing }
    const to = {
      autoAlpha: 0, querySelector: () => body,
      querySelectorAll: (s: string) => s.includes('actor') ? [actor] : s.includes('piece') ? [piece] : [copy],
    }
    const timeline = profileReturn({ from: from as unknown as HTMLElement, to: to as unknown as HTMLElement, reducedMotion: false })
    timeline.time(0.4)
    expect(actor.autoAlpha).toBe(0)
    expect(piece.x).toBe(0)
    expect(piece.y).toBe(0)
    expect(copy.autoAlpha).toBeGreaterThan(0)
    timeline.progress(1)
    expect(to.autoAlpha).toBe(1)
    expect(from.autoAlpha).toBe(0)
    expect(copy.y).toBe(0)
    expect(outgoing.y).toBe(0)
  })

  it('holds the board for exertion, then keeps the ensemble at the moving board edge', () => {
    const board = { autoAlpha: 1, xPercent: 0 }
    const cast = { autoAlpha: 0, xPercent: 0 }
    const from = { autoAlpha: 1, querySelectorAll: () => [], querySelector: (selector: string) => selector === '[data-composer-board]' ? board : selector === '.character-cast' ? cast : null }
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
    timeline.progress(0.65)
    expect(from.autoAlpha).toBe(1)
    expect(board.xPercent).toBeGreaterThan(0)
    expect(cast.autoAlpha).toBe(1)
    expect(cast.xPercent).toBeCloseTo(board.xPercent)
    timeline.progress(0)
    expect(board.xPercent).toBe(0)
    expect(cast.xPercent).toBe(0)
    expect(cast.autoAlpha).toBe(0)
  })

  it('floats Profile copy upward while keeping the page body in place', () => {
    const body = { y: 0 }
    const copy = [{ y: 0, autoAlpha: 1 }, { y: 0, autoAlpha: 1 }]
    const from = { autoAlpha: 1, querySelector: () => null, querySelectorAll: () => [] }
    const to = { autoAlpha: 0, querySelector: () => body, querySelectorAll: () => copy }
    const timeline = dsImpact({ from: from as unknown as HTMLElement, to: to as unknown as HTMLElement, reducedMotion: false })
    timeline.time(1.3)
    expect(to.autoAlpha).toBeGreaterThan(0)
    expect(body.y).toBe(0)
    expect(copy[1].y).toBeGreaterThan(0)
    const floatingY = copy[1].y
    timeline.time(1.6)
    expect(copy[1].y).toBeLessThan(floatingY)
    timeline.progress(1)
    expect(copy[1].y).toBe(0)
    expect(body.y).toBe(0)
  })

  it('fades the chapter background without dragging it through light grey', () => {
    const from = { autoAlpha: 1, backgroundColor: 'rgb(22, 32, 40)', querySelector: () => null, querySelectorAll: () => [] }
    const to = { autoAlpha: 0, querySelector: () => null, querySelectorAll: () => [] }
    const timeline = dsImpact({ from: from as unknown as HTMLElement, to: to as unknown as HTMLElement, reducedMotion: false })
    // GSAP parses 'transparent' as rgba(255, 255, 255, 0), so tweening the chapter to it
    // washed the screen light grey mid-fade. Only alpha may move.
    for (const progress of [0.62, 0.66, 0.7, 0.74]) {
      timeline.progress(progress)
      const [r, g, b] = from.backgroundColor.match(/[\d.]+/g)!.map(Number)
      expect(r).toBeLessThanOrEqual(22)
      expect(g).toBeLessThanOrEqual(32)
      expect(b).toBeLessThanOrEqual(40)
    }
    timeline.progress(1)
    expect(from.backgroundColor).toContain('0)')
  })

  it('warps forward through open space and decelerates on arrival without lateral slides', () => {
    const outgoing = { xPercent: 0, scale: 1, z: 0, rotationY: 0, transformPerspective: 1200 }
    const incoming = { xPercent: 0, scale: 1, z: 0, rotationY: 0, transformPerspective: 1200 }
    const from = { autoAlpha: 1, querySelector: () => outgoing }
    const to = { autoAlpha: 0, querySelector: () => incoming }
    const camera = { visible: 1, depth: 700, turn: 0, pan: 0, warp: 0 }
    const timeline = spaceTransition({ from: from as unknown as HTMLElement, to: to as unknown as HTMLElement, reducedMotion: false })
    addSpaceMotion(timeline, 'space', {} as HTMLElement, camera, false)
    timeline.progress(0.5)
    expect(camera.depth).toBeGreaterThan(700)
    expect(camera.warp).toBe(1)
    expect(camera.pan).toBe(0)
    expect(outgoing.scale).toBe(2.8)
    expect(outgoing.xPercent).toBe(0)
    expect(incoming.xPercent).toBe(0)
    timeline.progress(0.7)
    expect(incoming.z).toBeLessThan(0)
    expect(camera.warp).toBeLessThan(1)
    timeline.progress(1)
    expect(camera.depth).toBe(3900)
    expect(camera.warp).toBe(0)
    expect(incoming.z).toBe(0)
    expect(incoming.xPercent).toBe(0)
    timeline.progress(0)
    expect(camera.depth).toBe(700)
    expect(camera.pan).toBe(0)
    expect(camera.warp).toBe(0)
  })

  it('keeps DeepSeek visibly descending before the delayed impact', () => {
    vi.stubGlobal('window', { innerHeight: 800, innerWidth: 1280 })
    const impact = { autoAlpha: 0 }
    const actor = { autoAlpha: 0, y: 0, x: 0, rotation: 0, scaleX: 1, scaleY: 1, querySelector: (selector: string) => selector.includes('"impact"') ? impact : null }
    const from = { autoAlpha: 1, querySelector: (selector: string) => selector === '[data-impact-actor]' ? actor : null, querySelectorAll: () => [] }
    const to = { autoAlpha: 0, querySelectorAll: () => [] }
    const timeline = dsImpact({ from: from as unknown as HTMLElement, to: to as unknown as HTMLElement, reducedMotion: false })
    timeline.time(0.6)
    expect(actor.autoAlpha).toBe(1)
    expect(actor.y).toBeLessThan(-200)
    expect(impact.autoAlpha).toBe(0)
    timeline.time(0.86)
    expect(actor.y).toBeGreaterThan(0)
    expect(actor.scaleY).toBeLessThan(1)
    expect(impact.autoAlpha).toBe(1)
    timeline.time(1.02)
    expect(actor.y).toBeLessThan(0)
    timeline.time(1.18)
    expect(actor.y).toBe(0)
    expect(actor.scaleY).toBe(1)
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
