import { describe, expect, it } from 'vitest'
import { layoutRect } from './layout'

function box(left: number, top: number, width: number, height: number, parent: HTMLElement | null = null) {
  return {
    offsetLeft: left, offsetTop: top, offsetWidth: width, offsetHeight: height,
    offsetParent: parent,
    getBoundingClientRect: () => ({ left: -240, top: 680, width: width * 1.4, height: height * 1.4 }),
  } as unknown as HTMLElement
}

describe('animation anchor layout bounds', () => {
  it('retains document coordinates while rendered bounds change during scroll and parallax', () => {
    const hero = box(40, 120, 1200, 800)
    const title = box(0, 180, 900, 480, hero)
    const line = box(0, 160, 400, 150, title)
    const expected = { left: 40, top: 460, width: 400, height: 150 }
    expect(layoutRect(line)).toEqual(expected)
    line.getBoundingClientRect = () => ({ left: 0, top: -600, width: 560, height: 210 }) as DOMRect
    expect(layoutRect(line)).toEqual(expected)
  })

  it('measures a fragment target independently of its animated scale', () => {
    const fragment = box(0, 960, 1200, 700)
    const word = box(100, 200, 800, 120, fragment)
    expect(layoutRect(word)).toEqual({ left: 100, top: 1160, width: 800, height: 120 })
  })
})
