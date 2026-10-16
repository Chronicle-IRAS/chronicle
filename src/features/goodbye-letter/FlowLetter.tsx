import { useLayoutEffect, useRef, useState } from 'react'
import { prepareWithSegments, layoutNextLine } from '@chenglou/pretext'
import type { LayoutCursor } from '@chenglou/pretext'

/** Pretext wraps real, selectable text around a quiet margin ornament. */
export function FlowLetter({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [contoured, setContoured] = useState(true)
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    let cancelled = false
    let previousWidth = -1
    const render = (force = false) => {
      const width = root.clientWidth
      if (!width || (!force && width === previousWidth)) return
      previousWidth = width
      const fontSize = width < 500 ? 21 : 27
      const font = `${fontSize}px "Instrument Serif", Georgia, serif`
      const lineHeight = Math.round(fontSize * 1.55)
      const radius = Math.min(78, width * .16)
      const centerY = lineHeight * 2.8
      const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [text]
      const paragraphs = [sentences.slice(0, 2).join(''), sentences.slice(2, 5).join(''), sentences.slice(5).join('')].filter(Boolean)
      const nodes = paragraphs.map((paragraph, i) => {
        const block = document.createElement('p'); block.className = 'ink-paragraph'
        const prepared = prepareWithSegments(paragraph.trim(), font)
        block.style.font = font
        let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 }
        let row = 0
        for (;;) {
          // Reserve the widest chord touched by this complete line box.
          const nearestY = Math.max(row * lineHeight, Math.min(centerY, (row + 1) * lineHeight))
          const distance = Math.abs(nearestY - centerY)
          const inset = contoured && i === 0 && distance < radius + 14
            ? radius + Math.sqrt((radius + 14) ** 2 - distance ** 2) + 8 : 0
          const lineWidth = Math.max(80, width - inset - 10)
          const line = layoutNextLine(prepared, cursor, lineWidth)
          if (!line) break
          const span = document.createElement('span')
          span.className = 'ink-reading-line'
          span.textContent = `${line.text.trimEnd()}\n`
          span.style.width = `${lineWidth}px`
          span.style.lineHeight = `${lineHeight}px`
          block.append(span)
          cursor = line.end
          row++
        }
        if (contoured && i === 0) {
          const seal = document.createElement('span')
          seal.className = 'ink-letter-seal'
          seal.setAttribute('aria-hidden', 'true')
          seal.style.width = seal.style.height = `${radius * 2}px`
          seal.style.top = `${centerY - radius}px`
          seal.textContent = 'STAY\nCURIOUS'
          block.append(seal)
        }
        block.dataset.paragraph = String(i + 1)
        return block
      })
      root.replaceChildren(...nodes)
    }
    const observer = new ResizeObserver(() => render()); observer.observe(root)
    void document.fonts.ready.then(() => { if (!cancelled) render(true) })
    return () => { cancelled = true; observer.disconnect() }
  }, [text, contoured])
  return <article className="ink-letter" data-contoured={contoured}>
    <div className="ink-letter-intro"><small>A NOTE / 07</small><h4>Thank you for<br />{' '}<em>being curious.</em></h4><span>Keep a little room<br />for the unexpected.</span><button type="button" className="ink-layout-toggle" aria-pressed={contoured} onClick={() => setContoured(!contoured)}>{contoured ? '↗ STRAIGHT MARGINS' : '◯ FLOWING MARGINS'}</button></div>
    <div className="ink-letter-scroll" tabIndex={0} aria-label="Read the complete farewell letter"><div ref={ref} className="ink-letter-body" /><p className="ink-signature">Until the next beginning. ↗</p></div>
  </article>
}
