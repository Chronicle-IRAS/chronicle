/** Rasterize a small palette once, then reuse glyph images during every animation frame. */
export function createInkAtlas(characters: string, size: number, dpr: number) {
  const chars = Array.from(new Set(characters)).filter(c => c !== ' ')
  const canvas = document.createElement('canvas')
  const cellWidth = Math.ceil((size + 6) * dpr), cellHeight = Math.ceil((size * 1.7 + 6) * dpr)
  canvas.width = cellWidth * chars.length
  canvas.height = cellHeight * 16
  const ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)
  ctx.font = `${size}px monospace`
  for (let palette = 0; palette < 16; palette++) {
    const base = palette < 8 ? [45, 36, 32] : [244, 12, 63]
    const heat = (palette % 8) / 7
    ctx.fillStyle = `rgb(${Math.round(base[0] + (235 - base[0]) * heat)},${Math.round(base[1] + (196 - base[1]) * heat)},${Math.round(base[2] + (143 - base[2]) * heat)})`
    chars.forEach((char, i) => ctx.fillText(char, i * cellWidth / dpr + 3, palette * cellHeight / dpr + size + 3))
  }
  return { canvas, chars, cellWidth, cellHeight, width: cellWidth / dpr, height: cellHeight / dpr, baseline: size + 3 }
}
