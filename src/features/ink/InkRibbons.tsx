import { useEffect, useRef } from 'react'
import { layoutWithLines, prepareWithSegments } from '@chenglou/pretext'
import { gsap } from '../../lib/gsap'

const WORDS = 'CURIOSITY / A SMALL IDEA / SOMETHING UNEXPECTED / FOLLOW THE THREAD / BEGIN AGAIN / '
/** Shared ink language, measured only on resize, animated outside React. */
export function InkRibbons({ active, reduced = false }: { active: boolean; reduced?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let w = 0, h = 0, phase = 0, last = 0
    let letters: { c: string; x: number; row: number }[] = []
    const pointer = { x: .5, y: .5 }
    const root = canvas.closest<HTMLElement>('[data-ink-surface]')
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const collapse = root ? Number(gsap.getProperty(root, '--ink-collapse')) || 0 : 0
      const angle = collapse * collapse * Math.PI * 3
      const shrink = Math.pow(1 - collapse, 1.8)
      for (const p of letters) {
        const wave = Math.sin(p.x / Math.max(w, 1) * 5 + phase * .28 + p.row * .16)
        const x = p.x + Math.sin(phase * .2 + p.row * .1) * 20
        const y = h * .5 + (p.row - 6.5) * (w < 600 ? 23 : 28) + wave * h * .15
        const dx = x - w * .5, dy = y - h * .5
        const repel = reduced ? 0 : Math.max(0, 1 - Math.hypot(x - pointer.x * w, y - pointer.y * h) / 180)
        ctx.fillStyle = p.row % 3 === 0 ? '#a34f36' : '#52614a'
        ctx.globalAlpha = (.16 + Math.abs(p.row - 6.5) * .045) * (1 - collapse)
        ctx.fillText(p.c, w * .5 + (dx * Math.cos(angle) - dy * Math.sin(angle)) * shrink, h * .44 + (dx * Math.sin(angle) + dy * Math.cos(angle)) * shrink + repel * 32)
      }
      ctx.globalAlpha = 1
    }
    const resize = () => {
      const rect = canvas.getBoundingClientRect(); w = rect.width; h = rect.height
      const dpr = Math.min(devicePixelRatio || 1, 2)
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const size = w < 600 ? 11 : 13
      const font = `${size}px monospace`
      const result = layoutWithLines(prepareWithSegments(WORDS.repeat(32), font), w * 1.4, size * 2)
      letters = result.lines.slice(0, 14).flatMap((line, row) => Array.from(line.text).map((c, i) => ({ c, x: i * line.width / line.text.length - w * .2, row })))
      ctx.font = font; draw()
    }
    const tick = (now: number) => { if ((!active && root?.closest('[data-scene-id]')?.getAttribute('data-transitioning') !== 'true') || document.hidden || now - last < 1 / 30) return; last = now; if (!reduced) phase += 1 / 30; draw() }
    const move = (event: PointerEvent) => { const rect = canvas.getBoundingClientRect(); pointer.x = (event.clientX - rect.left) / w; pointer.y = (event.clientY - rect.top) / h }
    const observer = new ResizeObserver(resize); observer.observe(canvas)
    canvas.addEventListener('pointermove', move)
    gsap.ticker.add(tick)
    return () => { observer.disconnect(); gsap.ticker.remove(tick); canvas.removeEventListener('pointermove', move) }
  }, [active, reduced])
  return <canvas className="ink-ribbons" ref={ref} aria-hidden="true" />
}
