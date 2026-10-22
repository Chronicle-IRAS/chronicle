import { expect, it } from 'vitest'
import { isToolbarResize } from './viewport'

it('ignores the mobile browser toolbar opening and closing', () => {
  expect(isToolbarResize({ width: 390, height: 844 }, { width: 390, height: 780 }, true)).toBe(true)
  expect(isToolbarResize({ width: 390, height: 780 }, { width: 390, height: 844 }, true)).toBe(true)
})

it('refreshes for rotation, split screen, keyboard-sized changes and desktop resizing', () => {
  const initial = { width: 390, height: 844 }
  expect(isToolbarResize(initial, { width: 844, height: 390 }, true)).toBe(false)
  expect(isToolbarResize(initial, { width: 360, height: 844 }, true)).toBe(false)
  expect(isToolbarResize(initial, { width: 390, height: 420 }, true)).toBe(false)
  expect(isToolbarResize(initial, { width: 390, height: 780 }, false)).toBe(false)
  expect(isToolbarResize({ ...initial, layoutHeight: 1266 }, { width: 390, height: 780, layoutHeight: 1170 }, true)).toBe(false)
})
