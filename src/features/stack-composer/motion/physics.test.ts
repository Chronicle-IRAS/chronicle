import { expect, it } from 'vitest'
import { collide, stepDrift } from './physics'
import type { DriftBody } from './physics'

const bounds = { left: -2000, right: 2000, top: -2000, bottom: 2000 }
const body = (id: string, x: number, extra: Partial<DriftBody> = {}): DriftBody => ({
  id, x, y: 0, anchorX: x, anchorY: 0, vx: 0, vy: 0, rx: 105, ry: 62.5,
  phase: 1, time: 0, fixed: false, linked: false, ...extra,
})

it('separates oval nodes and transfers their approaching momentum', () => {
  const a = body('a', 0, { vx: 50 }), b = body('b', 190, { vx: -20 })
  collide(a, b)
  expect(b.x - a.x).toBeCloseTo(216)
  expect(a.vx).toBeLessThan(b.vx)
})

it('keeps a hovered node stationary while the other node bounces away', () => {
  const a = body('a', 0, { fixed: true }), b = body('b', 180, { vx: -60 })
  collide(a, b)
  expect(a.x).toBe(0)
  expect(a.vx).toBe(0)
  expect(b.x).toBeGreaterThanOrEqual(216)
  expect(b.vx).toBeGreaterThan(0)
})

it('sweeps fast drags through neighbours instead of teleporting past them', () => {
  const a = body('held', 0, { fixed: true }), b = body('b', 350)
  stepDrift([a, b], 1 / 60, bounds, { body: a, x: 700, y: 0 })
  expect(a.x).toBe(700)
  expect(b.x).toBeGreaterThan(700)
  expect(b.vx).toBeGreaterThan(0)
})

it('resolves coincident nodes without NaN and respects fixed boundaries', () => {
  const a = body('a', 0), b = body('b', 0)
  collide(a, b)
  expect(Number.isFinite(a.x + b.x + a.vx + b.vx)).toBe(true)
  expect(Math.abs(b.x - a.x)).toBeCloseTo(216)
  a.x = 10000
  stepDrift([a], 60, bounds)
  expect(a.x).toBeLessThanOrEqual(bounds.right - a.rx)
})

it('gives connected nodes a smaller idle range while free nodes travel visibly', () => {
  const free = body('free', 0), linked = body('linked', 0, { linked: true })
  let freeRange = 0, linkedRange = 0
  for (let frame = 0; frame < 1200; frame++) {
    stepDrift([free], 1 / 60, bounds)
    stepDrift([linked], 1 / 60, bounds)
    freeRange = Math.max(freeRange, Math.abs(free.x))
    linkedRange = Math.max(linkedRange, Math.abs(linked.x))
  }
  expect(freeRange).toBeGreaterThan(60)
  expect(linkedRange).toBeLessThan(20)
})
