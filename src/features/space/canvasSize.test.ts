import { expect, it, vi } from 'vitest'
import { resizeDrawingBuffer } from './canvasSize'

it('does not clear a correctly sized framebuffer', () => {
  const width = vi.fn(), height = vi.fn()
  const canvas = { get width() { return 429 }, set width(value: number) { width(value) },
    get height() { return 429 }, set height(value: number) { height(value) } }
  resizeDrawingBuffer(canvas as HTMLCanvasElement, 429.2, 428.9)
  expect(width).not.toHaveBeenCalled()
  expect(height).not.toHaveBeenCalled()
})

it('changes only the dimension that actually changed', () => {
  const width = vi.fn(), height = vi.fn()
  const canvas = { get width() { return 390 }, set width(value: number) { width(value) },
    get height() { return 844 }, set height(value: number) { height(value) } }
  resizeDrawingBuffer(canvas as HTMLCanvasElement, 390, 780)
  expect(width).not.toHaveBeenCalled()
  expect(height).toHaveBeenCalledExactlyOnceWith(780)
})
