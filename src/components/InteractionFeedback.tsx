import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { gsap } from '../lib/gsap'
import { useSceneStore } from '../stores/sceneStore'

const tactileTargets = '.quiet-control, .prelude-footer button, .paper-restart, .welcome-back, .opening-skip, .workbench-action > button, .workbench-project-link, .type-controls button, .sculpture-toggle, .journey-contrast'
const interactiveTargets = 'button:not(:disabled), a[href], input, .react-flow__node, .chapter-sculpture'

export function InteractionFeedback({ surface }: { surface: RefObject<HTMLDivElement | null> }) {
  const layer = useRef<HTMLDivElement>(null)
  const reticleRef = useRef<HTMLDivElement>(null)
  const resetRef = useRef<() => void>(() => {})
  const reduced = useSceneStore((state) => state.reducedMotion)
  const scene = useSceneStore((state) => state.currentScene)
  useEffect(() => { resetRef.current() }, [scene])
  useEffect(() => {
    const root = surface.current, overlay = layer.current, reticle = reticleRef.current
    if (!root || !overlay || reduced) return
    let current: HTMLElement | null = null
    let rect: DOMRect | undefined
    const animations = new Map<HTMLElement, { x: ReturnType<typeof gsap.quickTo>; y: ReturnType<typeof gsap.quickTo> }>()
    const echoes = new Map<HTMLElement, gsap.core.Tween>()
    const quickX = reticle ? gsap.quickTo(reticle, 'x', { duration: .18, ease: 'power3.out' }) : null
    const quickY = reticle ? gsap.quickTo(reticle, 'y', { duration: .18, ease: 'power3.out' }) : null
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
      if (reticle) {
        reticle.dataset.engaged = 'false'
        reticle.dataset.visible = 'false'
      }
      echoes.forEach((tween, el) => { tween.kill(); el.remove() })
      echoes.clear()
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !(event.target instanceof Element)) return
      if (reticle && quickX && quickY) {
        reticle.dataset.visible = 'true'
        quickX(event.clientX)
        quickY(event.clientY)
        reticle.dataset.engaged = event.target.closest(interactiveTargets) ? 'true' : 'false'
        reticle.dataset.paper = event.target.closest('[data-ink-surface], .paper-goodbye, .opening-loader') ? 'true' : 'false'
      }
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
    const leave = () => {
      reset()
      if (reticle) reticle.dataset.visible = 'false'
    }
    const click = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return
      const target = event.target.closest<HTMLElement>('button, a, .chapter-sculpture')
      if (!target || target.matches(':disabled') || target.closest('[inert]')) return
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
        y: (point ? point.top + point.height / 2 : event.clientY) - 32, scale: .2, opacity: .65, rotate: 0 })
      echoes.set(echo, gsap.to(echo, { scale: 1.35, opacity: 0, rotate: 45, duration: .65, ease: 'power2.out',
        onComplete: () => { echo.remove(); echoes.delete(echo) } }))
    }
    root.addEventListener('pointermove', move, { passive: true })
    root.addEventListener('pointerleave', leave)
    root.addEventListener('click', click, true)
    window.addEventListener('blur', leave)
    return () => {
      resetRef.current = () => {}
      root.removeEventListener('pointermove', move)
      root.removeEventListener('pointerleave', leave)
      root.removeEventListener('click', click, true)
      window.removeEventListener('blur', leave)
      leave()
      quickX?.tween.kill(); quickY?.tween.kill()
      animations.forEach((motion, el) => {
        motion.x.tween.kill(); motion.y.tween.kill()
        el.style.removeProperty('--tactile-x'); el.style.removeProperty('--tactile-y')
      })
      echoes.forEach((tween, el) => { tween.kill(); el.remove() })
    }
  }, [surface, reduced])
  return (
    <div className="interaction-feedback" ref={layer} aria-hidden="true">
      <div ref={reticleRef} className="cursor-reticle" data-visible="false" data-engaged="false">
        <span className="reticle-diamond" />
      </div>
    </div>
  )
}
