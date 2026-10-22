/** Assigning even the same canvas size clears its framebuffer. Only resize at draw time. */
export function resizeDrawingBuffer(canvas: HTMLCanvasElement, width: number, height: number): void {
  const w = Math.max(1, Math.round(width))
  const h = Math.max(1, Math.round(height))
  if (canvas.width !== w) canvas.width = w
  if (canvas.height !== h) canvas.height = h
}
