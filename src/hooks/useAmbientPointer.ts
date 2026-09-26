import { useEffect } from 'react'
import type { RefObject } from 'react'
import { gsap } from '../lib/gsap'

export function useAmbientPointer(rootRef: RefObject<HTMLElement | null>, reducedMotion: boolean) {
  useEffect(() => {
    const root = rootRef.current
    if (!root || reducedMotion) return
    const context = gsap.context(() => {
      gsap.set(root, { '--ambient-x': 50, '--ambient-y': 50 })
    }, root)
    const x = gsap.quickTo(root, '--ambient-x', { duration: 0.8, ease: 'power2.out' })
    const y = gsap.quickTo(root, '--ambient-y', { duration: 0.8, ease: 'power2.out' })
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      x(event.clientX / window.innerWidth * 100)
      y(event.clientY / window.innerHeight * 100)
    }
    const reset = () => { x(50); y(50) }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('blur', reset)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('blur', reset)
      x.tween.kill()
      y.tween.kill()
      context.revert()
    }
  }, [rootRef, reducedMotion])
}
