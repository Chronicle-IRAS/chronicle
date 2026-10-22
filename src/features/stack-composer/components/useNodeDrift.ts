import { useLayoutEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { flushSync } from 'react-dom'
import { getBezierPath, Position } from '@xyflow/react'
import type { ReactFlowInstance } from '@xyflow/react'
import { gsap } from 'gsap'
import { useComposerStore } from '../store/composerStore'
import type { ComposerEdge, ComposerNode } from '../types'
import { stepDrift } from '../motion/physics'
import type { DriftBody } from '../motion/physics'

export function useNodeDrift(
  canvasRef: RefObject<HTMLDivElement | null>, flowRef: RefObject<ReactFlowInstance<ComposerNode, ComposerEdge> | null>,
  nodes: ComposerNode[], edges: ComposerEdge[], enabled: boolean,
) {
  const latest = useRef({ nodes, edges })
  latest.current = { nodes, edges }
  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !enabled) return
    const bodies = new Map<string, DriftBody>()
    let held: string | undefined
    let connecting = false
    let lastTime = 0
    let width = canvas.clientWidth, height = canvas.clientHeight, toolbarHeight = 160, footerHeight = 42
    const toolbar = canvas.querySelector<HTMLElement>('.composer-workbench')
    const measure = () => {
      width = canvas.clientWidth; height = canvas.clientHeight; toolbarHeight = toolbar?.offsetHeight ?? 160
      footerHeight = window.matchMedia('(max-width: 700px), (pointer: coarse)').matches ? 92 : 42
    }
    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(canvas)
    if (toolbar) resize.observe(toolbar)

    const nodeElements = new Map<string, HTMLElement>()
    const edgeElements = new Map<string, { el: SVGGElement; paths: NodeListOf<SVGPathElement> }>()
    let cachedNodeCount = -1, cachedEdgeCount = -1
    let hoveredId: string | undefined, focusedId: string | undefined

    const syncDomCache = () => {
      if (cachedNodeCount === latest.current.nodes.length && cachedEdgeCount === latest.current.edges.length) return
      cachedNodeCount = latest.current.nodes.length
      cachedEdgeCount = latest.current.edges.length
      nodeElements.clear()
      canvas.querySelectorAll<HTMLElement>('.react-flow__node').forEach(el => {
        if (el.dataset.id) nodeElements.set(el.dataset.id, el)
      })
      edgeElements.clear()
      canvas.querySelectorAll<SVGGElement>('[data-drift-edge]').forEach(el => {
        const id = el.dataset.driftEdge
        if (id) edgeElements.set(id, { el, paths: el.querySelectorAll('path') })
      })
    }

    const offset = (id: string) => {
      const node = latest.current.nodes.find(item => item.id === id), body = bodies.get(id)
      return node && body ? { x: body.x - body.rx - node.position.x, y: body.y - body.ry - node.position.y } : { x: 0, y: 0 }
    }
    const render = () => {
      syncDomCache()
      nodeElements.forEach((el, id) => {
        const delta = offset(id)
        el.style.translate = `${delta.x}px ${delta.y}px`
      })
      edgeElements.forEach(({ el, paths }) => {
        const a = offset(el.dataset.source ?? ''), b = offset(el.dataset.target ?? '')
        const [path] = getBezierPath({ sourceX: Number(el.dataset.sx) + a.x, sourceY: Number(el.dataset.sy) + a.y,
          targetX: Number(el.dataset.tx) + b.x, targetY: Number(el.dataset.ty) + b.y,
          sourcePosition: el.dataset.sp as Position, targetPosition: el.dataset.tp as Position })
        paths.forEach(p => p.setAttribute('d', path))
      })
    }
    const commit = () => {
      const changes = latest.current.nodes.flatMap(node => {
        const body = bodies.get(node.id)
        return body ? [{ id: node.id, type: 'position' as const, position: { x: body.x - body.rx, y: body.y - body.ry } }] : []
      })
      nodeElements.forEach(el => { el.style.translate = '' })
      if (changes.length) useComposerStore.getState().onNodesChange(changes)
    }
    const down = (event: Event) => {
      if (!(event.target instanceof Element)) return
      if (event.target.closest('.workbench-action > button')) {
        flushSync(commit)
        return
      }
      const el = event.target.closest<HTMLElement>('.react-flow__node')
      if (!el) return
      held = el.dataset.id
      connecting = !!event.target.closest('.react-flow__handle')
      // Commit visual coordinates once, before React Flow starts its normal editing gesture.
      flushSync(commit)
      if (connecting) bodies.forEach(body => { body.anchorX = body.x; body.anchorY = body.y })
    }
    const up = () => {
      const body = held && bodies.get(held)
      const node = held ? latest.current.nodes.find(item => item.id === held) : undefined
      if (body && node) {
        body.x = node.position.x + body.rx; body.y = node.position.y + body.ry
        body.anchorX = body.x; body.anchorY = body.y
        body.vx = 0; body.vy = 0
      }
      held = undefined; connecting = false
    }
    const onPointerOver = (event: Event) => {
      const el = event.target instanceof Element ? event.target.closest<HTMLElement>('.react-flow__node') : null
      hoveredId = el?.dataset.id
    }
    const onFocusIn = (event: Event) => {
      const el = event.target instanceof Element ? event.target.closest<HTMLElement>('.react-flow__node') : null
      focusedId = el?.dataset.id
    }
    const onFocusOut = () => { focusedId = undefined }
    const keydown = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) down(event)
      if ((event.key === 'Enter' || event.key === ' ') && event.target instanceof Element && event.target.closest('.workbench-action > button')) {
        flushSync(commit)
      }
    }
    const tick = (time: number) => {
      const dt = lastTime ? Math.min(time - lastTime, .04) : 0
      lastTime = time
      if (document.hidden || connecting) return
      syncDomCache()
      const linked = new Set(latest.current.edges.flatMap(edge => [edge.source, edge.target]))
      const ids = new Set(latest.current.nodes.map(node => node.id))
      for (const id of bodies.keys()) if (!ids.has(id)) bodies.delete(id)
      for (const node of latest.current.nodes) {
        const rx = (node.measured?.width ?? (node.type === 'tech' ? 210 : 260)) / 2
        const ry = (node.measured?.height ?? (node.type === 'tech' ? 125 : 176)) / 2
        let body = bodies.get(node.id)
        if (!body) {
          body = { id: node.id, x: node.position.x + rx, y: node.position.y + ry, anchorX: node.position.x + rx,
            anchorY: node.position.y + ry, rx, ry, vx: 0, vy: 0, phase: [...node.id].reduce((n, c) => n + c.charCodeAt(0), 0) * .37,
            time: 0, linked: false, fixed: false }
          bodies.set(node.id, body)
        }
        const nowLinked = linked.has(node.id) || node.type !== 'tech'
        if (nowLinked !== body.linked) { body.anchorX = body.x; body.anchorY = body.y }
        body.linked = nowLinked
        body.rx = rx; body.ry = ry
        body.fixed = node.id === held || node.id === hoveredId || node.id === focusedId
        if (body.fixed && node.id !== held) { body.vx = 0; body.vy = 0 }
      }
      const view = flowRef.current?.getViewport()
      if (!view) return
      const body = held ? bodies.get(held) : undefined
      const node = held ? latest.current.nodes.find(item => item.id === held) : undefined
      stepDrift([...bodies.values()], dt, {
        left: (18 - view.x) / view.zoom, right: (width - 18 - view.x) / view.zoom,
        top: (112 - view.y) / view.zoom, bottom: (height - toolbarHeight - footerHeight - view.y) / view.zoom,
      }, body && node ? { body, x: node.position.x + body.rx, y: node.position.y + body.ry } : undefined)
      render()
    }
    canvas.addEventListener('pointerdown', down, true)
    canvas.addEventListener('pointerover', onPointerOver, { passive: true })
    canvas.addEventListener('focusin', onFocusIn)
    canvas.addEventListener('focusout', onFocusOut)
    canvas.addEventListener('keydown', keydown, true)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', up)
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      resize.disconnect()
      canvas.removeEventListener('pointerdown', down, true)
      canvas.removeEventListener('pointerover', onPointerOver)
      canvas.removeEventListener('focusin', onFocusIn)
      canvas.removeEventListener('focusout', onFocusOut)
      canvas.removeEventListener('keydown', keydown, true)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', up)
      commit()
    }
  }, [canvasRef, flowRef, enabled])
}

