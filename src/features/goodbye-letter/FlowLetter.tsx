import { useLayoutEffect, useRef } from 'react'
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext'

/** A readable, responsive letter. Hovering a line lifts its ink, without reflowing the paragraph. */
export function FlowLetter({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    let cancelled = false
    const render = () => {
      const width = root.clientWidth
      if (!width) return
      const fontSize = width < 500 ? 19 : 28
      const font = `${fontSize}px Georgia`
      const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [text]
      const paragraphs = [sentences.slice(0, 2).join(''), sentences.slice(2, 5).join(''), sentences.slice(5).join('')].filter(Boolean)
      const nodes = paragraphs.map((paragraph, i) => {
        const block = document.createElement('p'); block.className = 'ink-paragraph'
        const { lines } = layoutWithLines(prepareWithSegments(paragraph.trim(), font), width - 10, fontSize * 1.55)
        block.style.font = font
        block.setAttribute('aria-label', paragraph.trim())
        lines.forEach((line) => {
          const span = document.createElement('span'); span.className = 'ink-reading-line'; span.textContent = line.text; span.setAttribute('aria-hidden', 'true'); block.append(span)
        })
        block.dataset.paragraph = String(i + 1)
        return block
      })
      root.replaceChildren(...nodes)
    }
    const observer = new ResizeObserver(render); observer.observe(root)
    void document.fonts.ready.then(() => { if (!cancelled) render() })
    return () => { cancelled = true; observer.disconnect() }
  }, [text])
  return <article className="ink-letter">
    <div className="ink-letter-intro"><small>A NOTE / 07</small><h4>Thank you for<br />{' '}<em>being curious.</em></h4><span>Keep a little room<br />for the unexpected.</span></div>
    <div className="ink-letter-scroll" tabIndex={0} aria-label="Read the complete farewell letter"><div ref={ref} className="ink-letter-body" /><p className="ink-signature">Until the next beginning. ↗</p></div>
  </article>
}
