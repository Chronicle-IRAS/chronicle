import { useEffect, useRef, useState } from 'react'
import type { MouseEvent, PointerEvent } from 'react'
import { gsap } from 'gsap'
import { initialTechNodes } from '../data/initialNodes'
import { resolveComposition } from '../engine/composition'
import {
  arrangeBalls,
  clampBallPosition,
  computeEjectLanding,
  computeFusionPoint,
  ejectRandomTech,
  nearestFusionTarget,
} from '../engine/fusion'
import type { TechId, TechNode } from '../types'
import { useReducedMotion } from '../../../hooks/useReducedMotion'
import '../../../styles/fusion-lab.css'

const techCatalog = initialTechNodes.map(node => node.data)
const techById = new Map<TechId, TechNode['data']>(techCatalog.map(item => [item.techId, item]))
const techSymbols: Record<TechId, string> = {
  react: '✳',
  vue: '∨',
  typescript: 'TS',
  nodejs: '⌁',
  esp32: '⬡',
  ai: '✦',
  cpp: 'C⁺',
  qt: 'Qt',
}

type OrbitalCluster = {
  id: string
  techIds: TechId[]
  x: number
  y: number
  initVx?: number
  initVy?: number
}

type CorePhysics = {
  anchorX: number
  anchorY: number
  x: number
  y: number
  vx: number
  vy: number
  pulse: number
  orbitAngle: number
  waveEnergy: number
  appear: number
  phase: number
}

type ActiveWave = {
  x: number
  y: number
  r: number
  maxR: number
  strength: number
  active: boolean
}

function createInitialClusters(width: number, height: number): OrbitalCluster[] {
  const points = arrangeBalls(width || 1100, height || 620)
  return techCatalog.map((tech, index) => ({
    id: `core-${tech.techId}`,
    techIds: [tech.techId],
    x: points[index].x,
    y: points[index].y,
  }))
}

export default function FusionLab() {
  const field = useRef<HTMLDivElement>(null)
  const balls = useRef<Record<string, HTMLButtonElement | null>>({})
  const bridgeCore = useRef<SVGLineElement>(null)
  const bridgeGlow = useRef<SVGLineElement>(null)
  const bridgeReticle = useRef<SVGGElement>(null)
  const supernovaRef = useRef<SVGGElement>(null)
  const ripplePool = useRef<(SVGCircleElement | null)[]>([])
  const wavesRef = useRef<ActiveWave[]>(
    Array.from({ length: 18 }, () => ({ x: 0, y: 0, r: 0, maxR: 100, strength: 0, active: false })),
  )
  const waveCursor = useRef(0)

  const clustersRef = useRef<OrbitalCluster[]>([])
  const physicsRef = useRef<Map<string, CorePhysics>>(new Map())
  const visibleRef = useRef(true)
  const emergedRef = useRef(false)

  const pointerWake = useRef<{ x: number; y: number; vx: number; vy: number; lastWave: number }>({
    x: -1000,
    y: -1000,
    vx: 0,
    vy: 0,
    lastWave: 0,
  })

  const drag = useRef<{
    id: string
    startX: number
    startY: number
    targetX: number
    targetY: number
    lastWaveX: number
    lastWaveY: number
    moved: boolean
  } | null>(null)
  const suppressClick = useRef(false)
  const busy = useRef(false)

  const [clusters, setClusters] = useState<OrbitalCluster[]>(() => createInitialClusters(1100, 620))
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [discovered, setDiscovered] = useState<string[]>([])
  const [message, setMessage] = useState(
    'SWEEP TO EXCITE HARMONIC WAVES · DRAG CORES TO SYNTHESIZE IN PLACE · LEFT-CLICK REPO · RIGHT-CLICK EJECT',
  )
  const reduced = useReducedMotion()

  clustersRef.current = clusters

  const emitWave = (x: number, y: number, maxR = 140, strength = 1) => {
    if (reduced) return
    const idx = waveCursor.current % wavesRef.current.length
    waveCursor.current += 1
    const wave = wavesRef.current[idx]
    wave.x = x
    wave.y = y
    wave.r = 14
    wave.maxR = maxR
    wave.strength = strength
    wave.active = true
    const circle = ripplePool.current[idx]
    if (circle) {
      circle.setAttribute('cx', x.toFixed(1))
      circle.setAttribute('cy', y.toFixed(1))
      circle.setAttribute('r', '14')
      circle.style.opacity = String(Math.min(0.8, strength * 0.6))
    }
  }

  useEffect(() => {
    const map = physicsRef.current
    const activeIds = new Set(clusters.map(c => c.id))
    for (const key of map.keys()) {
      if (!activeIds.has(key)) map.delete(key)
    }
    clusters.forEach((cluster, index) => {
      const existing = map.get(cluster.id)
      if (!existing) {
        map.set(cluster.id, {
          anchorX: cluster.x,
          anchorY: cluster.y,
          x: cluster.x,
          y: emergedRef.current ? cluster.y : cluster.y + 48,
          vx: cluster.initVx ?? 0,
          vy: cluster.initVy ?? 0,
          pulse: 1,
          orbitAngle: index * 45,
          waveEnergy: cluster.initVx ? 0.95 : 0.45,
          appear: reduced ? 1 : emergedRef.current ? 0.35 : -index * 0.08,
          phase: index * 1.37,
        })
      } else {
        existing.anchorX = cluster.x
        existing.anchorY = cluster.y
      }
    })
  }, [clusters, reduced])

  useEffect(() => {
    const element = field.current
    if (!element) return

    const relayout = (isFirstReveal: boolean) => {
      const width = element.clientWidth || 1100
      const height = element.clientHeight || 620
      const basePoints = arrangeBalls(width, height)
      setClusters(prev => {
        if (prev.length === 8 && prev.every(item => item.techIds.length === 1)) {
          return prev.map((item, idx) => {
            const pt = basePoints[idx]
            const phys = physicsRef.current.get(item.id)
            if (phys) {
              phys.anchorX = pt.x
              phys.anchorY = pt.y
              if (isFirstReveal && !reduced) {
                phys.x = pt.x
                phys.y = pt.y + 54
                phys.appear = -idx * 0.07
                phys.waveEnergy = 0.75
              } else {
                phys.x = pt.x
                phys.y = pt.y
                phys.appear = 1
              }
            }
            return { ...item, x: pt.x, y: pt.y }
          })
        }
        return prev.map(item => {
          const radius = item.techIds.length > 1 ? 66 : 54
          const clamped = clampBallPosition({ x: item.x, y: item.y }, width, height, radius)
          const phys = physicsRef.current.get(item.id)
          if (phys) {
            phys.anchorX = clamped.x
            phys.anchorY = clamped.y
          }
          return { ...item, x: clamped.x, y: clamped.y }
        })
      })
    }

    const intersect = new IntersectionObserver(
      entries => {
        const isVis = entries[0]?.isIntersecting ?? false
        visibleRef.current = isVis
        if (isVis && !emergedRef.current) {
          emergedRef.current = true
          relayout(true)
          const width = element.clientWidth || 1100
          const height = element.clientHeight || 620
          const pts = arrangeBalls(width, height)
          pts.forEach((p, idx) => {
            setTimeout(() => emitWave(p.x, p.y, 115, 0.75), idx * 65)
          })
        }
      },
      { threshold: 0.14 },
    )
    intersect.observe(element)

    let lastWidth = element.clientWidth
    const resizeObs = new ResizeObserver(() => {
      if (!element.clientWidth || Math.abs(element.clientWidth - lastWidth) < 4) return
      lastWidth = element.clientWidth
      drag.current = null
      hideBridge()
      relayout(false)
    })
    resizeObs.observe(element)

    let prevTime = performance.now() / 1000
    const tick = (nowSec: number) => {
      if (!visibleRef.current || document.hidden) {
        prevTime = nowSec
        return
      }
      const dt = Math.min(0.033, Math.max(0.004, nowSec - prevTime))
      prevTime = nowSec

      const width = element.clientWidth || 1100
      const height = element.clientHeight || 620
      const held = drag.current
      const list = clustersRef.current
      const physMap = physicsRef.current

      wavesRef.current.forEach((wave, idx) => {
        if (!wave.active) return
        wave.r += dt * (210 + wave.strength * 85)
        const progress = wave.r / wave.maxR
        const circle = ripplePool.current[idx]
        if (progress >= 1) {
          wave.active = false
          if (circle) circle.style.opacity = '0'
          return
        }
        if (circle) {
          circle.setAttribute('r', wave.r.toFixed(1))
          circle.style.opacity = ((1 - progress) * (1 - progress) * 0.65 * wave.strength).toFixed(3)
        }

        list.forEach(cluster => {
          if (held?.id === cluster.id) return
          const p = physMap.get(cluster.id)
          if (!p) return
          const dx = p.x - wave.x
          const dy = p.y - wave.y
          const dist = Math.hypot(dx, dy)
          const band = Math.abs(dist - wave.r)
          if (dist > 6 && band < 34) {
            const falloff = (1 - band / 34) * (1 - progress) * wave.strength
            p.vx += (dx / dist) * falloff * 145 * dt
            p.vy += (dy / dist) * falloff * 145 * dt
            p.waveEnergy = Math.min(1.3, p.waveEnergy + falloff * 1.1 * dt)
          }
        })
      })

      let targetIdx = -1
      let movingIdx = -1
      if (held && held.moved) {
        movingIdx = list.findIndex(c => c.id === held.id)
        if (movingIdx >= 0) {
          const pts = list.map(c => {
            const p = physMap.get(c.id)
            return { x: p ? p.x : c.x, y: p ? p.y : c.y }
          })
          const radius = list[movingIdx].techIds.length > 1 ? 66 : 54
          targetIdx = nearestFusionTarget(pts, movingIdx, radius * 1.16)
        }
      }

      list.forEach((cluster, index) => {
        const el = balls.current[cluster.id]
        const p = physMap.get(cluster.id)
        if (!el || !p) return

        if (p.appear < 1) {
          p.appear = Math.min(1, p.appear + dt * 2.2)
        }
        const appearProgress = Math.max(0, p.appear)
        const appearEase = 1 - Math.pow(1 - appearProgress, 3)

        const radius = cluster.techIds.length > 1 ? 66 : 54
        const isHeld = held?.id === cluster.id && held.moved
        const isTarget = index === targetIdx && movingIdx >= 0

        if (isHeld && held) {
          const dx = held.targetX - p.x
          const dy = held.targetY - p.y
          p.vx = p.vx * Math.exp(-dt * 18) + dx * 210 * dt
          p.vy = p.vy * Math.exp(-dt * 18) + dy * 210 * dt
          p.x += p.vx * dt
          p.y += p.vy * dt
          p.anchorX = p.x
          p.anchorY = p.y
          cluster.x = p.x
          cluster.y = p.y
          p.waveEnergy = Math.min(1.2, p.waveEnergy + Math.hypot(p.vx, p.vy) * 0.0025 * dt)

          list.forEach((other, otherIdx) => {
            if (otherIdx === index || otherIdx === targetIdx) return
            const op = physMap.get(other.id)
            if (!op) return
            const odx = op.x - p.x
            const ody = op.y - p.y
            const odist = Math.hypot(odx, ody)
            if (odist > 10 && odist < 175) {
              const push = (1 - odist / 175) * 180 * dt
              op.vx += (odx / odist) * push + p.vx * 0.08 * dt
              op.vy += (ody / odist) * push + p.vy * 0.08 * dt
              op.waveEnergy = Math.min(1.1, op.waveEnergy + 0.55 * dt)
            }
          })
        } else {
          let goalX = p.anchorX + Math.sin(nowSec * 1.3 + p.phase) * 4.2
          let goalY = p.anchorY + Math.cos(nowSec * 1.05 + p.phase * 1.3) * 5.0

          if (isTarget && movingIdx >= 0) {
            const mover = physMap.get(list[movingIdx].id)
            if (mover) {
              goalX += (mover.x - p.anchorX) * 0.24
              goalY += (mover.y - p.anchorY) * 0.24
              p.waveEnergy = Math.min(1.15, p.waveEnergy + dt * 1.8)
            }
          }

          const springK = 26
          const damping = Math.exp(-dt * 5.2)
          p.vx = (p.vx + (goalX - p.x) * springK * dt) * damping
          p.vy = (p.vy + (goalY - p.y) * springK * dt) * damping
          p.x += p.vx * dt
          p.y += p.vy * dt

          if (Math.hypot(p.vx, p.vy) > 95) {
            const clamped = clampBallPosition({ x: p.x, y: p.y }, width, height, radius)
            p.x = clamped.x
            p.y = clamped.y
            p.anchorX = clamped.x
            p.anchorY = clamped.y
            cluster.x = clamped.x
            cluster.y = clamped.y
          }
        }

        p.waveEnergy *= Math.exp(-dt * 2.8)

        const speed = Math.hypot(p.vx, p.vy)
        const targetPulse =
          1 +
          Math.min(0.08, speed * 0.00018) +
          Math.sin(nowSec * 8.5 + p.phase) * p.waveEnergy * 0.032
        p.pulse += (targetPulse - p.pulse) * (1 - Math.exp(-dt * 14))
        p.orbitAngle = (p.orbitAngle + dt * (28 + p.waveEnergy * 110 + speed * 0.18)) % 360

        if (reduced) {
          el.style.transform = `translate3d(${p.anchorX.toFixed(1)}px, ${p.anchorY.toFixed(1)}px, 0)`
          el.style.opacity = '1'
        } else {
          const yOffset = (1 - appearEase) * 42
          const s = (0.45 + 0.55 * appearEase) * (isTarget ? 1.08 : p.pulse)
          el.style.transform = `translate3d(${p.x.toFixed(2)}px, ${(p.y + yOffset).toFixed(2)}px, 0) scale(${s.toFixed(3)})`
          el.style.opacity = appearEase.toFixed(3)

          const orbitGroup = el.querySelector<SVGGElement>('.core-orbit-rotor')
          if (orbitGroup) {
            orbitGroup.style.transform = `rotate(${p.orbitAngle.toFixed(1)}deg)`
          }
        }

        el.setAttribute('data-attracted', String(isTarget))
      })

      if (targetIdx >= 0 && movingIdx >= 0) {
        const moverP = physMap.get(list[movingIdx].id)
        const targetP = physMap.get(list[targetIdx].id)
        if (moverP && targetP) {
          showBridge(moverP.x, moverP.y, targetP.x, targetP.y)
        }
      } else {
        hideBridge()
      }
    }

    gsap.ticker.add(tick)
    return () => {
      intersect.disconnect()
      resizeObs.disconnect()
      gsap.ticker.remove(tick)
    }
  }, [reduced])

  const hideBridge = () => {
    if (bridgeCore.current) bridgeCore.current.style.opacity = '0'
    if (bridgeGlow.current) bridgeGlow.current.style.opacity = '0'
    if (bridgeReticle.current) bridgeReticle.current.style.opacity = '0'
  }

  const showBridge = (x1: number, y1: number, x2: number, y2: number) => {
    for (const line of [bridgeCore.current, bridgeGlow.current]) {
      if (!line) continue
      line.style.opacity = '1'
      line.setAttribute('x1', x1.toFixed(1))
      line.setAttribute('y1', y1.toFixed(1))
      line.setAttribute('x2', x2.toFixed(1))
      line.setAttribute('y2', y2.toFixed(1))
    }
    if (bridgeReticle.current) {
      const mx = (x1 + x2) * 0.5
      const my = (y1 + y2) * 0.5
      bridgeReticle.current.style.opacity = '1'
      bridgeReticle.current.setAttribute('transform', `translate(${mx.toFixed(1)}, ${my.toFixed(1)})`)
    }
  }

  const handleFieldPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduced || drag.current) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const wake = pointerWake.current
    const vx = x - wake.x
    const vy = y - wake.y
    const stepDist = Math.hypot(vx, vy)
    wake.x = x
    wake.y = y
    wake.vx = vx
    wake.vy = vy

    if (stepDist > 60) return

    const now = performance.now()
    if (stepDist > 10 && now - wake.lastWave > 95) {
      wake.lastWave = now
      emitWave(x, y, 105, Math.min(0.85, stepDist / 26))
    }

    clustersRef.current.forEach(cluster => {
      const p = physicsRef.current.get(cluster.id)
      if (!p) return
      const dx = p.x - x
      const dy = p.y - y
      const dist = Math.hypot(dx, dy)
      if (dist > 8 && dist < 155) {
        const influence = (1 - dist / 155) * 0.32
        p.vx += vx * influence * 4.2 + (dx / dist) * stepDist * influence * 1.4
        p.vy += vy * influence * 4.2 + (dy / dist) * stepDist * influence * 1.4
        p.waveEnergy = Math.min(1.15, p.waveEnergy + influence * 0.22)
      }
    })
  }

  const triggerSupernova = (x: number, y: number, intense = false) => {
    emitWave(x, y, intense ? 260 : 195, intense ? 1.6 : 1.25)
    setTimeout(() => emitWave(x, y, intense ? 190 : 140, 1.05), 85)
    if (reduced) return

    if (supernovaRef.current) {
      const g = supernovaRef.current
      g.setAttribute('transform', `translate(${x.toFixed(1)}, ${y.toFixed(1)})`)
      gsap.killTweensOf(g)
      gsap.fromTo(
        g,
        { opacity: 1, scale: 0.2, rotation: 0 },
        {
          opacity: 0,
          scale: intense ? 2.4 : 1.75,
          rotation: intense ? 45 : 28,
          duration: intense ? 0.72 : 0.55,
          ease: 'expo.out',
        },
      )
    }

    if (field.current) {
      gsap.killTweensOf(field.current)
      gsap.fromTo(
        field.current,
        { x: intense ? -8 : -5, y: intense ? 6 : 4 },
        { x: 0, y: 0, duration: 0.44, ease: 'elastic.out(1.35, 0.2)' },
      )
    }
  }

  const fuseClusters = (sourceId: string, targetId: string) => {
    if (sourceId === targetId || busy.current) return
    const list = clustersRef.current
    const source = list.find(item => item.id === sourceId)
    const target = list.find(item => item.id === targetId)
    if (!source || !target) return

    const sp = physicsRef.current.get(sourceId)
    const tp = physicsRef.current.get(targetId)
    const sx = sp ? sp.x : source.x
    const sy = sp ? sp.y : source.y
    const tx = tp ? tp.x : target.x
    const ty = tp ? tp.y : target.y

    setSelectedIds([])
    hideBridge()

    const width = field.current?.clientWidth || 1100
    const height = field.current?.clientHeight || 620
    const mergedTechs = [...new Set([...source.techIds, ...target.techIds])]
    const composition = resolveComposition(mergedTechs)
    const radius = mergedTechs.length > 1 ? 66 : 54
    const fusionPos = computeFusionPoint({ x: sx, y: sy }, { x: tx, y: ty }, width, height, radius)
    const newId = `core-${mergedTechs.slice().sort().join('+')}-${Date.now().toString(36)}`

    physicsRef.current.set(newId, {
      anchorX: fusionPos.x,
      anchorY: fusionPos.y,
      x: fusionPos.x,
      y: fusionPos.y,
      vx: ((sp?.vx ?? 0) + (tp?.vx ?? 0)) * 0.25,
      vy: ((sp?.vy ?? 0) + (tp?.vy ?? 0)) * 0.25,
      pulse: 1.12,
      orbitAngle: 0,
      waveEnergy: 1.35,
      appear: 1,
      phase: Math.random() * 6.28,
    })

    setClusters(prev => [
      ...prev.filter(item => item.id !== sourceId && item.id !== targetId),
      { id: newId, techIds: mergedTechs, x: fusionPos.x, y: fusionPos.y },
    ])

    triggerSupernova(fusionPos.x, fusionPos.y, composition.kind === 'project')

    if (composition.kind === 'project') {
      setDiscovered(prev => (prev.includes(composition.key) ? prev : [...prev, composition.key]))
      setMessage(
        `✦ SYNTHESIZED VERIFIED REPO [${composition.label}] · LEFT-CLICK CORE TO OPEN GITHUB · RIGHT-CLICK TO EJECT`,
      )
    } else {
      const names = mergedTechs.map(id => techById.get(id)?.label ?? id).join(' + ')
      setMessage(
        `SYNTHESIZED [${names}] IN PLACE · DRAG TO COMBINE FURTHER OR RIGHT-CLICK TO EJECT`,
      )
    }
  }

  const handleContextMenu = (event: MouseEvent<HTMLButtonElement>, cluster: OrbitalCluster) => {
    event.preventDefault()
    event.stopPropagation()
    if (busy.current) return

    const curPhys = physicsRef.current.get(cluster.id)
    const ox = curPhys ? curPhys.x : cluster.x
    const oy = curPhys ? curPhys.y : cluster.y

    if (cluster.techIds.length < 2) {
      if (curPhys) curPhys.waveEnergy = 1.1
      emitWave(ox, oy, 110, 0.85)
      setMessage(
        `[${techById.get(cluster.techIds[0])?.label}] IS A BASE ORBITAL CORE · DRAG IT INTO ANOTHER CORE TO SYNTHESIZE`,
      )
      return
    }

    const splitResult = ejectRandomTech(cluster.techIds)
    if (!splitResult) return

    const width = field.current?.clientWidth || 1100
    const height = field.current?.clientHeight || 620
    const existingPoints = clustersRef.current.map(item => {
      const p = physicsRef.current.get(item.id)
      return { x: p ? p.x : item.x, y: p ? p.y : item.y }
    })
    const seedAngle = Math.random() * Math.PI * 2
    const landing = computeEjectLanding(
      { x: ox, y: oy },
      existingPoints,
      width,
      height,
      54,
      seedAngle,
    )

    const ejectAngle = Math.atan2(landing.y - oy, landing.x - ox)
    const recoilPos = clampBallPosition(
      {
        x: ox - Math.cos(ejectAngle) * 32,
        y: oy - Math.sin(ejectAngle) * 32,
      },
      width,
      height,
      splitResult.remaining.length > 1 ? 66 : 54,
    )

    const stamp = Date.now().toString(36)
    const remainId = `core-${splitResult.remaining.slice().sort().join('+')}-${stamp}-r`
    const ejectedId = `core-${splitResult.ejected}-${stamp}-e`

    physicsRef.current.set(remainId, {
      anchorX: recoilPos.x,
      anchorY: recoilPos.y,
      x: ox,
      y: oy,
      vx: -Math.cos(ejectAngle) * 240,
      vy: -Math.sin(ejectAngle) * 240,
      pulse: 0.92,
      orbitAngle: 0,
      waveEnergy: 1.25,
      appear: 1,
      phase: Math.random() * 6.28,
    })

    physicsRef.current.set(ejectedId, {
      anchorX: landing.x,
      anchorY: landing.y,
      x: ox,
      y: oy,
      vx: (landing.x - ox) * 4.8,
      vy: (landing.y - oy) * 4.8,
      pulse: 1.1,
      orbitAngle: 180,
      waveEnergy: 1.35,
      appear: 1,
      phase: Math.random() * 6.28,
    })

    emitWave(ox, oy, 185, 1.25)
    setSelectedIds([])
    setClusters(prev => [
      ...prev.filter(item => item.id !== cluster.id),
      { id: remainId, techIds: splitResult.remaining, x: recoilPos.x, y: recoilPos.y },
      { id: ejectedId, techIds: [splitResult.ejected], x: landing.x, y: landing.y },
    ])

    const ejectedLabel = techById.get(splitResult.ejected)?.label ?? splitResult.ejected
    const remainComp =
      splitResult.remaining.length >= 2 ? resolveComposition(splitResult.remaining) : null
    if (remainComp?.kind === 'project') {
      setDiscovered(prev => (prev.includes(remainComp.key) ? prev : [...prev, remainComp.key]))
      setMessage(
        `EJECTED [${ejectedLabel}] · REMAINING CORE MATCHES [${remainComp.label}] · LEFT-CLICK TO OPEN REPO`,
      )
    } else {
      setMessage(`EJECTED [${ejectedLabel}] BACK INTO THE ORBITAL FIELD`)
    }
  }

  const handleClick = (cluster: OrbitalCluster) => {
    if (suppressClick.current) {
      suppressClick.current = false
      return
    }
    if (busy.current) return

    const p = physicsRef.current.get(cluster.id)
    const cx = p ? p.x : cluster.x
    const cy = p ? p.y : cluster.y
    if (p) p.waveEnergy = 1.05
    emitWave(cx, cy, 120, 0.9)

    if (cluster.techIds.length >= 2) {
      const composition = resolveComposition(cluster.techIds)
      if (composition.kind === 'project' && composition.href) {
        window.open(composition.href, '_blank', 'noopener,noreferrer')
        setMessage(`OPENING REPOSITORY // ${composition.label} ↗`)
        return
      }
    }

    setSelectedIds(prev =>
      prev.includes(cluster.id)
        ? prev.filter(id => id !== cluster.id)
        : prev.length < 2
          ? [...prev, cluster.id]
          : [cluster.id],
    )
  }

  const down = (event: PointerEvent<HTMLButtonElement>, cluster: OrbitalCluster) => {
    if (busy.current || event.button !== 0) return
    suppressClick.current = false
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)

    const p = physicsRef.current.get(cluster.id)
    const cx = p ? p.x : cluster.x
    const cy = p ? p.y : cluster.y
    if (p) p.waveEnergy = Math.max(p.waveEnergy, 0.85)
    emitWave(cx, cy, 105, 0.8)

    drag.current = {
      id: cluster.id,
      startX: event.clientX,
      startY: event.clientY,
      targetX: cx,
      targetY: cy,
      lastWaveX: cx,
      lastWaveY: cy,
      moved: false,
    }
  }

  const move = (event: PointerEvent<HTMLButtonElement>) => {
    const held = drag.current
    const element = field.current
    if (!held || !element) return

    if (Math.hypot(event.clientX - held.startX, event.clientY - held.startY) > 5) {
      held.moved = true
    }
    if (!held.moved) return

    const rect = element.getBoundingClientRect()
    const radius = event.currentTarget.offsetWidth / 2
    const clamped = clampBallPosition(
      { x: event.clientX - rect.left, y: event.clientY - rect.top },
      rect.width,
      rect.height,
      radius,
    )
    held.targetX = clamped.x
    held.targetY = clamped.y
    event.currentTarget.style.zIndex = '10'

    if (Math.hypot(clamped.x - held.lastWaveX, clamped.y - held.lastWaveY) > 38) {
      held.lastWaveX = clamped.x
      held.lastWaveY = clamped.y
      emitWave(clamped.x, clamped.y, 96, 0.72)
    }
  }

  const release = (event: PointerEvent<HTMLButtonElement>, cancel = false) => {
    const held = drag.current
    if (!held) return
    drag.current = null
    suppressClick.current = held.moved
    event.currentTarget.style.zIndex = ''

    const list = clustersRef.current
    const movingIdx = list.findIndex(item => item.id === held.id)
    if (movingIdx < 0) {
      hideBridge()
      return
    }

    const radius = event.currentTarget.offsetWidth / 2
    const pts = list.map(item => {
      const p = physicsRef.current.get(item.id)
      return { x: p ? p.x : item.x, y: p ? p.y : item.y }
    })
    const targetIdx =
      !cancel && held.moved ? nearestFusionTarget(pts, movingIdx, radius * 1.16) : -1

    hideBridge()

    if (targetIdx >= 0) {
      fuseClusters(list[movingIdx].id, list[targetIdx].id)
    } else if (held.moved) {
      const p = physicsRef.current.get(held.id)
      if (p) {
        p.waveEnergy = 1.05
        emitWave(p.x, p.y, 115, 0.82)
      }
    }
  }

  const resetField = () => {
    busy.current = false
    drag.current = null
    suppressClick.current = false
    hideBridge()
    setSelectedIds([])
    const width = field.current?.clientWidth || 1100
    const height = field.current?.clientHeight || 620
    const fresh = createInitialClusters(width, height)
    physicsRef.current.clear()
    setClusters(fresh)
    fresh.forEach((c, i) => {
      setTimeout(() => emitWave(c.x, c.y, 100, 0.7), i * 45)
    })
    setMessage('ORBITAL FIELD RESET · SWEEP OR DRAG CORES TO EXCITE HARMONIC SYNTHESIS')
  }

  return (
    <div className="fusion-lab">
      <div
        className="fusion-field"
        ref={field}
        aria-label="Interactive orbital core synthesis field"
        onPointerMove={handleFieldPointerMove}
        onContextMenu={event => event.preventDefault()}
      >
        <div className="fusion-orbit orbit-a" />
        <div className="fusion-orbit orbit-b" />

        <svg className="fusion-ripples" aria-hidden="true">
          {Array.from({ length: 18 }, (_, idx) => (
            <circle
              key={idx}
              ref={el => {
                ripplePool.current[idx] = el
              }}
              cx="-200"
              cy="-200"
              r="0"
            />
          ))}
        </svg>

        <svg className="fusion-bridge" aria-hidden="true">
          <line
            ref={bridgeGlow}
            className="bridge-laser-glow"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <line
            ref={bridgeCore}
            className="bridge-laser-core"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />
          <g ref={bridgeReticle} className="bridge-reticle" style={{ opacity: 0 }}>
            <circle r="16" fill="none" strokeWidth="1" strokeDasharray="3 3" />
            <circle r="4" />
            <path d="M-22 0 H-10 M10 0 H22 M0 -22 V-10 M0 10 V22" strokeWidth="1" />
          </g>
          <g ref={supernovaRef} className="supernova-burst" style={{ opacity: 0 }}>
            <circle r="38" fill="none" strokeWidth="1.5" strokeDasharray="8 6" />
            <circle r="22" fill="none" strokeWidth="2" />
            {Array.from({ length: 12 }, (_, idx) => {
              const a = (idx * Math.PI) / 6
              const x1 = (Math.cos(a) * 14).toFixed(1)
              const y1 = (Math.sin(a) * 14).toFixed(1)
              const x2 = (Math.cos(a) * (idx % 2 === 0 ? 64 : 44)).toFixed(1)
              const y2 = (Math.sin(a) * (idx % 2 === 0 ? 64 : 44)).toFixed(1)
              return <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1.5" />
            })}
          </g>
        </svg>

        {clusters.map((cluster, index) => {
          const isComposite = cluster.techIds.length >= 2
          const comp = isComposite ? resolveComposition(cluster.techIds) : null
          const isProject = comp?.kind === 'project'
          const isSelected = selectedIds.includes(cluster.id)
          const primaryTech = techById.get(cluster.techIds[0])
          const labelText = isProject
            ? comp.label
            : isComposite
              ? cluster.techIds.map(id => techById.get(id)?.label ?? id).join(' + ')
              : (primaryTech?.label ?? cluster.techIds[0])
          const symbolText = isProject
            ? '✳'
            : isComposite
              ? cluster.techIds.map(id => techSymbols[id]).join('·')
              : techSymbols[cluster.techIds[0]]

          return (
            <button
              className="fusion-ball"
              key={cluster.id}
              ref={el => {
                if (el) balls.current[cluster.id] = el
                else delete balls.current[cluster.id]
              }}
              type="button"
              data-composite={isComposite}
              data-kind={comp?.kind ?? 'tech'}
              data-selected={isSelected}
              aria-pressed={isSelected}
              aria-label={
                isProject
                  ? `Verified project core ${labelText}, left-click to open repository, right-click to eject technology, or drag to synthesize`
                  : isComposite
                    ? `Composite core ${labelText}, right-click to eject a technology, or drag to synthesize further`
                    : `Drag or click ${labelText} orbital core`
              }
              onClick={() => handleClick(cluster)}
              onContextMenu={event => handleContextMenu(event, cluster)}
              onPointerDown={event => down(event, cluster)}
              onPointerMove={move}
              onPointerUp={event => release(event)}
              onPointerCancel={event => release(event, true)}
              onLostPointerCapture={event => release(event, true)}
            >
              <span className="droplet-ripple-halo" aria-hidden="true" />
              <span className="droplet-body">
                <svg className="core-dial-svg" viewBox="0 0 100 100" aria-hidden="true">
                  <circle
                    className="core-dial-ticks"
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    strokeWidth="1"
                    strokeDasharray="1.5 5.5"
                  />
                  <path
                    className="core-dial-cross"
                    d="M50 2 v5 M50 93 v5 M2 50 h5 M93 50 h5"
                    strokeWidth="1"
                  />
                  <g className="core-orbit-rotor">
                    <circle
                      className="core-dial-arc"
                      cx="50"
                      cy="50"
                      r="39"
                      fill="none"
                      strokeWidth="1.2"
                      strokeDasharray="64 190"
                    />
                    <circle className="core-dial-satellite" cx="50" cy="11" r="2.3" />
                  </g>
                </svg>

                <span className="droplet-content">
                  {isComposite && (
                    <em className="droplet-badge">
                      {isProject ? 'OPEN REPO ↗' : `${cluster.techIds.length}× CORE`}
                    </em>
                  )}
                  <span className="ball-symbol" aria-hidden="true">
                    {symbolText}
                  </span>
                  <span className="ball-label">{labelText}</span>
                  {isComposite && (
                    <i className="droplet-action-hint">
                      {isProject ? 'L-CLICK REPO · R-CLICK EJECT' : 'DRAG MORE · R-CLICK EJECT'}
                    </i>
                  )}
                </span>
              </span>
              <small>
                {isComposite
                  ? cluster.techIds.map(id => techById.get(id)?.label ?? id).join(' · ')
                  : `0x0${index + 1}`}
              </small>
            </button>
          )
        })}
      </div>

      {/* Borderless Floating Telemetry HUD */}
      <div className="fusion-floating-bar">
        <span className="fusion-live-msg" role="status">
          <i /> {message}
        </span>
        <div className="fusion-floating-actions">
          <div className="fusion-mini-badges" aria-label="Discovered open-source repositories">
            {[
              { key: 'cpp+qt', label: 'Blueprint' },
              { key: 'esp32+vue', label: 'Monitor' },
              { key: 'ai+typescript', label: 'PaLM Proxy' },
            ].map(item => (
              <span key={item.key} data-found={discovered.includes(item.key)}>
                {discovered.includes(item.key) ? '✳' : '·'} {item.label}
              </span>
            ))}
          </div>
          {selectedIds.length === 2 && (
            <button
              type="button"
              className="fusion-quick-merge"
              onClick={() => fuseClusters(selectedIds[0], selectedIds[1])}
            >
              SYNTHESIZE PAIR ↗
            </button>
          )}
          <button type="button" className="fusion-reset-btn" onClick={resetField}>
            RESET FIELD ↺
          </button>
        </div>
      </div>
    </div>
  )
}
