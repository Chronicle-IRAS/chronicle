import { useEffect, useRef } from 'react'
import { layoutWithLines, prepareWithSegments } from '@chenglou/pretext'
import { gsap } from '../../lib/gsap'
import { inkCapture } from './capture'
import { createInkAtlas } from './glyphAtlas'

const WORDS = 'CURIOSITY / A SMALL IDEA / SOMETHING UNEXPECTED / FOLLOW THE THREAD / BEGIN AGAIN / '
/** Shared ink language, measured only on resize, animated outside React. */
export function InkRibbons({ active, reduced = false }: { active: boolean; reduced?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let w = 0, h = 0, phase = 0, last = 0, lastDraw = 0, dpr = 1
    let atlas: ReturnType<typeof createInkAtlas> | undefined
    let letters: { c: string; glyph: number; x: number; row: number }[] = []
    const pointer = { x: .5, y: .5 }
    const root = canvas.closest<HTMLElement>('[data-ink-surface]')
    const section = root?.closest('[data-scene-id]')
    const draw = () => {
      if (!atlas) return
      ctx.clearRect(0, 0, w, h)
      const collapse = root ? Number(gsap.getProperty(root, '--ink-collapse')) || 0 : 0
      const cx = root ? Number(gsap.getProperty(root, '--capture-x')) || w * .5 : w * .5
      const cy = root ? Number(gsap.getProperty(root, '--capture-y')) || h * .43 : h * .43
      const heat = Math.round(Math.min(1, collapse * 2) * 7)
      for (const p of letters) {
        const wave = Math.sin(p.x / Math.max(w, 1) * 5 + phase * .28 + p.row * .16)
        const x = p.x + Math.sin(phase * .2 + p.row * .1) * 20
        const y = h * .5 + (p.row - 6.5) * (w < 600 ? 23 : 28) + wave * h * .15
        const dx = x - cx, dy = y - cy
        const lag = (p.row / 14) * .13 + Math.min(1, Math.abs(dx) / Math.max(w, 1)) * .08
        const pull = Math.max(0, Math.min(1, (collapse - lag) / (1 - lag)))
        const repel = reduced ? 0 : Math.max(0, 1 - Math.hypot(x - pointer.x * w, y - pointer.y * h) / 180)
        const palette = heat + (p.row % 3 === 0 ? 8 : 0)
        const sx = p.glyph * atlas.cellWidth, sy = palette * atlas.cellHeight
        const strength = .16 + Math.abs(p.row - 6.5) * .045
        // The resting page needs neither capture trigonometry nor a transform per letter.
        if (!pull) {
          if (x < -atlas.width || x > w || y < -atlas.height || y > h) continue
          ctx.globalAlpha = strength
          ctx.drawImage(atlas.canvas, sx, sy, atlas.cellWidth, atlas.cellHeight, x - 3, y + repel * 32 - atlas.baseline, atlas.width, atlas.height)
          continue
        }
        const pose = inkCapture(dx, dy, pull, p.row / 14)
        if (pose.opacity < .005) continue
        ctx.globalAlpha = (.16 + Math.abs(p.row - 6.5) * .045) * pose.opacity
        // Short tangent trails connect the ink to the rotating disk without a second vortex.
        if (pull > .25 && pull < .9 && p.row % 3 === 0 && p.c === '/') {
          const tail = inkCapture(dx, dy, Math.max(0, pull - .035), p.row / 14)
          ctx.strokeStyle = '#ebc48f'
          ctx.lineWidth = .7
          ctx.beginPath(); ctx.moveTo(cx + tail.x, cy + tail.y); ctx.lineTo(cx + pose.x, cy + pose.y); ctx.stroke()
        }
        const angle = pose.rotation * Math.PI / 180, scale = Math.max(.2, pose.scale) * dpr
        const c = Math.cos(angle) * scale, s = Math.sin(angle) * scale
        ctx.setTransform(c, s, -s, c, (cx + pose.x) * dpr, (cy + pose.y + repel * 32 * (1 - pull)) * dpr)
        ctx.drawImage(atlas.canvas, sx, sy, atlas.cellWidth, atlas.cellHeight, -3, -atlas.baseline, atlas.width, atlas.height)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
      ctx.globalAlpha = 1
    }
    const resize = () => {
      const rect = canvas.getBoundingClientRect(); w = rect.width; h = rect.height
      dpr = Math.min(devicePixelRatio || 1, 1.5)
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const size = w < 600 ? 11 : 13
      const font = `${size}px monospace`
      atlas = createInkAtlas(WORDS, size, dpr)
      const result = layoutWithLines(prepareWithSegments(WORDS.repeat(32), font), w * 1.4, size * 2)
      const chars = atlas.chars
      letters = result.lines.slice(0, 14).flatMap((line, row) => Array.from(line.text).map((c, i) => ({ c, glyph: chars.indexOf(c), x: i * line.width / line.text.length - w * .2, row })).filter(p => p.glyph >= 0))
      ctx.font = font; draw()
    }
    const tick = (now: number) => {
      const transitioning = section?.getAttribute('data-transitioning') === 'true'
      if ((!active && !transitioning) || document.hidden || (reduced && !transitioning) || now - last < 1 / 30) return
      const delta = lastDraw ? Math.min(now - lastDraw, .05) : 1 / 30
      lastDraw = now
      last = now - (now - last) % (1 / 30)
      if (!reduced) phase += delta
      draw()
    }
    const move = (event: PointerEvent) => { const rect = canvas.getBoundingClientRect(); pointer.x = (event.clientX - rect.left) / w; pointer.y = (event.clientY - rect.top) / h }
    const observer = new ResizeObserver(resize); observer.observe(canvas)
    canvas.addEventListener('pointermove', move)
    gsap.ticker.add(tick)
    return () => { observer.disconnect(); gsap.ticker.remove(tick); canvas.removeEventListener('pointermove', move) }
  }, [active, reduced])
  return <canvas className="ink-ribbons" ref={ref} aria-hidden="true" />
}
