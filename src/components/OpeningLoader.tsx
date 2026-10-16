import { InkRibbons } from '../features/ink/InkRibbons'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { lockJourneyInput } from '../lib/lockJourneyInput'
import { characterAssets } from '../assets/characters/registry'

export function OpeningLoader({ onComplete }: { onComplete: () => void }) {
  const reducedMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const skipRef = useRef<() => void>(() => {})
  useLayoutEffect(() => {
    const root = rootRef.current
    const journey = document.getElementById('journey')
    if (!root || !journey) return
    const release = lockJourneyInput(journey)
    const reduced = reducedMotion
    const number = root.querySelector('[data-loading-number]')!
    const bar = root.querySelector('[data-loading-bar]')!
    const progress = { value: 0 }
    let disposed = false, closing = false, settled = 0, minimumElapsed = false
    let closeTween: gsap.core.Tween | undefined
    const warmRemainingCast = () => {
      const urls = Object.values(characterAssets).flatMap((group) => Object.values(group))
      const schedule = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 120))
      schedule(() => {
        for (const src of urls) {
          const img = new Image()
          img.src = src
        }
      })
    }
    const finish = () => {
      if (closing || disposed) return
      closing = true
      warmRemainingCast()
      closeTween = gsap.to(root, { autoAlpha: 0, scale: reduced ? 1 : 1.035, duration: reduced ? 0.15 : 0.65, ease: 'power2.inOut', onComplete: () => { release(); onComplete() } })
    }
    skipRef.current = finish
    const completeResource = () => {
      if (disposed || closing) return
      settled++
      gsap.to(progress, { value: settled / 3 * 100, duration: reduced ? 0 : 0.45, overwrite: true, onUpdate: () => {
        number.textContent = String(Math.round(progress.value)).padStart(2, '0')
        gsap.set(bar, { scaleX: progress.value / 100 })
      } })
      if (settled === 3 && minimumElapsed) finish()
    }
    const warmImage = (src: string) => {
      const image = new Image()
      image.src = src
      void image.decode().catch(() => undefined).then(completeResource)
    }
    void document.fonts.ready.then(completeResource)
    warmImage(characterAssets.deepseek.push)
    warmImage(characterAssets.grok.push)
    const minimum = window.setTimeout(() => { minimumElapsed = true; if (settled === 3) finish() }, reduced ? 250 : 1800)
    const deadline = window.setTimeout(finish, 6000)
    return () => {
      disposed = true
      window.clearTimeout(minimum)
      window.clearTimeout(deadline)
      gsap.killTweensOf(progress)
      closeTween?.kill()
      release()
    }
  }, [onComplete, reducedMotion])

  return <div className="opening-loader" data-ink-surface ref={rootRef}>
    <div className="opening-top"><span>CHRONICLE // AW-IN-PIECES</span><span>01000011 · AN INTERACTIVE JOURNEY</span></div>
    <div className="opening-center">
      <InkRibbons active reduced={reducedMotion} />
      <p className="opening-eyebrow">GATHERING THE THREADS · #00-INIT</p>
      <p className="opening-title">A little ink.<br /><em>A world to come.</em></p>
      <p className="opening-status" role="status">Preparing the first page</p>
    </div>
    <div className="opening-bottom">
      <div className="opening-count" aria-hidden="true"><span data-loading-number>00</span><small>/ 100</small></div>
      <button className="opening-skip" type="button" onClick={() => skipRef.current()}>OPEN THE PREFACE <span aria-hidden="true">↗</span></button>
      <div className="opening-track" aria-hidden="true"><span data-loading-bar /></div>
    </div>
  </div>
}

