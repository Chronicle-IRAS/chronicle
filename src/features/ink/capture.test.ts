import { describe, expect, it } from 'vitest'
import { inkCapture } from './capture'

describe('ink capture trajectory', () => {
  it('holds each glyph in place before release and hides it before reaching the core', () => {
    for (const [x, y] of [[-400, -100], [340, 190], [0, 0], [16, -210]]) {
      const start = inkCapture(x, y, -.1)
      expect(start).toMatchObject({ x, y, scale: 1, rotation: 0, opacity: 1 })
      const captured = inkCapture(x, y, .94)
      expect(captured.opacity).toBe(0)
      expect(Math.hypot(captured.x, captured.y)).toBeLessThanOrEqual(Math.hypot(x, y) * .15)
      const end = inkCapture(x, y, 1.2)
      expect(Math.hypot(end.x, end.y)).toBe(0)
      expect(end.opacity).toBe(0)
    }
  })
  it('has no position jumps at lift and capture boundaries, on either side of the center', () => {
    for (const dx of [-400, 400]) {
      for (const p of [.12, .38, .7, .94, 1]) {
        const before = inkCapture(dx, 120, p - .0001, .5)
        const after = inkCapture(dx, 120, p + .0001, .5)
        expect(Math.hypot(after.x - before.x, after.y - before.y)).toBeLessThan(1)
      }
    }
  })
})
