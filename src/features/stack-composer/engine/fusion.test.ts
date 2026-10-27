import { describe, expect, it } from 'vitest'
import {
  arrangeBalls,
  computeEjectLanding,
  computeFusionPoint,
  ejectRandomTech,
  nearestFusionTarget,
} from './fusion'

describe('fusion targeting', () => {
  it('chooses only the nearest reachable other ball', () => {
    const points = [{ x: 0, y: 0 }, { x: 70, y: 0 }, { x: 30, y: 0 }]
    expect(nearestFusionTarget(points, 0, 50)).toBe(2)
    expect(nearestFusionTarget(points, 0, 50, [2])).toBe(1)
    expect(nearestFusionTarget(points, 0, 10)).toBe(-1)
  })
  it.each([320, 390, 560, 1000])('keeps eight balls separated and inside a %ipx field', width => {
    const points = arrangeBalls(width, 560)
    expect(points).toHaveLength(8)
    for (let i = 0; i < points.length; i++) {
      expect(points[i].x).toBeGreaterThan(45)
      expect(points[i].x).toBeLessThan(width - 45)
      expect(points[i].y).toBeGreaterThan(45)
      expect(points[i].y).toBeLessThan(515)
      expect(nearestFusionTarget(points, i, 45)).toBe(-1)
    }
  })
  it('computes dynamic fusion points near the collision site instead of the field center', () => {
    const fused = computeFusionPoint({ x: 180, y: 140 }, { x: 220, y: 160 }, 900, 560, 52)
    expect(fused.x).toBeCloseTo(204.8, 1)
    expect(fused.y).toBeCloseTo(152.4, 1)
    expect(fused.x).not.toBe(450)
  })
  it('randomly ejects one constituent tech and keeps the remaining stack', () => {
    expect(ejectRandomTech(['cpp'], 0.2)).toBeNull()
    const splitTwo = ejectRandomTech(['cpp', 'qt'], 0.75)
    expect(splitTwo).toEqual({ ejected: 'qt', remaining: ['cpp'] })
    const splitThree = ejectRandomTech(['cpp', 'qt', 'vue'], 0.4)
    expect(splitThree).toEqual({ ejected: 'qt', remaining: ['cpp', 'vue'] })
  })
  it('throws ejected balls to a bounded non-overlapping position', () => {
    const origin = { x: 300, y: 260 }
    const landing = computeEjectLanding(origin, [origin], 900, 560, 52, 0.5)
    expect(landing.x).toBeGreaterThanOrEqual(62)
    expect(landing.x).toBeLessThanOrEqual(900 - 62)
    expect(landing.y).toBeGreaterThanOrEqual(62)
    expect(landing.y).toBeLessThanOrEqual(560 - 62)
    expect(Math.hypot(landing.x - origin.x, landing.y - origin.y)).toBeGreaterThan(80)
  })
})
