import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { chronicleAssets } from '../assets/characters/chronicle/assets'
import { resolveComposition } from '../features/stack-composer/engine/composition'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useSceneStore } from '../stores/sceneStore'

gsap.registerPlugin(ScrollTrigger)

const HeroPortrait = lazy(() => import('../features/hero-portrait/HeroPortrait'))
const Composer = lazy(() => import('../features/stack-composer/components/FusionLab'))
const PretextStage = lazy(() => import('../features/pretext-stage/PretextStage'))
const DeepSeekWhaleStage = lazy(() => import('../features/pretext-stage/DeepSeekWhaleStage'))

const CIPHER_CHARS = '✳✦⬡⌁01/\\<>[]{}—+='

function scrambleElementText(el: HTMLElement, finalText: string, durationMs = 380) {
  const start = performance.now()
  const length = finalText.length
  const step = (now: number) => {
    const progress = Math.min(1, (now - start) / durationMs)
    const revealCount = Math.floor(progress * length)
    let out = ''
    for (let i = 0; i < length; i++) {
      const ch = finalText[i]
      if (ch === ' ' || i < revealCount) {
        out += ch
      } else {
        out += CIPHER_CHARS[(i + Math.floor(now / 28)) % CIPHER_CHARS.length]
      }
    }
    el.textContent = out
    if (progress < 1) requestAnimationFrame(step)
    else el.textContent = finalText
  }
  requestAnimationFrame(step)
}

const projects = [
  {
    pair: ['cpp', 'qt'],
    category: 'Tools',
    index: '01',
    description:
      'Making complex architecture visible. A visual node-graph editor and C++17 / Qt 6 code synthesis engine.',
    stack: 'C++17 · Qt 6 · Visual AST',
    art: 'blueprint',
    short: 'Blueprint',
    subtitle: 'Structure becomes possibility.',
  },
  {
    pair: ['esp32', 'vue'],
    category: 'Hardware',
    index: '02',
    description:
      'Real-time dialogue between silicon and the browser. Live ESP32 sensor telemetry streamed into a reactive Vue interface.',
    stack: 'Vue · ESP32 · Telemetry',
    art: 'monitor',
    short: 'Connected',
    subtitle: 'A bridge to the physical world.',
  },
  {
    pair: ['ai', 'typescript'],
    category: 'AI',
    index: '03',
    description:
      'A lightweight edge bridge for intelligence. Open-source PaLM API relay running on Netlify Edge Functions.',
    stack: 'TypeScript · Edge · AI Proxy',
    art: 'proxy',
    short: 'Beyond',
    subtitle: 'An open connection to intelligence.',
  },
].map(project => ({ ...project, ...resolveComposition(project.pair) }))

const interests = [
  {
    code: '01',
    title: 'Developer tools',
    cnTitle: 'Visual Architecture & Compilation',
    subtitle: 'Turning intricate systems into tactile instruments.',
    text: 'Starting from Qt 6 and C++, exploring visual node blueprints, AST inspection, and low-friction engineering workflows. Great tools disappear into the craft so you can focus entirely on what you are creating.',
    tags: 'Qt 6 · C++ · Node Graph · AST',
  },
  {
    code: '02',
    title: 'AI & agents',
    cnTitle: 'Context Orchestration & Reasoning',
    subtitle: 'Connecting context, toolchains, and autonomous decisions.',
    text: 'Investigating how AI agents perceive workspace context, invoke deterministic tools, and decompose abstract ideas into verifiable engineering steps—an ongoing, living experiment.',
    tags: 'AI Agents · TypeScript · Edge API',
  },
  {
    code: '03',
    title: 'Web & hardware',
    cnTitle: 'Creative Shaders & Physical Computing',
    subtitle: 'Ideas on screen that reach out and touch the physical world.',
    text: 'Bridging digital interfaces with physical devices through WebGL shaders, GSAP motion systems, Vue, and ESP32 telemetry—searching for new chemistry between light, physics, and silicon.',
    tags: 'WebGL · GSAP · Vue · ESP32',
  },
]

const navigation = [
  { id: 'top', code: '01', label: 'SYS.ORIGIN' },
  { id: 'work', code: '02', label: 'DIR.WORK', shortLabel: '作品' },
  { id: 'play', code: '03', label: 'LAB.ORBIT', shortLabel: '实验' },
  { id: 'about', code: '04', label: 'DIM.NOTES', shortLabel: '关于' },
  { id: 'connect', code: '05', label: 'END.SIGNAL', shortLabel: '联系' },
]

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h15m-6-6 6 6-6 6'}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function CompassStar() {
  return (
    <svg className="compass-star" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 1 L18.4 13.6 L31 16 L18.4 18.4 L16 31 L13.6 18.4 L1 16 L13.6 13.6 Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="16" cy="16" r="2.2" fill="#f04132" />
    </svg>
  )
}

function ThemeIcon({ theme }: { theme: 'dark' | 'light' }) {
  return (
    <svg className="theme-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      {theme === 'dark' ? (
        <>
          <circle cx="10" cy="10" r="4.2" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M10 2v2.2M10 15.8V18M2 10h2.2M15.8 10H18M4.3 4.3l1.6 1.6M14.1 14.1l1.6 1.6M15.7 4.3l-1.6 1.6M5.9 14.1l-1.6 1.6"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </>
      ) : (
        <path
          d="M14.8 12.6A6 6 0 0 1 7.4 5.2a6 6 0 1 0 7.4 7.4Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

function ProjectPreview({ kind }: { kind: string }) {
  const [step, setStep] = useState(0)
  const [signal, setSignal] = useState(72)
  const [hoverBar, setHoverBar] = useState(-1)
  const [prompt, setTurnPrompt] = useState('Turn a spark into reality')
  const boardRef = useRef<HTMLDivElement>(null)
  const wirePrimaryRef = useRef<SVGPathElement>(null)
  const wireSecondaryRef = useRef<SVGPathElement>(null)
  const midNodeRef = useRef<HTMLDivElement>(null)
  const proxyRef = useRef<HTMLDivElement>(null)

  if (kind === 'blueprint') {
    const mode = step % 3

    const handleBoardMove = (e: ReactPointerEvent<HTMLDivElement>) => {
      const box = boardRef.current?.getBoundingClientRect()
      if (!box) return
      const nx = Math.max(0.25, Math.min(0.75, (e.clientX - box.left) / box.width))
      const ny = Math.max(0.2, Math.min(0.82, (e.clientY - box.top) / box.height))
      const midX = Math.round(nx * 600)
      const midY = Math.round(ny * 300)
      if (midNodeRef.current) {
        midNodeRef.current.style.left = `${(nx * 100 - 10).toFixed(1)}%`
        midNodeRef.current.style.top = `${(ny * 100 - 14).toFixed(1)}%`
      }
      const d = `M135 82 C${Math.round((135 + midX) / 2)} 82 ${Math.round((135 + midX) / 2)} ${midY} ${midX} ${midY} C${Math.round((midX + 445) / 2)} ${midY} ${Math.round((midX + 445) / 2)} 65 445 65`
      wirePrimaryRef.current?.setAttribute('d', d)
      wireSecondaryRef.current?.setAttribute('d', d)
    }

    const basePaths = [
      'M135 82 C215 82 245 185 310 185 C385 185 375 65 445 65',
      'M135 82 C235 82 225 65 445 65',
      'M135 82 C250 30 340 30 445 65 M135 82 C215 198 310 198 325 198',
    ]

    return (
      <div
        className="preview-window blueprint-preview interactive-study"
        data-step={mode}
        data-cursor="INTERACT"
      >
        <div className="blueprint-board" ref={boardRef} onPointerMove={handleBoardMove}>
          <svg viewBox="0 0 600 300" aria-hidden="true">
            <path ref={wireSecondaryRef} className="wire-glow" d={basePaths[mode]} />
            <path ref={wirePrimaryRef} d={basePaths[mode]} />
          </svg>
          <div className="mini-node node-one" onClick={() => setStep(v => v + 1)}>
            <small>INPUT</small>
            <strong>Source</strong>
          </div>
          <div
            ref={midNodeRef}
            className="mini-node node-two"
            data-live={true}
            onClick={() => setStep(v => v + 1)}
          >
            <small>TRANSFORM</small>
            <strong>{mode === 0 ? 'Live Follow' : mode === 1 ? 'AST Routed' : 'Parallel'}</strong>
          </div>
          <div className="mini-node node-three" onClick={() => setStep(v => v + 1)}>
            <small>OUTPUT</small>
            <strong>Qt6 Scene ↗</strong>
          </div>
        </div>
        <div className="study-controls">
          <span>MOVE CURSOR TO BEND WIRES</span>
          <button type="button" onClick={() => setStep(value => value + 1)}>
            SWITCH ROUTE ({mode + 1}/3) ↗
          </button>
        </div>
      </div>
    )
  }

  if (kind === 'monitor') {
    const heights = [36, 62, 48, 84, 66, 98, 72, 88, 52, 78, 60, 100]
    return (
      <div className="hardware-preview interactive-study" data-cursor="SCRUB">
        <div
          className="circuit-board"
          style={{ '--chip-glow': `${signal / 100}` } as React.CSSProperties}
          onClick={() => setSignal(s => (s > 80 ? 35 : s + 25))}
        >
          <span className="chip-label">
            ESP
            <br />
            <b>32</b>
          </span>
          {Array.from({ length: 12 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
        <div className="signal-panel" onPointerLeave={() => setHoverBar(-1)}>
          <span>SIGNAL // {signal}%</span>
          <div className="signal-bars">
            {heights.map((height, index) => {
              const dist = hoverBar >= 0 ? Math.abs(hoverBar - index) : 99
              const waveBoost = dist === 0 ? 28 : dist === 1 ? 16 : dist === 2 ? 8 : 0
              const barH = Math.min(100, Math.max(10, (height * signal) / 100 + waveBoost))
              return (
                <i
                  key={index}
                  style={{ height: `${barH}%` }}
                  onPointerEnter={() => setHoverBar(index)}
                />
              )
            })}
          </div>
        </div>
        <label className="study-controls signal-control">
          <span>SIGNAL GAIN</span>
          <input
            type="range"
            min="0"
            max="100"
            value={signal}
            onChange={event => setSignal(Number(event.target.value))}
          />
          <output>{signal}%</output>
        </label>
      </div>
    )
  }

  const handleProxyMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = proxyRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const rx = ((e.clientX - rect.left) / rect.width - 0.5) * 36
    const ry = ((e.clientY - rect.top) / rect.height - 0.5) * 36
    el.style.setProperty('--ring-x', `${rx.toFixed(1)}deg`)
    el.style.setProperty('--ring-y', `${ry.toFixed(1)}deg`)
  }

  return (
    <div
      ref={proxyRef}
      className="proxy-preview interactive-study"
      data-step={step}
      data-cursor="ORBIT"
      onPointerMove={handleProxyMove}
    >
      <div className="portal-ring ring-one" />
      <div className="portal-ring ring-two" />
      <div className="portal-ring ring-three" />
      <span className="portal-label">{step ? `RELAY #0${step} CONNECTED` : 'EDGE STANDBY'}</span>
      <strong>
        {step ? 'Idea' : 'Human'} <i>×</i> {step ? 'Code' : 'AI'}
      </strong>
      <form
        className="study-controls prompt-control"
        onSubmit={event => {
          event.preventDefault()
          setStep(value => value + 1)
        }}
      >
        <div>
          <input
            id="study-prompt"
            maxLength={48}
            value={prompt}
            onChange={event => {
              setTurnPrompt(event.target.value)
              setStep(0)
            }}
            aria-label="Enter a prompt idea"
          />
          <button type="submit" disabled={!prompt.trim()} aria-label="Send to edge relay demo">
            ↗
          </button>
        </div>
        <output aria-live="polite">
          {step ? `RELAYED // ${prompt}` : 'TYPE A SPARK TO IGNITE THE ORBIT'}
        </output>
      </form>
    </div>
  )
}

function ConnectionThread({ reducedMotion }: { reducedMotion: boolean }) {
  const pathA = useRef<SVGPathElement>(null)
  const pathB = useRef<SVGPathElement>(null)
  const pathC = useRef<SVGPathElement>(null)
  const glowPath = useRef<SVGPathElement>(null)
  const surface = useRef<SVGSVGElement>(null)

  useEffect(
    () => () => {
      gsap.killTweensOf([pathA.current, pathB.current, pathC.current, glowPath.current])
    },
    [],
  )

  const bend = (clientX: number, clientY: number) => {
    if (reducedMotion || !surface.current) return
    const box = surface.current.getBoundingClientRect()
    const x = ((clientX - box.left) / box.width) * 1000
    const y = Math.max(-110, Math.min(210, ((clientY - box.top) / box.height) * 100))
    const cy = y * 2 - 50
    gsap.to([pathB.current, glowPath.current], {
      attr: { d: `M0 50 Q${x} ${cy} 1000 50` },
      duration: 0.14,
      overwrite: true,
    })
    gsap.to(pathA.current, {
      attr: { d: `M0 32 Q${x} ${cy * 0.75 + 4} 1000 32` },
      duration: 0.18,
      overwrite: true,
    })
    gsap.to(pathC.current, {
      attr: { d: `M0 68 Q${x} ${cy * 0.75 + 22} 1000 68` },
      duration: 0.22,
      overwrite: true,
    })
  }

  const release = () => {
    gsap.to([pathB.current, glowPath.current], {
      attr: { d: 'M0 50 Q500 50 1000 50' },
      duration: reducedMotion ? 0 : 1.25,
      ease: 'elastic.out(1.2, 0.22)',
      overwrite: true,
    })
    gsap.to(pathA.current, {
      attr: { d: 'M0 32 Q500 32 1000 32' },
      duration: reducedMotion ? 0 : 1.4,
      ease: 'elastic.out(1.15, 0.25)',
      overwrite: true,
    })
    gsap.to(pathC.current, {
      attr: { d: 'M0 68 Q500 68 1000 68' },
      duration: reducedMotion ? 0 : 1.55,
      ease: 'elastic.out(1.1, 0.28)',
      overwrite: true,
    })
  }

  return (
    <div className="connection-thread" aria-hidden="true" data-cursor="PLUCK">
      <svg
        ref={surface}
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        onPointerMove={event => bend(event.clientX, event.clientY)}
        onPointerLeave={release}
      >
        <path ref={glowPath} className="thread-glow" d="M0 50 Q500 50 1000 50" />
        <path ref={pathA} className="thread-harmonic" d="M0 32 Q500 32 1000 32" />
        <path ref={pathB} d="M0 50 Q500 50 1000 50" />
        <path ref={pathC} className="thread-harmonic" d="M0 68 Q500 68 1000 68" />
      </svg>
      <span>ONE CONNECTION CAN START SOMETHING // PLUCK THE CHORD</span>
    </div>
  )
}

import type { CosmosFieldMode } from '../features/hero-portrait/cosmosStage'

const BOOT_PHASES = [
  '01 // CALIBRATING PRISM SHADERS',
  '02 // DECODING STAR-RING PORTRAIT',
  '03 // SYNTHESIZING ORBITAL FIELD',
  '04 // CHRONICLE UNIVERSE ONLINE',
]

function ChroniclePreloader({
  assetReady,
  reducedMotion,
  onEnterStart,
  onComplete,
}: {
  assetReady: boolean
  reducedMotion: boolean
  onEnterStart: () => void
  onComplete: () => void
}) {
  const preloaderRef = useRef<HTMLDivElement>(null)
  const astrolabeRef = useRef<HTMLDivElement>(null)
  const telemetryRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const hexRef = useRef<HTMLSpanElement>(null)
  const statusRef = useRef<HTMLParagraphElement>(null)
  const arcRef = useRef<SVGCircleElement>(null)
  const orbitDotRef = useRef<SVGCircleElement>(null)
  const starCoreRef = useRef<SVGGElement>(null)
  const barFillRef = useRef<HTMLSpanElement>(null)

  const assetReadyRef = useRef(assetReady)
  assetReadyRef.current = assetReady
  const exitingRef = useRef(false)

  const triggerExit = useCallback(() => {
    if (exitingRef.current) return
    exitingRef.current = true

    const rootEl = preloaderRef.current
    if (rootEl) rootEl.setAttribute('data-complete', 'true')
    if (counterRef.current) counterRef.current.textContent = '100'
    if (hexRef.current) hexRef.current.textContent = '0x64 // READY'
    if (statusRef.current) statusRef.current.textContent = BOOT_PHASES[3]
    if (arcRef.current) arcRef.current.style.strokeDashoffset = '0'
    if (barFillRef.current) barFillRef.current.style.transform = 'scaleX(1)'

    onEnterStart()

    if (reducedMotion || !rootEl) {
      onComplete()
      return
    }

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete()
      },
    })

    if (astrolabeRef.current) {
      tl.to(
        astrolabeRef.current,
        {
          scale: 2.35,
          opacity: 0,
          filter: 'blur(16px)',
          duration: 0.88,
          ease: 'expo.inOut',
        },
        0.08,
      )
    }
    if (telemetryRef.current) {
      tl.to(
        telemetryRef.current,
        {
          y: 26,
          opacity: 0,
          filter: 'blur(8px)',
          duration: 0.62,
          ease: 'power3.inOut',
        },
        0.04,
      )
    }
    tl.to(
      rootEl,
      {
        opacity: 0,
        duration: 0.88,
        ease: 'power3.inOut',
      },
      0.16,
    )
  }, [onComplete, onEnterStart, reducedMotion])

  useEffect(() => {
    const img = new Image()
    img.src = chronicleAssets.portrait
    let imgLoaded = false
    img.onload = () => {
      imgLoaded = true
    }
    img.onerror = () => {
      imgLoaded = true
    }

    const startTime = performance.now()
    const minDuration = reducedMotion ? 320 : 1380
    const maxWait = 2500
    let displayProgress = 0
    let lastPhase = -1
    let rafId = 0

    const circumference = 2 * Math.PI * 96

    const tick = (now: number) => {
      if (exitingRef.current) return
      const elapsed = now - startTime
      const isReady = assetReadyRef.current || imgLoaded || elapsed > maxWait
      const timeProgress = Math.min(1, elapsed / minDuration)
      const target = isReady ? timeProgress : Math.min(0.88, timeProgress * 0.9)
      displayProgress += (target - displayProgress) * (reducedMotion ? 0.45 : 0.14)

      if (isReady && timeProgress >= 1 && displayProgress > 0.988) {
        displayProgress = 1
      }

      const pct = Math.min(100, Math.round(displayProgress * 100))
      if (counterRef.current) {
        counterRef.current.textContent = String(pct).padStart(2, '0')
      }
      if (hexRef.current) {
        hexRef.current.textContent = `0x${pct.toString(16).toUpperCase().padStart(2, '0')} // 0x64`
      }
      if (arcRef.current) {
        const offset = circumference * (1 - displayProgress)
        arcRef.current.style.strokeDashoffset = offset.toFixed(2)
      }
      if (barFillRef.current) {
        barFillRef.current.style.transform = `scaleX(${displayProgress.toFixed(4)})`
      }
      if (orbitDotRef.current) {
        const angle = displayProgress * Math.PI * 2 - Math.PI / 2
        const ox = 140 + Math.cos(angle) * 112
        const oy = 140 + Math.sin(angle) * 42
        orbitDotRef.current.setAttribute('cx', ox.toFixed(2))
        orbitDotRef.current.setAttribute('cy', oy.toFixed(2))
      }
      if (starCoreRef.current) {
        starCoreRef.current.style.transform = `rotate(${(displayProgress * 180).toFixed(1)}deg) scale(${(0.9 + displayProgress * 0.18).toFixed(3)})`
      }

      const phaseIndex = pct < 30 ? 0 : pct < 66 ? 1 : pct < 94 ? 2 : 3
      if (phaseIndex !== lastPhase && statusRef.current) {
        lastPhase = phaseIndex
        scrambleElementText(statusRef.current, BOOT_PHASES[phaseIndex], 260)
      }

      if (displayProgress >= 1) {
        triggerExit()
        return
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [reducedMotion, triggerExit])

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !preloaderRef.current) return
    const nx = (e.clientX / window.innerWidth - 0.5) * 2
    const ny = (e.clientY / window.innerHeight - 0.5) * 2
    preloaderRef.current.style.setProperty('--loader-rx', `${(-ny * 10).toFixed(2)}deg`)
    preloaderRef.current.style.setProperty('--loader-ry', `${(nx * 12).toFixed(2)}deg`)
    preloaderRef.current.style.setProperty('--loader-gx', `${(50 + nx * 16).toFixed(1)}%`)
    preloaderRef.current.style.setProperty('--loader-gy', `${(50 + ny * 16).toFixed(1)}%`)
  }

  return (
    <div
      ref={preloaderRef}
      className="chronicle-preloader"
      role="status"
      aria-live="polite"
      aria-label="Loading CHRONICLE"
      onPointerMove={handlePointerMove}
    >
      <div className="preloader-aura" aria-hidden="true" />

      <div ref={astrolabeRef} className="preloader-astrolabe">
        <svg className="preloader-svg" viewBox="0 0 280 280" fill="none" aria-hidden="true">
          <circle
            className="preloader-ring-ticks"
            cx="140"
            cy="140"
            r="122"
            stroke="rgba(242, 236, 228, 0.14)"
            strokeWidth="1"
            strokeDasharray="2 10"
          />
          <circle
            cx="140"
            cy="140"
            r="96"
            stroke="rgba(242, 236, 228, 0.08)"
            strokeWidth="1.2"
          />
          <circle
            ref={arcRef}
            className="preloader-ring-progress"
            cx="140"
            cy="140"
            r="96"
            stroke="#f04132"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="603.19"
            strokeDashoffset="603.19"
            transform="rotate(-90 140 140)"
          />
          <g transform="rotate(-26 140 140)">
            <ellipse
              cx="140"
              cy="140"
              rx="112"
              ry="42"
              stroke="rgba(240, 65, 50, 0.34)"
              strokeWidth="1"
              strokeDasharray="6 6"
            />
            <circle
              ref={orbitDotRef}
              cx="140"
              cy="98"
              r="3.2"
              fill="#ff7b6b"
              className="preloader-orbit-spark"
            />
          </g>
          <circle
            className="preloader-ring-inner"
            cx="140"
            cy="140"
            r="68"
            stroke="rgba(242, 236, 228, 0.12)"
            strokeWidth="1"
            strokeDasharray="44 18"
          />
          <g ref={starCoreRef} className="preloader-star-core">
            <path
              d="M140 118 L143.2 136.8 L162 140 L143.2 143.2 L140 162 L136.8 143.2 L118 140 L136.8 136.8 Z"
              stroke="rgba(242, 236, 228, 0.35)"
              strokeWidth="1"
            />
          </g>
        </svg>

        <div className="preloader-counter-stage">
          <div className="preloader-digits">
            <span ref={counterRef} className="preloader-number">
              00
            </span>
            <em className="preloader-percent">%</em>
          </div>
          <span ref={hexRef} className="preloader-hex">
            0x00 // 0x64
          </span>
        </div>
      </div>

      <div ref={telemetryRef} className="preloader-telemetry">
        <div className="preloader-brand">
          <i>✦</i>
          <span>C H R O N I C L E</span>
          <i>✦</i>
        </div>
        <p ref={statusRef} className="preloader-status">
          {BOOT_PHASES[0]}
        </p>
        <div className="preloader-bar-track" aria-hidden="true">
          <span ref={barFillRef} className="preloader-bar-fill" />
        </div>
        <button
          type="button"
          className="preloader-skip"
          onClick={triggerExit}
          data-cursor="ENTER"
        >
          <span>[SKIP // ENTER NOW ↗]</span>
        </button>
      </div>
    </div>
  )
}

export function OnePage() {
  const root = useRef<HTMLDivElement>(null)
  const clockRef = useRef<HTMLSpanElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)
  const cursorLabelRef = useRef<HTMLSpanElement>(null)

  const reducedMotion = useReducedMotion()
  const [active, setActive] = useState('top')
  const [filter, setFilter] = useState('All')
  const [interest, setInterest] = useState(0)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [cosmosMode, setCosmosMode] = useState<CosmosFieldMode>('attract')
  const [pulseSignal, setPulseSignal] = useState(0)
  const [overdrive, setOverdrive] = useState(false)
  const [portraitReady, setPortraitReady] = useState(false)
  const [entered, setEntered] = useState(false)
  const [loaderMounted, setLoaderMounted] = useState(true)
  const lockReadoutRef = useRef<HTMLSpanElement>(null)
  const overdriveMeterRef = useRef<HTMLSpanElement>(null)
  const whisperRef = useRef<HTMLDivElement>(null)
  const overdriveRef = useRef(overdrive)
  overdriveRef.current = overdrive
  const kineticEnergyRef = useRef(0)
  const overdriveTimerRef = useRef(0)

  const handleKineticSpike = useCallback((amount: number) => {
    kineticEnergyRef.current = Math.min(100, kineticEnergyRef.current + amount)
    if (kineticEnergyRef.current >= 100 && !overdriveRef.current) {
      overdriveRef.current = true
      overdriveTimerRef.current = 4.2
      setOverdrive(true)
      setPulseSignal(v => v + 1)
    }
  }, [])

  const handleWhisperMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const el = whisperRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--lens-x', `${(e.clientX - rect.left).toFixed(1)}px`)
      el.style.setProperty('--lens-y', `${(e.clientY - rect.top).toFixed(1)}px`)
      handleKineticSpike(1.6)
    },
    [handleKineticSpike],
  )

  const handlePortraitReady = useCallback(() => {
    setPortraitReady(true)
  }, [])

  const handleLockDistance = useCallback((px: number) => {
    if (lockReadoutRef.current) {
      lockReadoutRef.current.textContent = `LOCK // ${px}PX`
    }
  }, [])

  const handleEnterStart = useCallback(() => {
    setEntered(true)
  }, [])

  const handleLoaderComplete = useCallback(() => {
    setLoaderMounted(false)
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if (!entered) {
      document.documentElement.dataset.loading = 'true'
    } else {
      delete document.documentElement.dataset.loading
    }
    return () => {
      delete document.documentElement.dataset.loading
    }
  }, [entered])

  useEffect(() => {
    useSceneStore.getState().setReducedMotion(reducedMotion)
  }, [reducedMotion])

  // Live millisecond telemetry clock
  useEffect(() => {
    const updateClock = () => {
      if (!clockRef.current) return
      const now = new Date()
      const timeStr =
        now.toLocaleTimeString('en-US', { hour12: false }) +
        '.' +
        Math.floor(now.getMilliseconds() / 100)
      clockRef.current.textContent = `T: ${timeStr}`
    }
    updateClock()
    const timer = window.setInterval(updateClock, 100)
    return () => window.clearInterval(timer)
  }, [])

  // 60fps Two-Way Magnetic Cursor Snapping + Adaptive Morph + 3D Tilt + Cipher Scramble
  useEffect(() => {
    if (reducedMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const host = root.current
    if (!host) return

    const context = gsap.context(() => {}, host)
    const dispose: (() => void)[] = []

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const dot = { x: pointer.x, y: pointer.y, targetX: pointer.x, targetY: pointer.y, scale: 1, targetScale: 1 }
    const ring = {
      x: pointer.x,
      y: pointer.y,
      targetX: pointer.x,
      targetY: pointer.y,
      w: 38,
      h: 38,
      targetW: 38,
      targetH: 38,
      lastAppliedW: 38,
      lastAppliedH: 38,
    }

    const magQuickMap = new Map<
      HTMLElement,
      { xTo: gsap.QuickToFunc; yTo: gsap.QuickToFunc }
    >()

    const getMagQuick = (el: HTMLElement) => {
      let entry = magQuickMap.get(el)
      if (!entry) {
        context.add(() => {
          entry = {
            xTo: gsap.quickTo(el, 'x', { duration: 0.36, ease: 'power3.out' }),
            yTo: gsap.quickTo(el, 'y', { duration: 0.36, ease: 'power3.out' }),
          }
        })
        if (entry) magQuickMap.set(el, entry)
      }
      return entry
    }

    let activeMagEl: HTMLElement | null = null
    let activeMagBaseRect: { cx: number; cy: number; w: number; h: number } | null = null

    const releaseActiveMag = () => {
      if (!activeMagEl) return
      const q = magQuickMap.get(activeMagEl)
      if (q) {
        q.xTo(0)
        q.yTo(0)
      }
      activeMagEl.removeAttribute('data-magnet-locked')
      activeMagEl = null
      activeMagBaseRect = null
    }

    const MAGNETIC_SELECTOR =
      'a, button, summary, [data-magnetic], .mini-node, .circuit-board, .fusion-core, .pretext-hull-magnet'
    const PROXIMITY_GROUP_SELECTOR =
      '.site-header, .cosmos-hud, .chapter-rail, .filter-list, .ds-companion-whisper-nav, .portrait-actions, .study-controls, .footer-reveal, .about-header-row, .connect-bottom, .blueprint-board'

    const resolveMagneticCandidate = (
      rawTarget: Element | null,
      px: number,
      py: number,
    ): HTMLElement | null => {
      if (!rawTarget) return null

      // Special handling for wide accordion buttons or giant connect link
      const connectMain = rawTarget.closest<HTMLElement>('.connect-main')
      if (connectMain) {
        const arrow = connectMain.querySelector<HTMLElement>('.connect-arrow')
        if (arrow) return arrow
      }

      const interestBtn = rawTarget.closest<HTMLElement>('.interest h3 button')
      if (interestBtn) {
        const plus = interestBtn.querySelector<HTMLElement>('.interest-plus')
        if (plus) return plus
      }

      const direct = rawTarget.closest<HTMLElement>(MAGNETIC_SELECTOR)
      if (direct && !(direct as HTMLButtonElement).disabled) {
        return direct
      }

      // Proximity field capture (within 32px inside interactive bars/groups)
      const group = rawTarget.closest<HTMLElement>(PROXIMITY_GROUP_SELECTOR)
      if (group) {
        const candidates = group.querySelectorAll<HTMLElement>(
          'a, button:not(:disabled), [data-magnetic], .mini-node',
        )
        let bestEl: HTMLElement | null = null
        let bestDist = 32
        for (let i = 0; i < candidates.length; i++) {
          const el = candidates[i]!
          const r = el.getBoundingClientRect()
          if (r.width === 0 || r.height === 0 || r.width > 310) continue
          const dx = px < r.left ? r.left - px : px > r.right ? px - r.right : 0
          const dy = py < r.top ? r.top - py : py > r.bottom ? py - r.bottom : 0
          const dist = Math.hypot(dx, dy)
          if (dist < bestDist) {
            bestDist = dist
            bestEl = el
          }
        }
        if (bestEl) return bestEl
      }

      return null
    }

    const onGlobalMove = (e: PointerEvent) => {
      const px = e.clientX
      const py = e.clientY
      pointer.x = px
      pointer.y = py

      const target = e.target instanceof Element ? e.target : null
      const cursorHost = target?.closest<HTMLElement>('[data-cursor]')
      const magCandidate = resolveMagneticCandidate(target, px, py)

      if (magCandidate) {
        if (magCandidate !== activeMagEl) {
          releaseActiveMag()
          const r = magCandidate.getBoundingClientRect()
          if (r.width > 0 && r.width <= 320 && r.height <= 190) {
            activeMagEl = magCandidate
            activeMagBaseRect = {
              cx: r.left + r.width * 0.5,
              cy: r.top + r.height * 0.5,
              w: r.width,
              h: r.height,
            }
            activeMagEl.setAttribute('data-magnet-locked', 'true')
          }
        }
      } else if (activeMagEl) {
        // Keep magnetic lock briefly if still within 24px of the locked control's rest box
        const b = activeMagBaseRect
        if (b) {
          const halfW = b.w * 0.5 + 22
          const halfH = b.h * 0.5 + 18
          if (Math.abs(px - b.cx) > halfW || Math.abs(py - b.cy) > halfH) {
            releaseActiveMag()
          }
        } else {
          releaseActiveMag()
        }
      }

      if (activeMagEl && activeMagBaseRect) {
        const { cx, cy, w, h } = activeMagBaseRect
        const isOrbOrStageNode =
          activeMagEl.classList.contains('fusion-core') ||
          activeMagEl.classList.contains('pretext-hull-magnet') ||
          activeMagEl.hasAttribute('data-no-element-pull')

        // Pull the cursor ring and dot magnetically toward the control's center
        ring.targetX = cx + (px - cx) * 0.22
        ring.targetY = cy + (py - cy) * 0.22
        dot.targetX = px + (cx - px) * 0.32
        dot.targetY = py + (cy - py) * 0.32
        dot.targetScale = 1.45

        if (cursorHost && cursorHost.dataset.cursor) {
          ring.targetW = Math.max(72, Math.min(148, w + 18))
          ring.targetH = Math.max(72, Math.min(148, h + 18))
          if (cursorLabelRef.current) {
            cursorLabelRef.current.textContent = cursorHost.dataset.cursor
          }
          cursorRingRef.current?.setAttribute('data-labeled', 'true')
          cursorRingRef.current?.setAttribute('data-snapped', 'true')
        } else {
          ring.targetW = Math.min(260, Math.max(38, w + 18))
          ring.targetH = Math.min(96, Math.max(30, h + 10))
          if (cursorLabelRef.current) cursorLabelRef.current.textContent = ''
          cursorRingRef.current?.setAttribute('data-labeled', 'false')
          cursorRingRef.current?.setAttribute('data-snapped', 'true')
        }

        // Pull the DOM element itself toward the pointer (Two-Way Magnetism)
        if (!isOrbOrStageNode) {
          const q = getMagQuick(activeMagEl)
          if (q) {
            const maxPullX = Math.min(15, Math.max(6, w * 0.22))
            const maxPullY = Math.min(11, Math.max(5, h * 0.28))
            const elDx = Math.max(-maxPullX, Math.min(maxPullX, (px - cx) * 0.34))
            const elDy = Math.max(-maxPullY, Math.min(maxPullY, (py - cy) * 0.34))
            q.xTo(elDx)
            q.yTo(elDy)
          }
        }
      } else {
        ring.targetX = px
        ring.targetY = py
        dot.targetX = px
        dot.targetY = py
        dot.targetScale = 1
        cursorRingRef.current?.setAttribute('data-snapped', 'false')

        if (cursorHost && cursorHost.dataset.cursor) {
          ring.targetW = 74
          ring.targetH = 74
          if (cursorLabelRef.current) {
            cursorLabelRef.current.textContent = cursorHost.dataset.cursor
          }
          cursorRingRef.current?.setAttribute('data-labeled', 'true')
        } else {
          ring.targetW = 38
          ring.targetH = 38
          if (cursorLabelRef.current) cursorLabelRef.current.textContent = ''
          cursorRingRef.current?.setAttribute('data-labeled', 'false')
        }
      }
    }

    const onGlobalScroll = () => {
      if (activeMagEl) {
        releaseActiveMag()
        ring.targetX = pointer.x
        ring.targetY = pointer.y
        ring.targetW = 38
        ring.targetH = 38
        dot.targetX = pointer.x
        dot.targetY = pointer.y
        dot.targetScale = 1
        cursorRingRef.current?.setAttribute('data-snapped', 'false')
      }
    }

    let prevT = performance.now() / 1000
    let prevScrollY = window.scrollY
    let smoothScrollVel = 0
    let wasRest = true

    const tickCursor = (nowSec: number) => {
      const dt = Math.min(0.04, Math.max(0.001, nowSec - prevT))
      prevT = nowSec
      const posLerp = 1 - Math.exp(-dt * 18)
      const sizeLerp = 1 - Math.exp(-dt * 16)
      const dotLerp = 1 - Math.exp(-dt * 24)

      dot.x += (dot.targetX - dot.x) * dotLerp
      dot.y += (dot.targetY - dot.y) * dotLerp
      dot.scale += (dot.targetScale - dot.scale) * sizeLerp

      ring.x += (ring.targetX - ring.x) * posLerp
      ring.y += (ring.targetY - ring.y) * posLerp
      ring.w += (ring.targetW - ring.w) * sizeLerp
      ring.h += (ring.targetH - ring.h) * sizeLerp

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${dot.x.toFixed(1)}px, ${dot.y.toFixed(1)}px, 0) scale(${dot.scale.toFixed(2)})`
      }
      if (cursorRingRef.current) {
        if (
          Math.abs(ring.w - ring.lastAppliedW) > 0.15 ||
          Math.abs(ring.h - ring.lastAppliedH) > 0.15
        ) {
          ring.lastAppliedW = ring.w
          ring.lastAppliedH = ring.h
          cursorRingRef.current.style.width = `${ring.w.toFixed(1)}px`
          cursorRingRef.current.style.height = `${ring.h.toFixed(1)}px`
        }
        cursorRingRef.current.style.transform = `translate3d(${(ring.x - ring.w * 0.5).toFixed(1)}px, ${(ring.y - ring.h * 0.5).toFixed(1)}px, 0)`
      }

      // Automatic Kinetic Overdrive Threshold & Zero-Idle-Cost Scroll Skew
      const currentScrollY = window.scrollY
      const rawScrollDelta = (currentScrollY - prevScrollY) / Math.max(0.008, dt)
      prevScrollY = currentScrollY
      smoothScrollVel += (rawScrollDelta - smoothScrollVel) * (1 - Math.exp(-dt * 12))
      const absScrollSpeed = Math.abs(smoothScrollVel)

      if (overdriveRef.current) {
        overdriveTimerRef.current -= dt
        kineticEnergyRef.current = Math.max(0, (overdriveTimerRef.current / 4.2) * 100)
        if (overdriveTimerRef.current <= 0) {
          overdriveRef.current = false
          kineticEnergyRef.current = 0
          setOverdrive(false)
        }
      } else {
        if (absScrollSpeed > 850) {
          kineticEnergyRef.current = Math.min(
            100,
            kineticEnergyRef.current + ((absScrollSpeed - 850) / 1400) * dt * 135,
          )
        } else {
          kineticEnergyRef.current = Math.max(0, kineticEnergyRef.current - dt * 18)
        }

        if (kineticEnergyRef.current >= 100) {
          overdriveRef.current = true
          overdriveTimerRef.current = 4.2
          setOverdrive(true)
          setPulseSignal(v => v + 1)
        }
      }

      if (overdriveMeterRef.current) {
        const pct = Math.round(kineticEnergyRef.current)
        const nextText = overdriveRef.current
          ? `⚡ OVERDRIVE // ${pct}%`
          : `KINETIC // ${String(pct).padStart(2, '0')}%`
        if (overdriveMeterRef.current.textContent !== nextText) {
          overdriveMeterRef.current.textContent = nextText
        }
      }

      const isMoving = absScrollSpeed > 12 || overdriveRef.current
      if (isMoving) {
        wasRest = false
        const skewDeg = Math.max(-3.6, Math.min(3.6, smoothScrollVel * 0.0012))
        const chromaPx = Math.min(
          6.5,
          (overdriveRef.current ? 3.2 : 0) + absScrollSpeed * 0.0016,
        )
        host.style.setProperty('--scroll-skew', `${skewDeg.toFixed(2)}deg`)
        host.style.setProperty('--chroma-shift', `${chromaPx.toFixed(2)}px`)
      } else if (!wasRest) {
        wasRest = true
        host.style.setProperty('--scroll-skew', '0deg')
        host.style.setProperty('--chroma-shift', '0px')
      }
    }

    window.addEventListener('pointermove', onGlobalMove, { passive: true })
    window.addEventListener('scroll', onGlobalScroll, { passive: true })
    gsap.ticker.add(tickCursor)
    dispose.push(() => {
      releaseActiveMag()
      window.removeEventListener('pointermove', onGlobalMove)
      window.removeEventListener('scroll', onGlobalScroll)
      gsap.ticker.remove(tickCursor)
    })

    const cards = host.querySelectorAll<HTMLElement>('.project-card')
    cards.forEach(card => {
      const artwork = card.querySelector<HTMLElement>('.project-art')
      if (!artwork) return
      context.add(() => {
        const tiltX = gsap.quickTo(artwork, 'rotationX', { duration: 0.45, ease: 'power3.out' })
        const tiltY = gsap.quickTo(artwork, 'rotationY', { duration: 0.45, ease: 'power3.out' })
        gsap.set(artwork, { transformPerspective: 960, transformOrigin: '50% 50%' })
        const move = (event: PointerEvent) => {
          const bounds = card.getBoundingClientRect()
          const rx = (event.clientX - bounds.left) / bounds.width
          const ry = (event.clientY - bounds.top) / bounds.height
          tiltX(-(ry - 0.5) * 7)
          tiltY((rx - 0.5) * 9)
          const angle = Math.atan2(ry - 0.5, rx - 0.5) * (180 / Math.PI) + 135
          card.style.setProperty('--glare-x', `${(rx * 100).toFixed(1)}%`)
          card.style.setProperty('--glare-y', `${(ry * 100).toFixed(1)}%`)
          card.style.setProperty('--prism-angle', `${angle.toFixed(1)}deg`)
        }
        const reset = () => {
          tiltX(0)
          tiltY(0)
        }
        card.addEventListener('pointermove', move)
        card.addEventListener('pointerleave', reset)
        card.addEventListener('focusin', reset)
        dispose.push(() => {
          card.removeEventListener('pointermove', move)
          card.removeEventListener('pointerleave', reset)
          card.removeEventListener('focusin', reset)
        })
      })
    })

    const scrambles = host.querySelectorAll<HTMLElement>('[data-scramble]')
    scrambles.forEach(el => {
      const original = el.dataset.scramble || el.textContent || ''
      const onEnter = () => scrambleElementText(el, original, 340)
      el.addEventListener('pointerenter', onEnter)
      dispose.push(() => el.removeEventListener('pointerenter', onEnter))
    })

    return () => {
      dispose.forEach(cleanup => cleanup())
      context.revert()
    }
  }, [filter, reducedMotion])

  // Seamless Scroll Transitions, Ghost Whisper Drift & Bidirectional Blur-Reveals
  useEffect(() => {
    const surface = root.current
    if (!surface) return

    const context = gsap.context(() => {
      if (reducedMotion) return

      gsap.fromTo(
        '.ambient-whisper-track',
        { xPercent: 8 },
        {
          xPercent: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: '.ambient-whisper',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        },
      )
    }, surface)

    const revealObserver = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            const scrambleTarget = entry.target.querySelector<HTMLElement>('[data-scramble]')
            if (
              scrambleTarget &&
              scrambleTarget.dataset.scramble &&
              !entry.target.hasAttribute('data-scrambled')
            ) {
              entry.target.setAttribute('data-scrambled', 'true')
              scrambleElementText(scrambleTarget, scrambleTarget.dataset.scramble, 480)
            }
          } else if (entry.boundingClientRect.top > window.innerHeight * 0.85) {
            entry.target.classList.remove('is-visible')
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )
    surface
      .querySelectorAll('[data-reveal], .reveal-left, .reveal-right, .reveal-scale')
      .forEach(element => revealObserver.observe(element))

    const sections = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-15% 0px -50% 0px' },
    )
    surface.querySelectorAll('[data-nav-section]').forEach(element => sections.observe(element))

    return () => {
      revealObserver.disconnect()
      sections.disconnect()
      context.revert()
    }
  }, [filter, reducedMotion])

  useEffect(() => {
    if (!entered || reducedMotion) return
    const host = root.current
    if (!host) return
    const kicker = host.querySelector<HTMLElement>('.portrait-kicker')
    if (kicker && kicker.dataset.scramble) {
      scrambleElementText(kicker, kicker.dataset.scramble, 620)
    }
  }, [entered, reducedMotion])

  const visibleProjects = projects.filter(
    project => filter === 'All' || project.category === filter,
  )

  return (
    <div
      className="folio"
      ref={root}
      data-entered={entered}
      data-theme={theme}
      data-overdrive={overdrive}
    >
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {/* Custom 60fps Inertia Cursor Follower */}
      <div className="cursor-dot" ref={cursorDotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={cursorRingRef} aria-hidden="true">
        <span ref={cursorLabelRef} />
      </div>

      {/* Crimson Star-Ring Astrolabe Preloader & Entry Ceremony */}
      {loaderMounted && (
        <ChroniclePreloader
          assetReady={portraitReady}
          reducedMotion={reducedMotion}
          onEnterStart={handleEnterStart}
          onComplete={handleLoaderComplete}
        />
      )}

      {/* Single Full-Site Three.js WebGL Stage (Hero Shader Portrait + Chapters 01–04 3D Cosmos) */}
      <div
        id="site-webgl-stage"
        className="site-webgl-stage"
        data-ready={portraitReady}
        aria-hidden="true"
      />

      {/* Three.js 3D Background Field Controller Pill (Visible after Hero Section) */}
      {!reducedMotion && (
        <div
          className="cosmos-hud"
          data-visible={active !== 'top'}
          role="group"
          aria-label="Three.js 3D background field controls"
        >
          <span className="cosmos-hud-label">3D FIELD //</span>
          {(['attract', 'repel', 'vortex'] as CosmosFieldMode[]).map(m => (
            <button
              key={m}
              type="button"
              className="cosmos-hud-btn"
              aria-pressed={cosmosMode === m}
              onClick={() => setCosmosMode(m)}
            >
              {m.toUpperCase()}
            </button>
          ))}
          <button
            type="button"
            className="cosmos-hud-btn cosmos-pulse-btn"
            onClick={() => {
              setPulseSignal(v => v + 1)
              handleKineticSpike(55)
            }}
          >
            PULSE ✦
          </button>
          <span
            ref={overdriveMeterRef}
            className="cosmos-hud-readout cosmos-kinetic-meter"
            data-overdrive={overdrive}
            aria-hidden="true"
          >
            KINETIC // 00%
          </span>
          <span ref={lockReadoutRef} className="cosmos-hud-readout" aria-hidden="true">
            LOCK // --PX
          </span>
        </div>
      )}

      {/* Floating Glass HUD Header */}
      <header className="site-header">
        <a className="brand" href="#top" aria-label="CHRONICLE Home" data-magnetic>
          <CompassStar />
          <span className="brand-name" data-scramble="CHRONICLE">
            CHRONICLE
          </span>
        </a>

        <nav aria-label="Primary navigation">
          {navigation.slice(1).map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-magnetic
              aria-current={active === item.id ? 'location' : undefined}
            >
              <small>{item.code}</small>
              <span className="nav-full-label" data-scramble={item.label}>{item.label}</span><span className="nav-short-label" aria-hidden="true">{item.shortLabel}</span>
            </a>
          ))}
        </nav>

        <div className="header-telemetry">
          <span ref={clockRef} className="header-clock" aria-hidden="true">
            T: 00:00:00.0
          </span>
          <button
            type="button"
            className="theme-toggle"
            data-magnetic
            data-cursor="THEME"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
          >
            <ThemeIcon theme={theme} />
            <span>{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
          </button>
          <a className="header-contact" href="#connect" data-magnetic>
            <span>[CONNECT]</span>
            <Arrow diagonal />
          </a>
        </div>
      </header>

      {/* Right Fixed Telemetry Chapter Rail */}
      <aside className="chapter-rail" aria-label="Chapter progress navigation">
        <div className="chapter-rail-track" aria-hidden="true" />
        {navigation.map(item => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="chapter-rail-node"
            data-active={active === item.id}
            aria-label={`Jump to chapter ${item.code} ${item.label}`}
          >
            <i />
            <span>{item.code}</span>
          </a>
        ))}
      </aside>

      <main id="main" tabIndex={-1}>
        {/* Chapter 00: Sticky WebGL Shader Portrait Hero with Seamless Bottom Feather */}
        <div className="portrait-sequence">
          <section
            className="hero portrait-hero"
            id="top"
            data-nav-section
            aria-labelledby="hero-title"
          >
            <Suspense fallback={<div className="portrait-placeholder" aria-hidden="true" />}>
              <HeroPortrait
                reducedMotion={reducedMotion}
                entered={entered}
                theme={theme}
                cosmosMode={cosmosMode}
                pulseSignal={pulseSignal}
                overdrive={overdrive}
                onReady={handlePortraitReady}
                onLockDistance={handleLockDistance}
              />
            </Suspense>

            <div className="portrait-intro wrap">
              <p className="hero-edition"><span /> CHRONICLE — A PERSONAL UNIVERSE</p>
              <h1 id="hero-title" className="hero-statement" aria-label="Ideas take shape.">
                <span className="hero-title-line">Ideas</span>
                <span className="hero-title-line">take <i>✳</i></span>
                <span className="hero-title-line"><em>shape.</em></span>
              </h1>
              <div className="hero-story"><span className="hero-story-rule" /><p>在代码与想象之间，<br />让每一个念头，有形可见。<small>DEVELOPER · BUILDER · EXPLORER</small></p></div>
              <div className="hero-entry-links"><a className="hero-explore" href="#work" data-magnetic><span>探索我的作品</span><b aria-hidden="true">↗</b></a><a className="hero-lab-link" href="#play">或者，创造一种可能 <span aria-hidden="true">↗</span></a></div>
            </div>
            <div className="hero-edge-note" aria-hidden="true"><span>NOTHING STARTS WHOLE.</span><span>EVERYTHING STARTS SOMEWHERE.</span></div>

            <div className="portrait-transition-copy">
              <span>EVERYTHING BEGINS WITH</span>
              <strong>a fragment.</strong>
              <p>Assembling fragments into new worlds.</p>
            </div>
          </section>
        </div>

        {/* Interactive X-Ray Spotlight Lens (Charges Kinetic Overdrive on Sweep) */}
        <div
          ref={whisperRef}
          className="ambient-whisper"
          data-overdrive={overdrive}
          data-cursor={overdrive ? 'WARP ACTIVE ⚡' : 'X-RAY LENS'}
          onPointerMove={handleWhisperMove}
          aria-hidden="true"
        >
          <div className="ambient-whisper-track ambient-whisper-base">
            <span>build things</span>
            <i>✦</i>
            <span>break patterns</span>
            <i>✦</i>
            <span>stay curious</span>
            <i>✦</i>
            <span>explore worlds</span>
          </div>
          <div className="ambient-whisper-track ambient-whisper-xray">
            <span>build things</span>
            <i>✦</i>
            <span>break patterns</span>
            <i>✦</i>
            <span>stay curious</span>
            <i>✦</i>
            <span>explore worlds</span>
          </div>
          <span className="whisper-lens-badge">
            {overdrive
              ? '⚡ RELATIVISTIC OVERDRIVE TRIGGERED // KINETIC THRESHOLD REACHED'
              : 'X-RAY CHROMATIC LENS // FAST SCROLL OR HIGH ENERGY IGNITES OVERDRIVE ⚡'}
          </span>
        </div>

        {/* Chapter 01: Selected Work — Asymmetric Borderless Floating Showcase */}
        <section
          id="work"
          className="work-section wrap"
          data-nav-section
          aria-labelledby="work-title"
        >
          <div className="section-top" data-reveal>
            <span className="section-index" data-scramble="01 // SELECTED OBSESSIONS">
              01 // SELECTED OBSESSIONS
            </span>
            <span>FROM SPARK TO TANGIBLE CRAFT</span>
          </div>

          <div className="section-heading" data-reveal>
            <h2 id="work-title">
              Selected <em>obsessions.</em>
            </h2>
            <div className="filter-list" role="group" aria-label="Filter projects">
              {['All', 'Tools', 'Hardware', 'AI'].map(item => (
                <button
                  type="button"
                  key={item}
                  data-magnetic
                  aria-pressed={filter === item}
                  onClick={() => setFilter(item)}
                >
                  {item === 'All' ? 'ALL' : item.toUpperCase()}
                  <span>{item === 'All' ? '03' : '01'}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="project-stream" data-filter={filter}>
            {visibleProjects.map((project, idx) => (
              <article
                className={`project-card ${project.art} ${idx % 2 === 1 ? 'is-reversed' : ''}`}
                key={project.key}
              >
                <div className="project-art-stage reveal-left">
                  <div className="project-art">
                    <div className="project-art-header">
                      <span className="project-art-label">{project.stack}</span>
                      <span className="project-art-index">0x0{project.index}</span>
                    </div>
                    <ProjectPreview kind={project.art} />
                    <span className="project-cover-title" aria-hidden="true">
                      {project.short}
                      <i>.</i>
                    </span>
                  </div>
                </div>

                <div className="project-info reveal-right">
                  <div className="project-meta">
                    <span>&gt; {project.category.toUpperCase()} // OPEN_SOURCE</span>
                    <i>{project.subtitle}</i>
                  </div>
                  <h3>
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="GITHUB ↗"
                    >
                      <span data-scramble={project.label}>{project.label}</span>
                      <em className="hover-connect">[EXPLORE ↗]</em>
                    </a>
                  </h3>
                  <p>{project.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Chapter 02: The Playground — Open-Space Orbital Core Synthesis Stage */}
        <section
          className="play-section"
          id="play"
          data-nav-section
          aria-labelledby="play-title"
        >
          <div className="wrap">
            <div className="section-top" data-reveal>
              <span className="section-index" data-scramble="02 // ORBITAL SYNTHESIS">
                02 // ORBITAL SYNTHESIS
              </span>
              <span>HARMONIC RESONANCE · IN-PLACE FUSION</span>
            </div>

            <div className="play-intro fusion-intro" data-reveal>
              <div>
                <h2 id="play-title">
                  A little <em>chemistry.</em>
                </h2>
              </div>
              <p>
                Sweep across the field to excite <strong>harmonic waves</strong>; drag orbital cores
                together to <strong>synthesize in place</strong> and keep combining. When a composite
                core matches a verified project, <strong>left-click</strong> to open its repository,
                or <strong>right-click</strong> to eject a constituent technology.
              </p>
            </div>

            <div id="composition-lab" className="reveal-scale" data-cursor="ORBIT / DRAG">
              <Suspense
                fallback={
                  <p role="status" className="lab-loading">
                    Calibrating orbital synthesis cores…
                  </p>
                }
              >
                <Composer />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Chapter 03: Behind the Work — Borderless Glass Shards & Staggered Notes */}
        <section
          className="about-section wrap"
          id="about"
          data-nav-section
          aria-labelledby="about-title"
        >
          <div className="section-top" data-reveal>
            <span className="section-index" data-scramble="03 // DIMENSIONS & NOTES">
              03 // DIMENSIONS &amp; NOTES
            </span>
            <span>STAY CURIOUS, KEEP BUILDING</span>
          </div>

          <div className="about-grid">
            <div className="about-left reveal-left">
              <div className="about-header-row">
                <h2 id="about-title">
                  More than
                  <br />
                  <em>one thing.</em>
                </h2>
                <button
                  className="about-stamp interest-dial"
                  type="button"
                  data-magnetic
                  onClick={() => setInterest(value => (value < 0 ? 0 : (value + 1) % interests.length))}
                  aria-label="Rotate to next dimension"
                >
                  <span>0{(interest < 0 ? 0 : interest) + 1} / 03</span>
                  <strong
                    style={{
                      transform: `rotate(${((interest < 0 ? 0 : interest) + 1) * 120}deg)`,
                    }}
                  >
                    ✳
                  </strong>
                </button>
              </div>

              <p className="about-description">
                Rather than a fixed label, I prefer to introduce myself through what I am currently
                building—working at the intersection of low-level developer tools, autonomous AI
                agents, and expressive hardware interfaces.
              </p>

              <div className="currently">
                <span className="currently-dot" />
                <div>
                  <small>&gt; CURRENT_FOCUS</small>
                  <p>Qt Blueprint Generator &amp; Interactive Shaders</p>
                  <span>Exploring visual compilation pipelines and agentic engineering workflows.</span>
                </div>
              </div>
            </div>

            <div className="interest-list">
              {interests.map((item, index) => {
                const isOpen = interest === index
                return (
                  <div
                    className="interest reveal-right"
                    key={item.title}
                    data-open={isOpen}
                    style={{ transitionDelay: `${index * 90}ms` }}
                    onPointerEnter={() => setInterest(index)}
                  >
                    <h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`interest-${index}`}
                        onClick={() => setInterest(isOpen ? -1 : index)}
                      >
                        <span className="interest-number">{item.code}</span>
                        <span className="interest-heading-group">
                          <strong data-scramble={item.title}>{item.title}</strong>
                          <small>{item.cnTitle}</small>
                        </span>
                        <span className="interest-plus">{isOpen ? '−' : '+'}</span>
                      </button>
                    </h3>
                    <div id={`interest-${index}`} className="interest-panel" hidden={!isOpen}>
                      <h4>{item.subtitle}</h4>
                      <p>{item.text}</p>
                      <small>{item.tags}</small>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <Suspense
            fallback={
              <p role="status" className="lab-loading">
                Measuring glyph segments via @chenglou/pretext…
              </p>
            }
          >
            <PretextStage
              activeDimension={interest}
              onSelectDimension={setInterest}
              reducedMotion={reducedMotion}
            />
          </Suspense>
        </section>

        {/* Chapter 04: Seamless Cosmos Finale */}
        <section
          className="connect-section"
          id="connect"
          data-nav-section
          aria-labelledby="connect-title"
        >
          <div className="wrap">
            <div className="section-top" data-reveal>
              <span className="section-index" data-scramble="04 // UNTIL THE NEXT IDEA">
                04 // UNTIL THE NEXT IDEA
              </span>
              <span>STAY IN TOUCH</span>
            </div>

            <Suspense
              fallback={
                <p role="status" className="lab-loading">
                  Synthesizing DeepSeek Whale-Maid Color-ASCII matrix…
                </p>
              }
            >
              <DeepSeekWhaleStage
                reducedMotion={reducedMotion}
                onKineticSpike={handleKineticSpike}
              />
            </Suspense>

            <div className="connect-stage" data-reveal>
              <a
                className="connect-main"
                href="https://github.com/Chronicle-IRAS"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="GITHUB ↗"
              >
                <h2 id="connect-title">
                  Let’s make
                  <br />
                  <em>something matter.</em>
                </h2>
                <span className="connect-arrow" data-magnetic>
                  <Arrow diagonal />
                </span>
              </a>

              <ConnectionThread reducedMotion={reducedMotion} />

              <div className="connect-bottom">
                <p>Explore the open-source repositories on GitHub, or connect to build what comes next.</p>
                <a
                  href="https://github.com/Chronicle-IRAS"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-magnetic
                >
                  github.com/Chronicle-IRAS <Arrow diagonal />
                </a>
              </div>
            </div>

            <footer className="footer-reveal" data-reveal>
              <a className="footer-brand" href="#top">
                CHRONICLE<span>·</span>
              </a>
              <a
                href="https://github.com/Chronicle-IRAS/chronicle"
                target="_blank"
                rel="noopener noreferrer"
              >
                SOURCE_CODE ↗
              </a>
              <a href="#top">CYCLE_START ↑</a>
            </footer>
          </div>
        </section>
      </main>
    </div>
  )
}
