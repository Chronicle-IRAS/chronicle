import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Mesh,
  OrthographicCamera,
  Scene,
  ShaderMaterial,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import type { Texture } from 'three'
import { chronicleAssets } from '../../assets/characters/chronicle/assets'
import { createCosmosStage } from './cosmosStage'
import type { CosmosFieldMode } from './cosmosStage'
import './hero-stage.css'
import { createFragmentGeometry, portraitFragment, portraitVertex } from './fragmentField'

export type ShaderMode = 'prism' | 'lattice' | 'vortex'

const SHADER_MODES: { id: ShaderMode; code: string; label: string }[] = [
  { id: 'prism', code: '01', label: 'PRISM' },
  { id: 'lattice', code: '02', label: 'LATTICE' },
  { id: 'vortex', code: '03', label: 'VORTEX' },
]

export default function HeroPortrait({
  reducedMotion,
  entered = true,
  theme = 'dark',
  cosmosMode = 'attract',
  overdrive = false,
  pulseSignal = 0,
  onReady,
  onLockDistance,
}: {
  reducedMotion: boolean
  entered?: boolean
  theme?: 'dark' | 'light'
  cosmosMode?: CosmosFieldMode
  overdrive?: boolean
  pulseSignal?: number
  onReady?: () => void
  onLockDistance?: (px: number) => void
}) {
  const root = useRef<HTMLDivElement>(null)
  const canvasHost = useRef<HTMLDivElement>(null)
  const coordsRef = useRef<HTMLSpanElement>(null)
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady
  const onLockDistanceRef = useRef(onLockDistance)
  onLockDistanceRef.current = onLockDistance

  const api = useRef<{
    burst: (value: boolean) => void
    light: (value: boolean) => void
    setMode: (mode: ShaderMode) => void
    enter: () => void
    pulseCosmos: (ndcX?: number, ndcY?: number) => void
  } | null>(null)

  const [ready, setReady] = useState(false)
  const [exploded, setExploded] = useState(false)
  const [illuminated, setIlluminated] = useState(false)
  const [shaderMode, setShaderMode] = useState<ShaderMode>('prism')

  const settings = useRef({
    exploded,
    illuminated,
    shaderMode,
    entered,
    theme,
    cosmosMode,
    overdrive,
  })
  settings.current = {
    exploded,
    illuminated,
    shaderMode,
    entered,
    theme,
    cosmosMode,
    overdrive,
  }

  useEffect(() => {
    const surface = root.current
    const fallbackHost = canvasHost.current
    if (!surface || !fallbackHost) return
    const hero = surface.closest<HTMLElement>('.portrait-hero')
    const sequence = surface.closest<HTMLElement>('.portrait-sequence')
    if (!hero || !sequence) return

    const host = document.getElementById('site-webgl-stage') ?? fallbackHost

    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' })
    } catch {
      onReadyRef.current?.()
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setClearColor('#070709', 0)
    renderer.autoClear = false
    host.appendChild(renderer.domElement)

    const cosmosStage = createCosmosStage(renderer)

    let disposed = false
    let loaded = false
    let visible = true
    let lost = false
    let dirty = true

    const scene = new Scene()
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 2

    const trail = Array.from({ length: 8 }, () => new Vector3(-10, -10, 0))
    const trailTimes = new Float64Array(8)
    let trailIndex = 0
    let lastTrail = 0
    const pointer = new Vector2(-10, -10)
    const globalPointerNdc = { x: 0, y: 0, active: false }

    const uniforms = {
      uTexture: { value: null as Texture | null },
      uCover: { value: new Vector2(1, 1) },
      uOffset: { value: 0 },
      uPointer: { value: new Vector2(-10, -10) },
      uHover: { value: 0 },
      uBurst: { value: 0 },
      uScroll: { value: 0 },
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uPortal: { value: new Vector3(.36, .04, .78) },
      uTrail: { value: trail },
      uLight: { value: settings.current.illuminated ? 1 : 0 },
      uLattice: { value: settings.current.shaderMode === 'lattice' ? 1 : 0 },
      uVortex: { value: settings.current.shaderMode === 'vortex' ? 1 : 0 },
    }

    const geometry = createFragmentGeometry(
      window.innerWidth < 700 ? 64 : 90,
      window.innerWidth < 700 ? 44 : 60,
    )
    const material = new ShaderMaterial({
      uniforms,
      vertexShader: portraitVertex,
      fragmentShader: portraitFragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })
    const mesh = new Mesh(geometry, material)
    mesh.frustumCulled = false
    scene.add(mesh)

    const context = gsap.context(() => {}, hero)

    const burst = (value: boolean) => {
      gsap.killTweensOf(uniforms.uBurst)
      context.add(() => {
        gsap.to(uniforms.uBurst, {
          value: value && !reducedMotion ? 1 : 0,
          duration: reducedMotion ? 0 : value ? 1.1 : 1.45,
          ease: value ? 'power2.out' : 'power3.out',
          onUpdate: () => {
            dirty = true
          },
        })
      })
    }

    const light = (value: boolean) => {
      context.add(() => {
        gsap.to(uniforms.uLight, {
          value: value ? 1 : 0,
          duration: reducedMotion ? 0 : 0.45,
          overwrite: true,
          onUpdate: () => {
            dirty = true
          },
        })
      })
    }

    const setMode = (mode: ShaderMode) => {
      const targetLattice = mode === 'lattice' ? 1 : mode === 'vortex' ? 0.32 : 0
      const targetVortex = mode === 'vortex' ? 1 : 0
      context.add(() => {
        gsap.to(uniforms.uLattice, {
          value: reducedMotion ? 0 : targetLattice,
          duration: reducedMotion ? 0 : 0.65,
          ease: 'power2.out',
          overwrite: true,
          onUpdate: () => {
            dirty = true
          },
        })
        gsap.to(uniforms.uVortex, {
          value: reducedMotion ? 0 : targetVortex,
          duration: reducedMotion ? 0 : 0.75,
          ease: 'power2.out',
          overwrite: true,
          onUpdate: () => {
            dirty = true
          },
        })
      })
    }

    let hasEntered = false
    const enter = () => {
      if (hasEntered || !loaded) return
      hasEntered = true
      if (!reducedMotion && !settings.current.exploded) {
        gsap.killTweensOf(uniforms.uBurst)
        context.add(() => {
          gsap.fromTo(
            uniforms.uBurst,
            { value: 0.82 },
            {
              value: 0,
              duration: 1.9,
              ease: 'power3.out',
              onUpdate: () => {
                dirty = true
              },
            },
          )
        })
      } else {
        burst(settings.current.exploded)
      }
    }

    api.current = {
      burst,
      light,
      setMode,
      enter,
      pulseCosmos: (ndcX = 0, ndcY = 0) => cosmosStage.triggerPulse(ndcX, ndcY),
    }

    const texture = new TextureLoader().load(
      chronicleAssets.portrait,
      image => {
        if (disposed) {
          image.dispose()
          return
        }
        uniforms.uTexture.value = image
        loaded = true
        dirty = true
        setReady(true)
        if (!reducedMotion && !settings.current.entered) {
          uniforms.uBurst.value = 0.82
        } else {
          enter()
        }
        onReadyRef.current?.()
      },
      undefined,
      () => {
        if (!disposed) {
          setReady(false)
          onReadyRef.current?.()
        }
      },
    )

    let stageWidth = host.clientWidth || window.innerWidth
    let stageHeight = host.clientHeight || window.innerHeight

    const resize = () => {
      const width = host.clientWidth || window.innerWidth
      const height = host.clientHeight || window.innerHeight
      if (!width || !height) return
      stageWidth = width
      stageHeight = height
      renderer.setSize(width, height)
      const aspect = width / height
      const imageAspect = 1.5
      uniforms.uAspect.value = aspect
      const narrow = width < 760
      uniforms.uPortal.value.set(narrow ? 0 : .36, narrow ? .28 : .04, Math.min(narrow ? .62 : .78, aspect * (narrow ? .9 : .64)))
      uniforms.uCover.value.set(Math.max(1, imageAspect / aspect), Math.max(1, aspect / imageAspect))
      uniforms.uOffset.value = width < 700 ? -0.14 * uniforms.uCover.value.x : 0
      dirty = true
    }

    const sizeObserver = new ResizeObserver(resize)
    sizeObserver.observe(host)

    const visibility = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? false
      dirty = true
    })
    visibility.observe(hero)

    context.add(() => {
      if (reducedMotion) return
      ScrollTrigger.create({
        trigger: sequence,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: self => {
          uniforms.uScroll.value = self.progress
          dirty = true
          hero.style.setProperty('--portrait-progress', String(self.progress))
          surface.style.setProperty('--portal-fade', String(1 - Math.min(1, self.progress * 2.5)))
        },
      })
      gsap.to('.portrait-intro', {
        y: -52,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sequence,
          start: 'top top',
          end: 'bottom bottom+=220',
          scrub: true,
        },
      })
      gsap.fromTo(
        '.portrait-transition-copy',
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sequence,
            start: 'top top-=180',
            end: 'bottom bottom',
            scrub: true,
          },
        },
      )
    })

    const onGlobalMove = (event: PointerEvent) => {
      if (reducedMotion) return
      const nx = (event.clientX / Math.max(1, window.innerWidth)) * 2 - 1
      const ny = 1 - (event.clientY / Math.max(1, window.innerHeight)) * 2
      globalPointerNdc.x = nx
      globalPointerNdc.y = ny
      globalPointerNdc.active = true
    }

    const onGlobalClick = (event: MouseEvent) => {
      if (reducedMotion || window.scrollY < window.innerHeight * 0.35) return
      const target = event.target instanceof Element ? event.target : null
      if (target?.closest('a, button, input, label, .interactive-study, .fusion-ball')) return
      const nx = (event.clientX / Math.max(1, window.innerWidth)) * 2 - 1
      const ny = 1 - (event.clientY / Math.max(1, window.innerHeight)) * 2
      cosmosStage.triggerPulse(nx, ny)
    }

    const move = (event: PointerEvent) => {
      if (reducedMotion) return
      const bounds = hero.getBoundingClientRect()
      const nx = ((event.clientX - bounds.left) / Math.max(1, bounds.width)) * 2 - 1
      const ny = 1 - ((event.clientY - bounds.top) / Math.max(1, bounds.height)) * 2
      pointer.set(nx, ny)
      targetHover = 1
      if (coordsRef.current) {
        coordsRef.current.textContent = `${nx >= 0 ? '+' : ''}${nx.toFixed(2)} / ${ny >= 0 ? '+' : ''}${ny.toFixed(2)}`
      }
      const now = performance.now()
      if (now - lastTrail > 28) {
        trailIndex = (trailIndex + 1) % 8
        trail[trailIndex].set(pointer.x, pointer.y, 1)
        trailTimes[trailIndex] = now
        lastTrail = now
      }
      dirty = true
    }

    let held = false
    const release = () => {
      if (held) {
        held = false
        setExploded(false)
        burst(false)
      }
    }
    const leave = () => {
      targetHover = 0
      if (coordsRef.current) coordsRef.current.textContent = '0.00 / 0.00'
      dirty = true
      release()
    }
    const down = (event: PointerEvent) => {
      if (
        reducedMotion ||
        !loaded ||
        event.button !== 0 ||
        (event.target instanceof Element && event.target.closest('a,button,input'))
      ) {
        return
      }
      held = true
      setExploded(true)
      burst(true)
    }

    window.addEventListener('pointermove', onGlobalMove, { passive: true })
    window.addEventListener('click', onGlobalClick, { passive: true })
    hero.addEventListener('pointermove', move)
    hero.addEventListener('pointerdown', down)
    hero.addEventListener('pointerleave', leave)
    hero.addEventListener('pointercancel', release)
    window.addEventListener('pointerup', release)
    window.addEventListener('blur', release)

    const loss = (event: Event) => {
      event.preventDefault()
      lost = true
      setReady(false)
    }
    const restore = () => {
      lost = false
      dirty = true
      setReady(loaded)
    }
    renderer.domElement.addEventListener('webglcontextlost', loss)
    renderer.domElement.addEventListener('webglcontextrestored', restore)

    let previousTime = performance.now() / 1000
    let targetHover = 0
    let lastScrollY = window.scrollY
    let scrollVelocity = 0
    let frameCounter = 0

    const draw = (time: number) => {
      if (document.hidden || lost) return
      const dt = Math.min(0.05, Math.max(0.001, time - previousTime))
      previousTime = time

      const sy = window.scrollY
      const vh = Math.max(1, window.innerHeight)
      const dScroll = sy - lastScrollY
      lastScrollY = sy
      scrollVelocity = scrollVelocity * 0.86 + dScroll * 0.14

      // Three.js 3D Cosmos Stage alpha: smoothly fades in as user scrolls past the Hero section
      const cosmosAlpha = reducedMotion
        ? 0
        : Math.max(0, Math.min(1, (sy - vh * 0.22) / (vh * 0.55)))
      const pageScrollProgress = Math.max(
        0,
        Math.min(1, (sy - vh * 0.5) / Math.max(1, document.body.scrollHeight - vh * 1.5)),
      )

      const now = performance.now()
      let trailing = false
      for (let i = 0; i < 8; i++) {
        const strength = reducedMotion ? 0 : Math.max(0, 1 - (now - trailTimes[i]) / 1050)
        if (Math.abs(trail[i].z - strength) > 0.001) dirty = true
        trail[i].z = strength
        trailing ||= strength > 0
      }

      const lerpFactor = 1 - Math.exp(-dt * 14)
      uniforms.uPointer.value.lerp(pointer, lerpFactor)
      uniforms.uHover.value += (targetHover - uniforms.uHover.value) * (1 - Math.exp(-dt * 10))
      if (Math.abs(targetHover - uniforms.uHover.value) > 0.002) dirty = true
      if (uniforms.uPointer.value.distanceToSquared(pointer) > 0.0001 && targetHover > 0.01) {
        dirty = true
      }
      uniforms.uTime.value = time

      const portraitActive =
        visible &&
        loaded &&
        uniforms.uScroll.value < 0.98 &&
        (dirty ||
          trailing ||
          (!reducedMotion &&
            (uniforms.uBurst.value > 0.005 ||
              uniforms.uVortex.value > 0.005 ||
              uniforms.uLattice.value > 0.005 ||
              uniforms.uLight.value > 0.005 ||
              uniforms.uScroll.value > 0.005)))

      if (!portraitActive && cosmosAlpha <= 0.005 && !dirty) return

      renderer.clear()

      // Pass 1: Three.js 3D Interactive Background Stage (Chapters 01–04)
      if (cosmosAlpha > 0.005) {
        const lockDist = cosmosStage.render(
          {
            elapsed: time,
            dt,
            alpha: cosmosAlpha,
            scrollProgress: pageScrollProgress,
            scrollVelocity,
            pointerNdcX: globalPointerNdc.x,
            pointerNdcY: globalPointerNdc.y,
            pointerActive: globalPointerNdc.active,
            mode: settings.current.cosmosMode,
            theme: settings.current.theme,
            overdrive: settings.current.overdrive,
          },
          stageWidth,
          stageHeight,
        )
        frameCounter = (frameCounter + 1) % 6
        if (frameCounter === 0) {
          onLockDistanceRef.current?.(lockDist)
        }
      }

      // Pass 2: 10,800-Shard Hero Portrait Stage (Chapter 00)
      if (visible && loaded && uniforms.uScroll.value < 0.98) {
        renderer.clearDepth()
        renderer.render(scene, camera)
      }

      dirty = false
    }

    gsap.ticker.add(draw)
    resize()

    return () => {
      disposed = true
      api.current = null
      setReady(false)
      context.revert()
      hero.style.removeProperty('--portrait-progress')
      surface.style.removeProperty('--portal-fade')
      gsap.ticker.remove(draw)
      sizeObserver.disconnect()
      visibility.disconnect()
      window.removeEventListener('pointermove', onGlobalMove)
      window.removeEventListener('click', onGlobalClick)
      hero.removeEventListener('pointermove', move)
      hero.removeEventListener('pointerdown', down)
      hero.removeEventListener('pointerleave', leave)
      hero.removeEventListener('pointercancel', release)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('blur', release)
      renderer.domElement.removeEventListener('webglcontextlost', loss)
      renderer.domElement.removeEventListener('webglcontextrestored', restore)
      cosmosStage.dispose()
      texture.dispose()
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [reducedMotion])

  useEffect(() => {
    api.current?.burst(exploded)
  }, [exploded])

  useEffect(() => {
    api.current?.light(illuminated)
  }, [illuminated])

  useEffect(() => {
    api.current?.setMode(shaderMode)
  }, [shaderMode])

  useEffect(() => {
    if (entered) api.current?.enter()
  }, [entered])

  useEffect(() => {
    if (pulseSignal > 0) {
      api.current?.pulseCosmos(0, 0)
    }
  }, [pulseSignal])

  return (
    <div
      className="portrait-background cinematic-portrait"
      ref={root}
      data-ready={ready}
      data-illuminated={illuminated}
      data-exploded={exploded}
      data-shader-mode={shaderMode}
    >
      <img
        className="portrait-texture-fallback"
        src={chronicleAssets.portrait}
        alt="Crimson and obsidian glass facets forming the Chronicle portrait"
      />
      <div className="portrait-webgl" ref={canvasHost} aria-hidden="true" />

      <div className="hero-orbital-frame" aria-hidden="true">
        <div className="hero-orbit-halo" />
        <div className="hero-orbit-ring hero-orbit-outer"><span>✦</span></div>
        <div className="hero-orbit-ring hero-orbit-inner" />
        <svg className="hero-orbit-ticks" viewBox="0 0 400 400">{Array.from({ length: 60 }, (_, i) => <line key={i} x1="200" y1="4" x2="200" y2={i % 5 === 0 ? '15' : '8'} transform={`rotate(${i * 6} 200 200)`} />)}</svg>
        <div className="hero-orbit-caption"><span>FIG. 01 — THE CURIOUS MIND</span><i /></div>
        <span className="hero-orbit-coordinates">A STUDY IN<br />INFINITE POSSIBILITY.</span>
      </div>
      <div className="portrait-telemetry" aria-hidden="true">
        <span>MOVE CLOSER. LOOK DEEPER.</span>
        <span><b ref={coordsRef}>0.00 / 0.00</b></span>
      </div>

      <div className="portrait-interaction-label" aria-hidden="true">
        <span>✧</span>
        <p>
          {reducedMotion
            ? 'A MOMENT, IN STILLNESS'
            : exploded
              ? 'EVERY FRAGMENT HAS A STORY'
              : '移动折光 · 按住解构 · 松开重组'}
        </p>
      </div>

      <div className="portrait-actions">
        <div className="shader-mode-group" role="group" aria-label="Shader rendering mode">
          {SHADER_MODES.map(mode => (
            <button
              key={mode.id}
              type="button"
              className="shader-mode-btn"
              disabled={!ready || reducedMotion}
              aria-pressed={shaderMode === mode.id}
              onClick={() => setShaderMode(mode.id)}
            >
              <small>{mode.code}</small>
              {mode.label}
            </button>
          ))}
        </div>

        <span className="portrait-action-sep" aria-hidden="true">/</span>

        <div className="portrait-action-buttons">
          <button
            className="portrait-shatter"
            type="button"
            disabled={!ready || reducedMotion}
            aria-pressed={exploded && !reducedMotion}
            onClick={() => setExploded(value => !value)}
          >
            <span>{exploded ? '↺' : '✳'}</span>
            {exploded ? '重组画面' : '解构画面'}
          </button>
          <button
            className="portrait-light-toggle"
            type="button"
            aria-pressed={illuminated}
            onClick={() => setIlluminated(value => !value)}
          >
            {illuminated ? '收起星光' : '点亮星光'}
          </button>
        </div>
      </div>
    </div>
  )
}
