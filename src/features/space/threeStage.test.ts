import { beforeEach, expect, it, vi } from 'vitest'
import { WebGLRenderer } from 'three'
import { createThreeStage } from './threeStage'

vi.mock('three', () => ({
  WebGLRenderer: vi.fn(function () { throw new Error('GPU renderer unavailable') }),
}))

beforeEach(() => vi.clearAllMocks())

it('keeps the native effects available on a WebGL 1 context without constructing Three', () => {
  const gl = {} as WebGLRenderingContext
  expect(createThreeStage(gl, {} as HTMLCanvasElement)).toBeNull()
  expect(WebGLRenderer).not.toHaveBeenCalled()
})

it('lets the website use its fallback if the WebGL 2 renderer cannot initialize', () => {
  const gl = { texImage3D: vi.fn() } as unknown as WebGL2RenderingContext
  expect(createThreeStage(gl, {} as HTMLCanvasElement)).toBeNull()
  expect(WebGLRenderer).toHaveBeenCalledOnce()
})
