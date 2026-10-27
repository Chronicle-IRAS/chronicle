import { useEffect, useRef, useState } from 'react'
import { measureLineStats, prepareWithSegments } from '@chenglou/pretext'
import {
  layoutNextRichInlineLineRange,
  materializeRichInlineLineRange,
  prepareRichInline,
  type PreparedRichInline,
  type RichInlineCursor,
  type RichInlineItem,
} from '@chenglou/pretext/rich-inline'

type Point = {
  x: number
  y: number
}

type Interval = {
  left: number
  right: number
}

type HullShape = 'astrolabe' | 'hexPrism' | 'twinVortex'

type TokenStyle = 'prose' | 'lead' | 'serif' | 'chipRed' | 'chipCyan' | 'chipGold'

type RichSpecToken = {
  text: string
  style: TokenStyle
}

type DimensionStreamSpec = {
  code: string
  label: string
  title: string
  accent: string
  hull: HullShape
  quote: string
  tokens: RichSpecToken[]
}

const PROSE_FONT = '400 17.5px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif'
const LEAD_FONT = '700 18.5px "Syne", sans-serif'
const SERIF_FONT = 'italic 400 21px "Instrument Serif", Georgia, serif'
const CHIP_FONT = '600 12px "JetBrains Mono", monospace'
const QUOTE_FONT = 'italic 400 18px "Instrument Serif", Georgia, serif'
const LINE_HEIGHT = 34
const MIN_SLOT_WIDTH = 68

const DIMENSION_STREAMS: DimensionStreamSpec[] = [
  {
    code: '01',
    label: 'QT & C++ AST',
    title: 'Visual Compilers & Zero-Reflow Arithmetic',
    accent: '#f04132',
    hull: 'astrolabe',
    quote:
      '“Typography ceases to be a static box and becomes a live spatial field governed by pure arithmetic.”',
    tokens: [
      { text: 'IN VISUAL COMPILERS ', style: 'lead' },
      {
        text: 'every node-graph wire and C++17 AST token demands deterministic sixty-frame motion. With ',
        style: 'prose',
      },
      { text: '@chenglou/pretext/rich-inline', style: 'chipRed' },
      {
        text: ', mixed typographic runs—bold headers, ',
        style: 'prose',
      },
      { text: 'editorial serif whispers, ', style: 'serif' },
      {
        text: 'and atomic telemetry pills—are segmented once and measured in ',
        style: 'prose',
      },
      { text: '0.04ms ARITHMETIC', style: 'chipGold' },
      {
        text: '. As the central geometric astrolabe rotates in open space, each horizontal line band slices the polygon contour, carves ',
        style: 'prose',
      },
      { text: 'LEFT & RIGHT CHANNELS', style: 'chipCyan' },
      {
        text: ', and leaps atomic code chips cleanly across the star hull whenever a slot narrows—with ',
        style: 'prose',
      },
      { text: 'ZERO DOM REFLOW', style: 'chipRed' },
      {
        text: ' and zero rigid borders. Drag the rotating crystal anywhere through these sentences or sweep your cursor across the stream: ',
        style: 'prose',
      },
      { text: 'every glyph re-routes like light around a prism, ', style: 'serif' },
      {
        text: 'bridging native ',
        style: 'prose',
      },
      { text: 'Qt / C++17', style: 'chipCyan' },
      {
        text: ' precision with kinetic web typography.',
        style: 'prose',
      },
    ],
  },
  {
    code: '02',
    label: 'AI AGENTS',
    title: 'Streaming Reasoning Graphs & Inline Telemetry',
    accent: '#00e0ff',
    hull: 'hexPrism',
    quote:
      '“When inline measurement costs microseconds, autonomous reasoning tokens weave around live instruments effortlessly.”',
    tokens: [
      { text: 'AUTONOMOUS AI AGENTS ', style: 'lead' },
      {
        text: 'emit continuous streams of thoughts, tool calls, and verification traces. By pairing ',
        style: 'prose',
      },
      { text: 'prepareRichInline()', style: 'chipCyan' },
      {
        text: ' with ',
        style: 'prose',
      },
      { text: 'layoutNextRichInlineLineRange()', style: 'chipRed' },
      {
        text: ', unbreakable status badges like ',
        style: 'prose',
      },
      { text: 'DAG // VERIFIED ✦', style: 'chipGold' },
      {
        text: ' coexist inside fluid prose without ever splitting mid-token. Watch how ',
        style: 'prose',
      },
      { text: 'multilingual graphemes and live reasoning states ', style: 'serif' },
      {
        text: 'part around the rotating hexagonal core: when the left channel shrinks below a chip’s width, the cursor advances seamlessly to the right-hand slot in ',
        style: 'prose',
      },
      { text: 'SUB-MILLISECOND TIME', style: 'chipCyan' },
      {
        text: '. No layout thrashing, no bounding-box reads, and ',
        style: 'prose',
      },
      { text: '100% DETERMINISTIC', style: 'chipRed' },
      {
        text: ' line-breaking across every frame of the agent’s execution loop.',
        style: 'prose',
      },
    ],
  },
  {
    code: '03',
    label: 'ESP32 & SHADERS',
    title: 'Physical Computing Meets Kinetic Typography',
    accent: '#ff9e64',
    hull: 'twinVortex',
    quote:
      '“From ESP32 sensor bursts to WebGL prism shaders, words now respond to force fields like physical matter.”',
    tokens: [
      { text: 'WHEN HARDWARE TELEMETRY ', style: 'lead' },
      {
        text: 'arrives from an ',
        style: 'prose',
      },
      { text: 'ESP32-S3 MATRIX', style: 'chipGold' },
      {
        text: ' or a Three.js shader wave ripples across the cosmos, surrounding typography should react as part of the same medium. Using ',
        style: 'prose',
      },
      { text: 'measureLineStats()', style: 'chipCyan' },
      {
        text: ' and real-time polygon chord carving, sentences divide around ',
        style: 'prose',
      },
      { text: 'rotating twin-vortex fields ', style: 'serif' },
      {
        text: 'and fuse back together as the field passes. Atomic hardware readouts such as ',
        style: 'prose',
      },
      { text: 'UART // 921600 BAUD', style: 'chipRed' },
      {
        text: ' and ',
        style: 'prose',
      },
      { text: 'GLSL // 60FPS', style: 'chipGold' },
      {
        text: ' ride the typographic current intact, proving that ',
        style: 'prose',
      },
      { text: 'pure arithmetic layout ', style: 'serif' },
      {
        text: 'turns open-space web text into a tactile, borderless instrument.',
        style: 'prose',
      },
    ],
  },
]

function buildHullPolygon(shape: HullShape, cx: number, cy: number, radius: number, angle: number): Point[] {
  const pts: Point[] = []
  if (shape === 'astrolabe') {
    const spikes = 8
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? radius : radius * 0.56
      const a = angle + (i * Math.PI) / spikes
      pts.push({
        x: cx + Math.cos(a) * r,
        y: cy + Math.sin(a) * r,
      })
    }
    return pts
  }

  if (shape === 'hexPrism') {
    const sides = 6
    for (let i = 0; i < sides; i++) {
      const a = angle + (i * Math.PI * 2) / sides
      const stretch = i % 2 === 0 ? 1.06 : 0.88
      pts.push({
        x: cx + Math.cos(a) * radius * stretch,
        y: cy + Math.sin(a) * radius * stretch,
      })
    }
    return pts
  }

  // twinVortex: elongated 10-point harmonic star hull
  const vertices = 10
  for (let i = 0; i < vertices; i++) {
    const a = angle + (i * Math.PI * 2) / vertices
    const harmonic = 0.72 + 0.34 * Math.sin(i * 2 + angle * 2)
    pts.push({
      x: cx + Math.cos(a) * radius * harmonic,
      y: cy + Math.sin(a) * radius * harmonic,
    })
  }
  return pts
}

function getPolygonIntervalForBand(
  points: Point[],
  bandTop: number,
  bandBottom: number,
  hPad: number,
  vPad: number,
): Interval | null {
  const top = bandTop - vPad
  const bottom = bandBottom + vPad
  let minX = Infinity
  let maxX = -Infinity

  const n = points.length
  for (let i = 0; i < n; i++) {
    const p1 = points[i]!
    const p2 = points[(i + 1) % n]!

    if (p1.y >= top && p1.y <= bottom) {
      if (p1.x < minX) minX = p1.x
      if (p1.x > maxX) maxX = p1.x
    }

    if ((p1.y < top && p2.y < top) || (p1.y > bottom && p2.y > bottom)) {
      continue
    }

    const dy = p2.y - p1.y
    if (Math.abs(dy) < 1e-5) {
      if (p1.y >= top && p1.y <= bottom) {
        minX = Math.min(minX, p1.x, p2.x)
        maxX = Math.max(maxX, p1.x, p2.x)
      }
      continue
    }

    for (const yEdge of [top, bottom]) {
      const t = (yEdge - p1.y) / dy
      if (t >= 0 && t <= 1) {
        const ix = p1.x + t * (p2.x - p1.x)
        if (ix < minX) minX = ix
        if (ix > maxX) maxX = ix
      }
    }
  }

  if (minX > maxX) return null
  return { left: minX - hPad, right: maxX + hPad }
}

function circleIntervalForBand(
  cx: number,
  cy: number,
  r: number,
  bandTop: number,
  bandBottom: number,
  hPad: number,
): Interval | null {
  if (bandTop >= cy + r || bandBottom <= cy - r) return null
  const minDy = cy >= bandTop && cy <= bandBottom ? 0 : cy < bandTop ? bandTop - cy : cy - bandBottom
  if (minDy >= r) return null
  const maxDx = Math.sqrt(r * r - minDy * minDy)
  return { left: cx - maxDx - hPad, right: cx + maxDx + hPad }
}

function carveTextLineSlots(base: Interval, blocked: Interval[]): Interval[] {
  let slots: Interval[] = [base]
  for (let i = 0; i < blocked.length; i++) {
    const interval = blocked[i]!
    const next: Interval[] = []
    for (let j = 0; j < slots.length; j++) {
      const slot = slots[j]!
      if (interval.right <= slot.left || interval.left >= slot.right) {
        next.push(slot)
        continue
      }
      if (interval.left > slot.left) {
        next.push({ left: slot.left, right: interval.left })
      }
      if (interval.right < slot.right) {
        next.push({ left: interval.right, right: slot.right })
      }
    }
    slots = next
  }
  return slots.filter(s => s.right - s.left >= MIN_SLOT_WIDTH)
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const HULL_CYCLE: readonly HullShape[] = ['astrolabe', 'hexPrism', 'twinVortex']

export function PretextStage({
  activeDimension,
  reducedMotion,
}: {
  activeDimension: number
  onSelectDimension?: (index: number) => void
  reducedMotion: boolean
}) {
  const streamIdx = activeDimension < 0 ? 0 : activeDimension % DIMENSION_STREAMS.length
  const activeSpec = DIMENSION_STREAMS[streamIdx] ?? DIMENSION_STREAMS[0]!

  const [hullOverride, setHullOverride] = useState<HullShape | null>(null)

  const stageRef = useRef<HTMLDivElement>(null)
  const svgHullPathRef = useRef<SVGPathElement>(null)
  const svgInnerRingRef = useRef<SVGCircleElement>(null)
  const hullGroupRef = useRef<SVGGElement>(null)
  const hullMagnetRef = useRef<HTMLDivElement>(null)
  const quotePillRef = useRef<HTMLDivElement>(null)

  const effectiveHull: HullShape = hullOverride ?? activeSpec.hull
  const effectiveHullRef = useRef<HullShape>(effectiveHull)
  effectiveHullRef.current = effectiveHull

  const streamIdxRef = useRef(streamIdx)
  streamIdxRef.current = streamIdx

  // Reset manual hull override when the user switches dimension above
  useEffect(() => {
    setHullOverride(null)
  }, [streamIdx])

  const hullStateRef = useRef({
    normX: 0.5,
    normY: 0.5,
    angle: 0,
    angVel: 0.52,
    dragging: false,
  })

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    let disposed = false
    let rafId = 0
    let inViewport = true

    // Pre-compile all 3 Rich-Inline streams once via @chenglou/pretext/rich-inline
    const compiledStreams = DIMENSION_STREAMS.map(spec => {
      const doubledTokens = [...spec.tokens, { text: '   ✦   ', style: 'serif' as const }, ...spec.tokens]
      const richItems: RichInlineItem[] = doubledTokens.map(tok => {
        if (tok.style === 'lead') {
          return { text: tok.text, font: LEAD_FONT }
        }
        if (tok.style === 'serif') {
          return { text: tok.text, font: SERIF_FONT }
        }
        if (tok.style === 'chipRed' || tok.style === 'chipCyan' || tok.style === 'chipGold') {
          return {
            text: tok.text,
            font: CHIP_FONT,
            break: 'never',
            extraWidth: 20,
          }
        }
        return { text: tok.text, font: PROSE_FONT }
      })

      const preparedRich: PreparedRichInline = prepareRichInline(richItems)
      const preparedQuote = prepareWithSegments(spec.quote, QUOTE_FONT)

      // Binary-search tightest shrinkwrap width for the floating quote whisper
      const baseQuoteStats = measureLineStats(preparedQuote, 360)
      const targetQuoteLines = Math.max(1, baseQuoteStats.lineCount)
      let lo = 180
      let hi = 360
      let tightQuoteW = 340
      while (lo <= hi) {
        const mid = (lo + hi) >> 1
        const st = measureLineStats(preparedQuote, mid)
        if (st.lineCount <= targetQuoteLines) {
          tightQuoteW = Math.ceil(st.maxLineWidth) + 8
          hi = mid - 1
        } else {
          lo = mid + 1
        }
      }

      return {
        spec,
        tokens: doubledTokens,
        preparedRich,
        tightQuoteW,
      }
    })

    const linePool: HTMLDivElement[] = []
    const lineHtmlCache: string[] = []

    const syncLinePool = (count: number) => {
      while (linePool.length < count) {
        const el = document.createElement('div')
        el.className = 'pretext-rich-line'
        stage.appendChild(el)
        linePool.push(el)
        lineHtmlCache.push('')
      }
      for (let i = 0; i < linePool.length; i++) {
        linePool[i]!.style.display = i < count ? '' : 'none'
      }
    }

    const pointer = { x: -9999, y: -9999, inside: false }
    let dragOffset = { dx: 0, dy: 0 }
    let downPos = { x: 0, y: 0 }

    const onPointerDown = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect()
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top
      const hs = hullStateRef.current
      const cx = hs.normX * rect.width
      const cy = hs.normY * rect.height
      const hitR = rect.width < 700 ? 74 : 108
      const dx = px - cx
      const dy = py - cy
      if (dx * dx + dy * dy <= hitR * hitR) {
        e.preventDefault()
        hs.dragging = true
        hs.angVel = 2.4
        downPos = { x: px, y: py }
        dragOffset = { dx: cx - px, dy: cy - py }
        stage.setPointerCapture(e.pointerId)
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect()
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top
      pointer.x = px
      pointer.y = py
      pointer.inside = px >= 0 && px <= rect.width && py >= 0 && py <= rect.height

      const hs = hullStateRef.current
      if (hs.dragging) {
        const nextX = px + dragOffset.dx
        const nextY = py + dragOffset.dy
        hs.normX = Math.max(0.2, Math.min(0.8, nextX / Math.max(1, rect.width)))
        hs.normY = Math.max(0.24, Math.min(0.76, nextY / Math.max(1, rect.height)))
      }
    }

    const onPointerUp = (e: PointerEvent) => {
      const hs = hullStateRef.current
      if (hs.dragging) {
        const rect = stage.getBoundingClientRect()
        const px = e.clientX - rect.left
        const py = e.clientY - rect.top
        if (Math.hypot(px - downPos.x, py - downPos.y) < 8) {
          hs.angVel = 3.4
          setHullOverride(prev => {
            const cur = prev ?? effectiveHullRef.current
            const nextIdx = (HULL_CYCLE.indexOf(cur) + 1) % HULL_CYCLE.length
            return HULL_CYCLE[nextIdx] ?? 'astrolabe'
          })
        }
      }
      hs.dragging = false
    }

    const onPointerLeave = () => {
      pointer.inside = false
    }

    stage.addEventListener('pointerdown', onPointerDown)
    stage.addEventListener('pointermove', onPointerMove)
    stage.addEventListener('pointerup', onPointerUp)
    stage.addEventListener('pointercancel', onPointerUp)
    stage.addEventListener('pointerleave', onPointerLeave)

    let lastTime = performance.now()

    const tick = (now: number) => {
      if (disposed || !inViewport) {
        rafId = 0
        return
      }

      const dt = Math.min(0.04, Math.max(0.001, (now - lastTime) / 1000))
      lastTime = now

      const stageW = stage.clientWidth || 980
      const stageH = stage.clientHeight || 420
      const isNarrow = stageW < 720

      const hs = hullStateRef.current
      if (!reducedMotion) {
        hs.angle += hs.angVel * dt
        hs.angVel += (0.48 - hs.angVel) * Math.min(1, dt * 2.4)
      }

      const activeCompiled = compiledStreams[streamIdxRef.current] ?? compiledStreams[0]!
      const hullRadius = isNarrow ? 64 : 96
      const baseCx = hs.normX * stageW
      const baseCy = hs.normY * stageH

      // Magnetic attraction pull when pointer approaches the rotating crystal
      let magPullX = 0
      let magPullY = 0
      if (pointer.inside && !hs.dragging) {
        const dx = pointer.x - baseCx
        const dy = pointer.y - baseCy
        const dist = Math.hypot(dx, dy)
        if (dist < 160) {
          const pull = (1 - dist / 160) * 0.28
          magPullX = dx * pull
          magPullY = dy * pull
        }
      }

      const cx = baseCx + magPullX
      const cy = baseCy + magPullY
      const polyPoints = buildHullPolygon(
        effectiveHullRef.current,
        cx,
        cy,
        hullRadius,
        hs.angle,
      )

      if (hullMagnetRef.current) {
        const magD = hullRadius * 1.15
        hullMagnetRef.current.style.width = `${magD.toFixed(0)}px`
        hullMagnetRef.current.style.height = `${magD.toFixed(0)}px`
        hullMagnetRef.current.style.left = `${(cx - magD * 0.5).toFixed(1)}px`
        hullMagnetRef.current.style.top = `${(cy - magD * 0.5).toFixed(1)}px`
      }

      // Update SVG Polygon Hull in open space
      if (svgHullPathRef.current && polyPoints.length > 0) {
        const d =
          polyPoints
            .map((p, idx) => `${idx === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
            .join(' ') + ' Z'
        svgHullPathRef.current.setAttribute('d', d)
      }
      if (svgInnerRingRef.current) {
        svgInnerRingRef.current.setAttribute('cx', cx.toFixed(1))
        svgInnerRingRef.current.setAttribute('cy', cy.toFixed(1))
        svgInnerRingRef.current.setAttribute('r', (hullRadius * 0.42).toFixed(1))
      }
      if (hullGroupRef.current) {
        hullGroupRef.current.style.setProperty('--hull-accent', activeCompiled.spec.accent)
      }
      if (quotePillRef.current) {
        quotePillRef.current.style.maxWidth = `${activeCompiled.tightQuoteW}px`
      }

      const baseInterval: Interval = { left: 0, right: stageW }

      let cursor: RichInlineCursor = { itemIndex: 0, segmentIndex: 0, graphemeIndex: 0 }
      let y = 8
      let placedCount = 0

      while (y + LINE_HEIGHT <= stageH - 8) {
        const bandTop = y
        const bandBottom = y + LINE_HEIGHT
        const blocked: Interval[] = []

        const polyInterval = getPolygonIntervalForBand(polyPoints, bandTop, bandBottom, 18, 4)
        if (polyInterval) blocked.push(polyInterval)

        if (pointer.inside && !hs.dragging) {
          const ptrInterval = circleIntervalForBand(pointer.x, pointer.y, 44, bandTop, bandBottom, 12)
          if (ptrInterval) blocked.push(ptrInterval)
        }

        const slots = carveTextLineSlots(baseInterval, blocked)
        if (slots.length === 0) {
          y += LINE_HEIGHT
          continue
        }

        const orderedSlots = isNarrow
          ? [slots.reduce((best, s) => (s.right - s.left > best.right - best.left ? s : best))]
          : slots

        for (let s = 0; s < orderedSlots.length; s++) {
          const slot = orderedSlots[s]!
          const slotW = slot.right - slot.left
          const lineRange = layoutNextRichInlineLineRange(activeCompiled.preparedRich, slotW, cursor)
          if (!lineRange) break

          const matLine = materializeRichInlineLineRange(activeCompiled.preparedRich, lineRange)
          let lineHtml = ''
          for (let f = 0; f < matLine.fragments.length; f++) {
            const frag = matLine.fragments[f]!
            const tok = activeCompiled.tokens[frag.itemIndex]
            const style = tok?.style ?? 'prose'
            const gapStyle = frag.gapBefore > 0 ? ` style="margin-left:${frag.gapBefore.toFixed(1)}px"` : ''
            if (style === 'chipRed' || style === 'chipCyan' || style === 'chipGold') {
              lineHtml += `<span class="pretext-inline-chip" data-chip="${style}"${gapStyle}>${escapeHtml(frag.text)}</span>`
            } else if (style === 'lead') {
              lineHtml += `<strong class="pretext-inline-lead"${gapStyle}>${escapeHtml(frag.text)}</strong>`
            } else if (style === 'serif') {
              lineHtml += `<em class="pretext-inline-serif"${gapStyle}>${escapeHtml(frag.text)}</em>`
            } else {
              lineHtml += `<span class="pretext-inline-prose"${gapStyle}>${escapeHtml(frag.text)}</span>`
            }
          }

          const idx = placedCount++
          while (linePool.length <= idx) {
            const el = document.createElement('div')
            el.className = 'pretext-rich-line'
            stage.appendChild(el)
            linePool.push(el)
            lineHtmlCache.push('')
          }
          const el = linePool[idx]!
          el.style.display = ''
          el.style.transform = `translate3d(${Math.round(slot.left)}px, ${Math.round(y)}px, 0)`
          el.dataset.carved = orderedSlots.length > 1 ? 'true' : 'false'
          if (lineHtmlCache[idx] !== lineHtml) {
            lineHtmlCache[idx] = lineHtml
            el.innerHTML = lineHtml
          }

          cursor = lineRange.end
        }

        y += LINE_HEIGHT
      }

      syncLinePool(placedCount)

      rafId = requestAnimationFrame(tick)
    }

    const viewportObserver = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          inViewport = entry.isIntersecting
          if (inViewport && rafId === 0 && !disposed) {
            lastTime = performance.now()
            rafId = requestAnimationFrame(tick)
          }
        }
      },
      { threshold: 0.05 },
    )
    viewportObserver.observe(stage)
    rafId = requestAnimationFrame(tick)

    return () => {
      disposed = true
      viewportObserver.disconnect()
      if (rafId) cancelAnimationFrame(rafId)
      stage.removeEventListener('pointerdown', onPointerDown)
      stage.removeEventListener('pointermove', onPointerMove)
      stage.removeEventListener('pointerup', onPointerUp)
      stage.removeEventListener('pointercancel', onPointerUp)
      stage.removeEventListener('pointerleave', onPointerLeave)
      for (const el of linePool) el.remove()
    }
  }, [reducedMotion])

  return (
    <div className="pretext-showcase" aria-label="Pretext Rich-Inline and Polygon Hull Flow Stage">
      <div ref={quotePillRef} className="pretext-open-quote">
        <span>{activeSpec.quote}</span>
      </div>

      <div
        ref={stageRef}
        className="pretext-stage"
        role="region"
        aria-label="Interactive Rich-Inline polygon wrapping stage"
      >
        <div
          ref={hullMagnetRef}
          className="pretext-hull-magnet"
          data-cursor="DRAG / MORPH ✦"
          data-no-element-pull="true"
          aria-hidden="true"
        />
        <svg className="pretext-hull-svg" aria-hidden="true">
          <g ref={hullGroupRef} className="pretext-hull-group">
            <path ref={svgHullPathRef} className="pretext-hull-path" />
            <circle ref={svgInnerRingRef} className="pretext-hull-core" />
          </g>
        </svg>
      </div>
    </div>
  )
}

export default PretextStage
