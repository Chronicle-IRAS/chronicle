import { useEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import { useSceneStore } from '../../stores/sceneStore'
import { FlowLetter } from '../goodbye-letter/FlowLetter'
import { siteContent } from '../../data/siteContent'

export function PaperFlight() {
  const root = useRef<HTMLDivElement>(null)
  const plane = useRef<HTMLButtonElement>(null)
  const letter = useRef<HTMLDivElement>(null)
  const readButton = useRef<HTMLButtonElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const flight = useRef<gsap.core.Timeline | null>(null)
  const [reading, setReading] = useState(false)
  const [flying, setFlying] = useState(false)
  const [flights, setFlights] = useState(0)
  const active = useSceneStore((state) => state.currentScene === 'goodbye')
  const reduced = useSceneStore((state) => state.reducedMotion)
  useEffect(() => {
    flight.current?.kill()
    setFlying(false)
    if (!active) setReading(false)
    if (plane.current) gsap.set(plane.current, { clearProps: 'transform,opacity' })
    return () => { flight.current?.kill() }
  }, [active, reduced])
  useEffect(() => { if (reading) closeButton.current?.focus() }, [reading])
  const closeLetter = () => { setReading(false); readButton.current?.focus() }
  const launch = () => {
    if (!plane.current || !root.current || flying) return
    setFlying(true)
    const width = root.current.clientWidth
    const height = root.current.clientHeight
    flight.current?.kill()
    const timeline = gsap.timeline({ onComplete: () => { setFlying(false); setFlights((value) => value + 1) } })
    flight.current = timeline
    if (reduced) { setReading(false); timeline.to(plane.current, { opacity: 0.45, duration: 0.18 }).to(plane.current, { opacity: 1, duration: 0.18 }); return }
    if (reading && letter.current) {
      timeline.to(letter.current, { scale: 0.15, rotation: -18, autoAlpha: 0, clipPath: 'polygon(0 50%, 100% 0, 65% 100%, 45% 65%)', duration: 0.65, ease: 'power2.inOut' })
        .call(() => setReading(false))
    }
    timeline.to(plane.current, { scale: 0.45, rotation: -16, duration: 0.45, ease: 'power2.inOut' })
      .to(plane.current, { x: -width * 0.45, y: height * 0.14, rotation: -145, duration: 1.1, ease: 'sine.inOut' })
      .to(plane.current, { x: -width * 0.62, y: -height * 0.28, rotation: -280, scale: 0.28, duration: 0.9, ease: 'sine.inOut' })
      .to(plane.current, { x: width * 0.04, y: -height * 0.32, rotation: -370, scale: 0.42, duration: 1.15, ease: 'sine.inOut' })
      .to(plane.current, { x: 0, y: 0, rotation: -360, scale: 1, duration: 1.1, ease: 'power2.out' })
      .set(plane.current, { rotation: 0 })
  }
  return <div className="paper-world" ref={root}>
    <div className="paper-editorial"><h2>Some endings<br /><em>learn to fly.</em></h2><p>Not everything stays.<br />Some stories fold themselves<br />into something lighter.</p><p>A letter to what was.<br />A small flight toward what's next.</p></div>
    <svg className="paper-route" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true"><path d="M-40 540 C180 650 620 330 420 310 C270 290 280 600 760 230" /></svg>
    <div className="paper-orbit" aria-hidden="true"><span>g</span><span>o</span><span>o</span><span>d</span><span>b</span><span>y</span><span>e</span></div>
    <button type="button" className="paper-plane" ref={plane} aria-label="Launch the paper airplane" disabled={flying || reading} onClick={launch}><svg viewBox="0 0 500 420" aria-hidden="true"><polygon points="8,170 486,8 160,232" fill="#bdc9b5" /><polygon points="160,232 486,8 183,364" fill="#93a28a" /><polygon points="183,364 218,265 486,8" fill="#4f6658" /><polygon points="218,265 486,8 342,402" fill="#ced6c3" /></svg></button>
    <div className="paper-actions"><button type="button" className="quiet-control" disabled={flying} onClick={launch}>{flying ? 'IN FLIGHT…' : flights ? 'FLY AGAIN ↗' : 'FOLD & FLY ↗'}</button><button type="button" ref={readButton} className="quiet-control" disabled={flying} onClick={() => setReading(true)}>READ THE LETTER</button><span aria-live="polite">{flights ? `${flights} small ${flights === 1 ? 'flight' : 'flights'}. A little further each time.` : 'Click the plane. Let an idea go.'}</span></div>
    {reading && <div className="paper-letter-overlay" ref={letter} onKeyDown={(event) => { if (event.key === 'Escape' && !flying) closeLetter() }}><div className="paper-letter-heading"><h3>A NOTE BEFORE YOU GO</h3><button ref={closeButton} type="button" className="quiet-control" disabled={flying} onClick={closeLetter}>CLOSE ×</button></div><FlowLetter text={siteContent.goodbye.letter} /><button type="button" className="quiet-control" disabled={flying} onClick={launch}>FOLD THIS LETTER & FLY ↗</button></div>}
  </div>
}
