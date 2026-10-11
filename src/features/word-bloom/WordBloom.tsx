import { useEffect, useRef, useState } from 'react'
import { layoutWithLines, prepareWithSegments } from '@chenglou/pretext'
import { gsap } from '../../lib/gsap'
import { useSceneStore } from '../../stores/sceneStore'
import { FlowLetter } from '../goodbye-letter/FlowLetter'
import { siteContent } from '../../data/siteContent'

type Mode = 'bloom' | 'letter' | 'tunnel'
type Glyph = { char: string; x: number; y: number; vx: number; vy: number; homeX: number; homeY: number }
const MODES: { id: Mode; label: string }[] = [{ id: 'bloom', label: '01 / WORD BLOOM' }, { id: 'letter', label: '02 / LIVING LETTER' }, { id: 'tunnel', label: '03 / INFINITY' }]

/** Pretext owns the readable layout; a Canvas2D spring field animates its glyphs. */
export function WordBloom() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const impulse = useRef(0)
  const [mode, setMode] = useState<Mode>('bloom')
  const [reading, setReading] = useState(false)
  const [paused, setPaused] = useState(false)
  const [bursts, setBursts] = useState(0)
  const settings = useRef({ mode, paused, reading })
  useEffect(() => { settings.current = { mode, paused, reading } }, [mode, paused, reading])
  const closeRef = useRef<HTMLButtonElement>(null)
  const readRef = useRef<HTMLButtonElement>(null)
  const active = useSceneStore((state) => state.currentScene === 'goodbye')
  const reduced = useSceneStore((state) => state.reducedMotion)
  const burst = () => { impulse.current += 1; setBursts((n) => n + 1) }
  const wasReading = useRef(false)
  const close = () => setReading(false)
  useEffect(() => {
    if (reading) closeRef.current?.focus()
    else if (wasReading.current && active) readRef.current?.focus()
    wasReading.current = reading
  }, [reading, active])
  useEffect(() => { if (!active) setReading(false) }, [active])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    let width = 0, height = 0, size = 12, time = 0, previous = 0, seenImpulse = impulse.current
    let drawnMode: Mode | undefined
    let glyphs: Glyph[] = []
    const pointer = { x: 0, y: 0, inside: false, down: false }
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width; height = rect.height
      if (!width || !height) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const textTop = width >= 900 ? height * .34 : 0
      const maxWidth = width * .86
      size = width < 600 ? 17 : 24
      let layout = layoutWithLines(prepareWithSegments(siteContent.goodbye.letter, `${size}px monospace`), maxWidth, size * 1.65)
      while (layout.height > height - textTop - 40 && size > 11) {
        size--
        layout = layoutWithLines(prepareWithSegments(siteContent.goodbye.letter, `${size}px monospace`), maxWidth, size * 1.65)
      }
      const lineHeight = size * 1.65
      glyphs = []
      for (let row = 0; row < layout.lines.length && (row + 1) * lineHeight < height - 45 - textTop; row++) {
        const line = layout.lines[row]
        const chars = Array.from(line.text)
        // Monospace advances match the prepared line exactly, including spaces.
        const advance = line.width / Math.max(1, chars.length)
        chars.forEach((char, col) => {
          if (char === ' ') return
          const x = width * .07 + col * advance, y = textTop + 28 + row * lineHeight
          glyphs.push({ char, x, y, vx: 0, vy: 0, homeX: x, homeY: y })
        })
      }
      pointer.x = width / 2; pointer.y = height / 2
      draw(0)
    }
    const draw = (dt: number) => {
      ctx.clearRect(0, 0, width, height)
      const { mode } = settings.current
      const motion = !reduced && !settings.current.paused
      const explode = seenImpulse !== impulse.current
      seenImpulse = impulse.current
      const radius = Math.min(width * .38, height * .42)
      const step = Math.min(dt * 60, 2)
      ctx.font = `${mode === 'letter' ? size : Math.min(size, 14)}px monospace`
      ctx.textAlign = 'center'
      for (let i = 0; i < glyphs.length; i++) {
        const p = glyphs[i]
        const u = i / glyphs.length
        let tx = p.homeX, ty = p.homeY, depth = 0
        if (mode === 'bloom') {
          const a = u * Math.PI * 2 * 23 + time * .13
          const b = u * Math.PI * 2
          const r = radius * (.62 + .28 * Math.cos(a * 5 + b * 3 + time * .35))
          const z = Math.sin(a * 3 + b * 7) * radius * .36
          const x = Math.cos(a) * r, y = Math.sin(a) * r
          const tilt = .5 + Math.sin(time * .2) * .2
          depth = z / radius
          tx = width / 2 + x * (1 + depth * .16)
          ty = height / 2 + y * Math.cos(tilt) + z * Math.sin(tilt)
        } else if (mode === 'tunnel') {
          const z = ((u * 17 - time * .15) % 1 + 1) % 1
          const a = i * 2.39996 + time * .12
          const r = radius * .12 / (.12 + z)
          tx = width / 2 + Math.cos(a) * r * 2.4
          ty = height / 2 + Math.sin(a) * r * 1.7
          depth = 1 - z * 2
        }
        if (!motion) { p.x = tx; p.y = ty; p.vx = 0; p.vy = 0 }
        else {
          let ax = (tx - p.x) * .025, ay = (ty - p.y) * .025
          const dx = p.x - pointer.x, dy = p.y - pointer.y
          const distance = Math.hypot(dx, dy)
          if (pointer.inside && distance < 145) {
            const force = (1 - distance / 145) * (pointer.down ? -3.8 : 2.3)
            ax += dx / Math.max(distance, 1) * force
            ay += dy / Math.max(distance, 1) * force
          }
          if (explode) {
            const a = Math.atan2(p.y - height / 2, p.x - width / 2)
            p.vx += Math.cos(a) * 28; p.vy += Math.sin(a) * 28
          }
          p.vx = (p.vx + ax * step) * Math.pow(.88, step)
          p.vy = (p.vy + ay * step) * Math.pow(.88, step)
          p.x += p.vx * step; p.y += p.vy * step
        }
        ctx.fillStyle = mode === 'letter' ? '#344d40' : depth > .15 ? '#b64b2d' : depth < -.2 ? '#9a9677' : '#435b43'
        ctx.globalAlpha = mode === 'letter' ? .8 : .45 + (depth + 1) * .24
        ctx.fillText(p.char, p.x, p.y)
      }
      ctx.globalAlpha = 1
      if (pointer.inside && motion) {
        ctx.strokeStyle = '#a34f3655'; ctx.beginPath(); ctx.arc(pointer.x, pointer.y, pointer.down ? 32 : 65, 0, Math.PI * 2); ctx.stroke()
      }
    }
    const tick = (now: number) => {
      if (now - previous < 1 / 60) return
      const dt = previous ? Math.min(now - previous, .033) : .016
      previous = now
      if (document.hidden || settings.current.reading) return
      if ((settings.current.paused || reduced) && drawnMode === settings.current.mode) return
      drawnMode = settings.current.mode
      if (!reduced && !settings.current.paused) time += dt
      draw(dt)
    }
    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = event.clientX - rect.left; pointer.y = event.clientY - rect.top; pointer.inside = true
    }
    const down = (event: PointerEvent) => { move(event); pointer.down = true; canvas.setPointerCapture(event.pointerId) }
    const up = () => { pointer.down = false }
    const leave = () => { pointer.inside = false; pointer.down = false }
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerdown', down)
    canvas.addEventListener('pointerup', up)
    canvas.addEventListener('pointercancel', leave)
    canvas.addEventListener('pointerleave', leave)
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    if (active) gsap.ticker.add(tick)
    return () => {
      observer.disconnect(); gsap.ticker.remove(tick)
      canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerdown', down)
      canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', leave); canvas.removeEventListener('pointerleave', leave)
    }
  }, [active, reduced])

  return <div className="type-playground" data-reading={reading} data-mode={mode}>
    <div className="type-heading"><h2>Nothing ends.<br /><em>Everything becomes.</em></h2><p>A playground for the words we leave behind.</p></div>
    <canvas ref={canvasRef} className="type-field" role="img" aria-label="Interactive letter sculpture. Move to scatter letters, hold to attract them. Use the release letters button for a keyboard-accessible burst." />
    <div className="type-caption" aria-live="polite">{reduced ? 'STILL COMPOSITION / REDUCED MOTION' : paused ? 'MOTION PAUSED' : 'MOVE TO SCATTER · HOLD TO ATTRACT'}{bursts > 0 && ` / ${bursts} RELEASED`}</div>
    <div className="type-controls" inert={reading} aria-label="Text playground controls">
      <div className="type-modes">{MODES.map((item) => <button key={item.id} type="button" aria-pressed={mode === item.id} onClick={() => setMode(item.id)}>{item.label}</button>)}</div>
      <div className="type-actions"><button type="button" onClick={burst} disabled={reduced || paused}>RELEASE LETTERS ↗</button><button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)} disabled={reduced}>{paused ? 'PLAY' : 'PAUSE'}</button><button ref={readRef} type="button" onClick={() => setReading(true)}>READ THE LETTER</button></div>
    </div>
    {reading && <div className="paper-letter-overlay type-letter" role="dialog" aria-modal="true" aria-label="A note before you go" onKeyDown={(event) => { if (event.key === 'Escape') close(); if (event.key === 'Tab') { const stops = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button, [tabindex="0"]')); const index = stops.indexOf(document.activeElement as HTMLElement); event.preventDefault(); stops[(index + (event.shiftKey ? -1 : 1) + stops.length) % stops.length]?.focus() } }}><div className="paper-letter-heading"><h3>A NOTE BEFORE YOU GO</h3><button className="quiet-control" ref={closeRef} type="button" onClick={close}>CLOSE ×</button></div><FlowLetter text={siteContent.goodbye.letter} /></div>}
  </div>
}
