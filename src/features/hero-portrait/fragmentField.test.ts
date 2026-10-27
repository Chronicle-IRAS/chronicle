import { describe, expect, it } from 'vitest'
import { createFragmentGeometry } from './fragmentField'

describe('portrait fragment mesh', () => {
  it('covers the image once without holes and keeps UVs inside the texture', () => {
    const geometry = createFragmentGeometry(12,8)
    const positions = geometry.getAttribute('position')
    const uv = geometry.getAttribute('uv')
    expect(positions.count).toBe(12*8*6)
    let area = 0
    for (let i=0;i<positions.count;i+=3) {
      const ax=positions.getX(i), ay=positions.getY(i)
      const bx=positions.getX(i+1), by=positions.getY(i+1)
      const cx=positions.getX(i+2), cy=positions.getY(i+2)
      const signedArea=((bx-ax)*(cy-ay)-(cx-ax)*(by-ay))/2
      expect(signedArea).toBeGreaterThan(0)
      area+=signedArea
    }
    expect(area).toBeCloseTo(4,5)
    for(let i=0;i<uv.count;i++) {
      expect(uv.getX(i)).toBeGreaterThanOrEqual(0)
      expect(uv.getX(i)).toBeLessThanOrEqual(1)
      expect(uv.getY(i)).toBeGreaterThanOrEqual(0)
      expect(uv.getY(i)).toBeLessThanOrEqual(1)
    }
    geometry.dispose()
  })
  it('keeps each fragment rigid by sharing its center and seeded motion attributes', () => {
    const a=createFragmentGeometry(7,5), b=createFragmentGeometry(7,5)
    for(const name of ['aCenter','aSeed']) {
      const attribute=a.getAttribute(name)
      expect([...attribute.array]).toEqual([...b.getAttribute(name).array])
      for(let i=0;i<attribute.count;i+=3) {
        for(let component=0;component<attribute.itemSize;component++) {
          expect(attribute.array[(i+1)*attribute.itemSize+component]).toBe(attribute.array[i*attribute.itemSize+component])
          expect(attribute.array[(i+2)*attribute.itemSize+component]).toBe(attribute.array[i*attribute.itemSize+component])
        }
      }
    }
    const bary = a.getAttribute('aBarycentric')
    expect(bary.count).toBe(7 * 5 * 6)
    expect([bary.getX(0), bary.getY(0), bary.getZ(0)]).toEqual([1, 0, 0])
    expect([bary.getX(1), bary.getY(1), bary.getZ(1)]).toEqual([0, 1, 0])
    expect([bary.getX(2), bary.getY(2), bary.getZ(2)]).toEqual([0, 0, 1])
    a.dispose()
    b.dispose()
  })
})
