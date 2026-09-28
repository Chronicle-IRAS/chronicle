import { useEffect, useRef } from 'react'
import { layoutNextRichInlineLineRange, materializeRichInlineLineRange, prepareRichInline } from '@chenglou/pretext/rich-inline'
import type { PreparedRichInline, RichInlineCursor, RichInlineItem, RichInlineLineRange } from '@chenglou/pretext/rich-inline'
import { gsap } from '../../lib/gsap'
import { useSceneStore } from '../../stores/sceneStore'

/** The drop cap is a second obstacle beside the moving margin, so it only appears on wide columns. */
const CAP_MIN_WIDTH = 380
/** Ink deepens toward the margin; a prebuilt ramp keeps the per-frame writes allocation-free. */
const INK = [
  'rgb(59, 76, 71)', 'rgb(53, 71, 66)', 'rgb(47, 66, 61)', 'rgb(41, 60, 56)',
  'rgb(35, 55, 50)', 'rgb(29, 49, 45)', 'rgb(24, 44, 40)', 'rgb(19, 39, 35)',
]
const RING_TEXT = 'SEE YOU SOON · UNTIL NEXT TIME ·'
/** Upper-case tokens become inline stamps; the letter keeps its own words, nothing is invented. */
const STAMP_PATTERN = /^[A-Z]{2,}$/
/** Inline stamp chrome: padding + border, which Pretext needs as `extraWidth` to wrap correctly. */
const STAMP_PAD = 5
const STAMP_BORDER = 1
const STAMP_EXTRA = (STAMP_PAD + STAMP_BORDER) * 2
const STAMP_TRACKING_EM = 0.08
/** A justified gap outside this band reads as a river, so those lines stay ragged (justification-comparison demo). */
const GAP_MIN_RATIO = 0.65
const GAP_MAX_RATIO = 1.5
/** Circle centres sampled when proving a font size still fits; the margin travels between them. */
const MARGIN_TRAVEL = [0.3, 0.5, 0.7]

/** Prepared once per font/resize; the ticker only lays out cached text widths. */
export function FlowLetter({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const active = useSceneStore((state) => state.currentScene === 'goodbye')
  const reducedMotion = useSceneStore((state) => state.reducedMotion)

  useEffect(() => {
    const root = ref.current
    const lines = root?.querySelector<HTMLElement>('[data-letter-lines]')
    const orbit = root?.querySelector<HTMLElement>('[data-letter-orbit]')
    const flourishes = root ? Array.from(root.querySelectorAll<SVGPathElement>('[data-letter-flourish]')) : []
    if (!root || !lines || !orbit) return
    let cancelled = false
    let width = 0, height = 0, top = 0, left = 0, radius = 0, lineHeight = 24, fontSize = 15, capWidth = 0
    let prepared: PreparedRichInline | undefined
    let itemClasses: string[] = []
    let pointer = 0, pointerX = 0, follow = 0, followX = 0, hovering = false, lastFrame = -1
    let centerX = 0.5, centerY = 0.5
    const rows: HTMLSpanElement[] = []
    const lineRanges: (RichInlineLineRange | undefined)[] = []
    const lineSlots: { x: number, y: number, width: number }[] = []
    const entrance = { value: reducedMotion ? 1 : 0 }
    const start = gsap.ticker.time
    // Route the same reading cursor left-to-right around a real central opening.
    const slotsAt = (y: number, cx: number, cy: number, r: number) => {
      const dy = Math.max(0, Math.abs(y + lineHeight / 2 - cy) - lineHeight / 2)
      if (dy >= r + 10) return [{ x: 0, y, width }]
      const chord = Math.sqrt((r + 10) ** 2 - dy * dy)
      const right = cx + chord
      return [{ x: 0, y, width: cx - chord }, { x: right, y, width: width - right }].filter((slot) => slot.width >= 94)
    }
    const render = (time: number) => {
      if (!prepared || !width || document.hidden) return
      if (time - lastFrame < 1 / 30 && !reducedMotion) return
      lastFrame = time
      follow += (pointer - follow) * 0.12
      followX += (pointerX - followX) * 0.12
      const phase = reducedMotion ? 0 : time - start
      const targetY = 0.5 + (reducedMotion ? 0 : (hovering ? follow * 0.2 : Math.sin(phase * 0.8) * 0.18))
      const targetX = 0.5 + (reducedMotion ? 0 : (hovering ? followX * 0.2 : Math.sin(phase * 0.55) * 0.17))
      centerX += (targetX - centerX) * 0.12
      centerY += (targetY - centerY) * 0.12
      const cy = height * centerY
      const cx = width * centerX
      const liveRadius = radius * (reducedMotion ? 1 : 1 + Math.sin(phase * 1.2) * 0.1)
      orbit.style.width = `${liveRadius * 2}px`
      orbit.style.height = `${liveRadius * 2}px`
      orbit.style.transform = `translate3d(${cx - liveRadius}px, ${cy - liveRadius}px, 0) rotate(${reducedMotion ? 0 : phase * 14}deg)`
      const enter = entrance.value
      const reach = radius * 1.8
      // One layout pass per frame; a row only ends the paragraph when the text is consumed.
      let cursor: RichInlineCursor | undefined
      let count = 0
      let exhausted = false
      for (let y = 0; y + lineHeight <= height && !exhausted; y += lineHeight) {
        for (const slot of slotsAt(y, cx, cy, liveRadius)) {
          const range = layoutNextRichInlineLineRange(prepared, slot.width - (count === 0 ? capWidth : 0), cursor)
          if (!range) { exhausted = true; break }
          lineRanges[count] = range
          lineSlots[count] = slot
          cursor = range.end
          count++
        }
      }
      const complete = cursor ? layoutNextRichInlineLineRange(prepared, 40, cursor) === null : true
      for (let index = 0; index < count; index++) {
        const { x, y, width: slotWidth } = lineSlots[index]
        const line = materializeRichInlineLineRange(prepared, lineRanges[index]!)
        const limit = slotWidth - (index === 0 ? capWidth : 0)
        // The final line stays ragged; earlier lines may stretch inside the river-free band.
        let gaps = 0
        let gapWidth = 0
        for (let i = 1; i < line.fragments.length; i++) {
          const gap = line.fragments[i]!.gapBefore
          if (gap > 0) { gaps += 1; gapWidth += gap }
        }
        const mean = gaps ? gapWidth / gaps : 0
        const stretch = gaps && !(complete && index === count - 1) ? (limit - line.width) / gaps : 0
        const justified = mean > 0 && (mean + stretch) / mean >= GAP_MIN_RATIO && (mean + stretch) / mean <= GAP_MAX_RATIO ? stretch : 0
        let row = rows[index]
        if (!row) {
          row = document.createElement('span')
          row.className = 'letter-line'
          lines.append(row)
          rows.push(row)
        }
        // Fragment chrome is kept in place; only the text and the collapsed gaps move.
        const cap = index === 0 && capWidth ? Array.from(line.fragments[0]!.text)[0] : undefined
        const children = row.childNodes
        if (children.length !== line.fragments.length + (cap ? 1 : 0)) {
          const wanted: Node[] = []
          for (let i = 0; i < line.fragments.length + (cap ? 1 : 0); i++) wanted.push(document.createElement('span'))
          row.replaceChildren(...wanted)
        }
        const nodes = row.childNodes
        if (cap) {
          const glyph = nodes[0] as HTMLSpanElement
          if (glyph.className !== 'letter-cap') glyph.className = 'letter-cap'
          if (glyph.textContent !== cap) glyph.textContent = cap
        }
        const offset = cap ? 1 : 0
        for (let i = 0; i < line.fragments.length; i++) {
          const fragment = line.fragments[i]!
          const part = nodes[offset + i] as HTMLSpanElement
          const className = itemClasses[fragment.itemIndex] ?? ''
          if (part.className !== className) part.className = className
          const face = cap && i === 0 ? Array.from(fragment.text).slice(1).join('') : fragment.text
          if (part.textContent !== face) part.textContent = face
          const margin = `${(fragment.gapBefore > 0 ? fragment.gapBefore : 0) + (i ? justified : 0)}px`
          if (part.style.marginLeft !== margin) part.style.marginLeft = margin
        }
        // Ink and the written-in stagger follow the margin; unchanged rows are left alone.
        const warmth = Math.min(1, Math.max(0, 1 - Math.abs(y + lineHeight / 2 - cy) / reach))
        const ink = Math.round(warmth * (INK.length - 1))
        const inkKey = String(ink)
        if (row.dataset.ink !== inkKey) {
          row.dataset.ink = inkKey
          row.style.color = INK[ink]
        }
        const written = reducedMotion ? 1 : Math.min(1, Math.max(0, (enter - y / lineHeight * 0.03) / 0.5))
        const alphaKey = (reducedMotion ? 1 : (0.8 + 0.2 * (ink / (INK.length - 1))) * written).toFixed(3)
        if (row.dataset.alpha !== alphaKey) {
          row.dataset.alpha = alphaKey
          row.style.opacity = alphaKey
        }
        const slide = (1 - written) * 12
        const transformKey = `${(x + slide).toFixed(1)}:${y}`
        if (row.dataset.tf !== transformKey) {
          row.dataset.tf = transformKey
          row.style.transform = `translate3d(${(x + slide).toFixed(2)}px, ${y}px, 0)`
        }
        if (row.style.display !== 'block') row.style.display = 'block'
      }
      lineRanges.length = count
      rows.slice(count).forEach((row) => { row.style.display = 'none' })
      root.style.setProperty('--letter-used', `${count ? lineSlots[count - 1].y + lineHeight : 0}px`)
      root.dataset.complete = String(complete)
      root.dataset.ready = 'true'
    }
    // Largest size whose every line still lands inside the box, margins sampled across their travel.
    const fitsAt = (candidate: PreparedRichInline, inset: number) => {
      for (const travel of MARGIN_TRAVEL) for (const horizontal of MARGIN_TRAVEL) {
        let cursor: RichInlineCursor | undefined
        let y = 0
        let exhausted = false
        for (; y + lineHeight <= height && !exhausted; y += lineHeight) {
          for (const slot of slotsAt(y, width * horizontal, height * travel, radius * 1.1)) {
            const range = layoutNextRichInlineLineRange(candidate, slot.width - (y === 0 ? inset : 0), cursor)
            if (!range) { exhausted = true; break }
            cursor = range.end
          }
        }
        if (!exhausted && (!cursor || layoutNextRichInlineLineRange(candidate, width, cursor))) return false
      }
      return true
    }
    const resize = () => {
      const rect = root.getBoundingClientRect()
      width = rect.width
      height = rect.height
      top = rect.top
      left = rect.left
      radius = Math.min(82, width * 0.16)
      let size = width < 400 ? 13 : 15
      let inset = 0
      do {
        lineHeight = size + (width < 400 ? 6 : 10)
        inset = width >= CAP_MIN_WIDTH ? Math.round(size * 1.75) : 0
        const items: RichInlineItem[] = []
        const classes: string[] = []
        const tracking = Math.round(size * STAMP_TRACKING_EM * 100) / 100
        for (const part of text.split(/(\b[A-Z]{2,}\b)/)) {
          if (!part) continue
          if (STAMP_PATTERN.test(part)) {
            items.push({ text: part, font: `700 ${size}px Arial`, letterSpacing: tracking, break: 'never', extraWidth: STAMP_EXTRA })
            classes.push('letter-stamp')
          } else {
            items.push({ text: part, font: `${size}px Arial` })
            classes.push('')
          }
        }
        prepared = prepareRichInline(items)
        itemClasses = classes
        if (fitsAt(prepared, inset)) break
        size--
      } while (size >= 11)
      fontSize = Math.max(11, size)
      capWidth = inset
      lines.style.fontSize = `${fontSize}px`
      root.style.setProperty('--letter-line', `${lineHeight}px`)
      // Sit the hairlines under the Arial baseline inside every Pretext line band.
      root.style.setProperty('--letter-rule', `${Math.round(fontSize * 0.85) + 3}px`)
      root.style.setProperty('--letter-stamp-tracking', `${Math.round(fontSize * STAMP_TRACKING_EM * 100) / 100}px`)
      lines.replaceChildren()
      rows.length = 0
      lastFrame = -1
      render(gsap.ticker.time)
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      hovering = true
      pointer = Math.max(-1, Math.min(1, (event.clientY - top) / height * 2 - 1))
      pointerX = Math.max(-1, Math.min(1, (event.clientX - left) / width * 2 - 1))
    }
    const leave = () => { hovering = false; pointer = 0; pointerX = 0 }
    const observer = new ResizeObserver(resize)
    observer.observe(root)
    if (active && !reducedMotion) {
      root.addEventListener('pointermove', move, { passive: true })
      root.addEventListener('pointerleave', leave)
      gsap.ticker.add(render)
    }
    if (active && !reducedMotion) gsap.to(entrance, { value: 1, duration: 1.2, ease: 'power2.out' })
    if (flourishes.length) {
      const lengths = flourishes.map((path) => path.getTotalLength())
      // Reduced motion shows the finished signature instead of drawing it.
      flourishes.forEach((path, index) => gsap.set(path, reducedMotion
        ? { strokeDasharray: 'none', strokeDashoffset: 0 }
        : { strokeDasharray: lengths[index], strokeDashoffset: lengths[index] }))
      if (active && !reducedMotion) flourishes.forEach((path, index) => gsap.to(path, { strokeDashoffset: 0, duration: index === 0 ? 1.3 : 0.5, delay: 0.5 + index * 0.85, ease: 'power2.inOut' }))
    }
    void document.fonts.ready.then(() => { if (!cancelled) resize() })
    return () => {
      cancelled = true
      observer.disconnect()
      gsap.ticker.remove(render)
      gsap.killTweensOf(entrance)
      gsap.killTweensOf(flourishes)
      root.removeEventListener('pointermove', move)
      root.removeEventListener('pointerleave', leave)
      lines.replaceChildren()
      rows.length = 0
      delete root.dataset.ready
    }
  }, [text, active, reducedMotion])

  return <div className="flow-letter" ref={ref}>
    <p className="letter-original">{text}</p>
    <div className="letter-rules" aria-hidden="true" />
    <div className="letter-lines" data-letter-lines aria-hidden="true" />
    <div className="letter-orbit" data-letter-orbit aria-hidden="true">
      <span className="letter-orbit-dial" />
      <svg className="letter-orbit-text" viewBox="0 0 100 100">
        <defs><path id="letter-ring-path" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" /></defs>
        <text><textPath href="#letter-ring-path" startOffset="0">{RING_TEXT}</textPath></text>
      </svg>
      <span className="letter-orbit-mark">↗</span>
      <i className="letter-orbit-satellite" />
    </div>
    <svg className="letter-flourish" viewBox="0 0 200 26" preserveAspectRatio="none" aria-hidden="true">
      <path data-letter-flourish vectorEffect="non-scaling-stroke" d="M2 19C22 6 38 22 56 13c14-7 26 6 42 1 12-4 24 3 38 0 10-2 20 2 26 1" />
      <path data-letter-flourish vectorEffect="non-scaling-stroke" d="M168 22c8-3 16-6 30-6" />
    </svg>
  </div>
}
