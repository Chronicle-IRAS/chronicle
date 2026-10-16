import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { gsap } from '../lib/gsap'
import { useSceneStore } from '../stores/sceneStore'

const tactileTargets = '.quiet-control, .prelude-footer button, .paper-restart, .welcome-back, .opening-skip, .workbench-action > button, .workbench-project-link, .type-controls button, .sculpture-toggle, .journey-contrast'

export function InteractionFeedback({ surface }: { surface: RefObject<HTMLDivElement | null> }) {
  const layer = useRef<HTMLDivElement>(null)
  const resetRef = useRef<() => void>(() => {})
  const reduced = useSceneStore(state => state.reducedMotion)
  const scene = useSceneStore(state => state.currentScene)
  useEffect(() => { resetRef.current() }, [scene])
  useEffect(() => {
    const root = surface.current, overlay = layer.current
    if (!root || !overlay || reduced) return
    let current: HTMLElement | null = null
    let rect: DOMRect | undefined
    const animations = new Map<HTMLElement, { x: ReturnType<typeof gsap.quickTo>; y: ReturnType<typeof gsap.quickTo> }>()
    const echoes = new Map<HTMLElement, gsap.core.Tween>()
    const reset = () => {
      if (current) {
        const motion = animations.get(current)
        motion?.x(0); motion?.y(0)
        current.removeAttribute('data-tactile-hover')
      }
      current = null; rect = undefined
    }
    resetRef.current = () => {
      reset()
      echoes.forEach((tween, el) => { tween.kill(); el.remove() })
      echoes.clear()
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !(event.target instanceof Element)) return
      const target = event.target.closest<HTMLElement>(tactileTargets)
      if (!target || target.matches(':disabled') || target.closest('[inert], [data-traversing="true"]')) { reset(); return }
      if (current !== target) {
        reset(); current = target; rect = target.getBoundingClientRect()
        target.dataset.tactileHover = 'true'
        if (!animations.has(target)) animations.set(target, {
          x: gsap.quickTo(target, '--tactile-x', { duration: .4, ease: 'power3.out' }),
          y: gsap.quickTo(target, '--tactile-y', { duration: .4, ease: 'power3.out' }),
        })
      }
      if (!rect) return
      const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1))
      const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1))
      const motion = animations.get(target)!
      motion.x(x * 4); motion.y(y * 3)
      target.style.setProperty('--tactile-light-x', `${(x + 1) * 50}%`)
      target.style.setProperty('--tactile-light-y', `${(y + 1) * 50}%`)
    }
    const click = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const target = event.target.closest<HTMLElement>('button, a')
      if (!target || target.matches(':disabled') || target.closest('[inert]')) return
      // One transient ring per action, capped even during repeated clicking.
      if (echoes.size >= 4) {
        const first = echoes.keys().next().value!
        echoes.get(first)?.kill(); first.remove(); echoes.delete(first)
      }
      const point = event.detail === 0 ? target.getBoundingClientRect() : undefined
      const echo = document.createElement('span')
      echo.className = 'interaction-echo'
      echo.dataset.paper = String(!!target.closest('[data-ink-surface], .paper-goodbye'))
      overlay.append(echo)
      gsap.set(echo, { x: (point ? point.left + point.width / 2 : event.clientX) - 32,
        y: (point ? point.top + point.height / 2 : event.clientY) - 32, scale: .2, opacity: .65 })
      echoes.set(echo, gsap.to(echo, { scale: 1.25, opacity: 0, duration: .65, ease: 'power2.out',
        onComplete: () => { echo.remove(); echoes.delete(echo) } }))
    }
    root.addEventListener('pointermove', move, { passive: true })
    root.addEventListener('pointerleave', reset)
    root.addEventListener('click', click, true)
    window.addEventListener('blur', reset)
    return () => {
      resetRef.current = () => {}
      root.removeEventListener('pointermove', move)
      root.removeEventListener('pointerleave', reset)
      root.removeEventListener('click', click, true)
      window.removeEventListener('blur', reset)
      reset()
      animations.forEach((motion, el) => {
        motion.x.tween.kill(); motion.y.tween.kill()
        el.style.removeProperty('--tactile-x'); el.style.removeProperty('--tactile-y')
      })
      echoes.forEach((tween, el) => { tween.kill(); el.remove() })
    }
  }, [surface, reduced])
  return <div className="interaction-feedback" ref={layer} aria-hidden="true" />
}

