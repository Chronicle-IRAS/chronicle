import { describe, expect, it } from 'vitest'
import { sampleImpulse, textImpulse } from './trajectory'
import { createStarField } from '../space/field'

describe('Reversible impact sampling', () => {
  it('restores the original pose after a forward and backward sweep', () => {
    const impulse = textImpulse(3)
    const original = sampleImpulse(impulse, 0)
    const middle = sampleImpulse(impulse, 0.5)
    sampleImpulse(impulse, 1)
    expect(sampleImpulse(impulse, 0.5)).toEqual(middle)
    expect(sampleImpulse(impulse, 0)).toEqual(original)
    expect(original).toEqual({ x: 0, y: 0, rotation: 0 })
  })
  it('clamps rapid scroll overshoot and falls under gravity', () => {
    const impulse = textImpulse(0)
    expect(sampleImpulse(impulse, -1)).toEqual(sampleImpulse(impulse, 0))
    expect(sampleImpulse(impulse, 2)).toEqual(sampleImpulse(impulse, 1))
    expect(sampleImpulse(impulse, 1).y).toBeGreaterThan(0)
  })
})

describe('Continuous space data', () => {
  it('reproduces the same finite point cloud for reverse navigation', () => {
    const stars = createStarField(2400)
    expect(stars).toEqual(createStarField(2400))
    expect(stars.length).toBe(12000)
    expect([...stars].every(Number.isFinite)).toBe(true)
    for (let i = 0; i < 2400; i++) expect(stars[i * 5 + 2]).toBeGreaterThanOrEqual(0)
  })
})
