import { describe, expect, it } from 'vitest'
import { backdropTransforms } from './backdropMotion'

describe('background compositor motion', () => {
  it('retains desktop scroll and pointer parallax without animated CSS variables', () => {
    const pose = backdropTransforms(0.5, 1, 1, -1, 1000, 800)
    expect(pose.orb).toBe('translate3d(98.00px, -28.00px, 0) scale(0.9800)')
    expect(pose.glow).toBe('translate3d(80.00px, 0, 0)')
    expect(pose.orbit).toBe('rotate(70.00deg)')
    expect(pose.near).toBe('translateY(-30.00px)')
    expect(pose.far).toBe('translateY(-70.00px)')
  })

  it('keeps the mobile orb centered at its existing CSS position', () => {
    const pose = backdropTransforms(0, 1, 0, 0, 390, 844)
    expect(pose.orb).toBe('translate3d(0.00px, 0.00px, 0) scale(0.9400)')
    expect(pose.glow).toBe('translate3d(0.00px, 0, 0)')
  })

  it('bounds motion during scroll overshoot and layout resynchronization', () => {
    expect(backdropTransforms(-1, -1, 0, 0, 1280, 800)).toEqual(backdropTransforms(0, 0, 0, 0, 1280, 800))
    expect(backdropTransforms(2, 2, 0, 0, 1280, 800)).toEqual(backdropTransforms(1, 1, 0, 0, 1280, 800))
  })
})
