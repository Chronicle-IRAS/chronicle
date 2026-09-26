import { useEffect, useLayoutEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useSceneStore } from '../stores/sceneStore'
import type { SceneId } from '../types/scene'
import { sceneRegistry } from './sceneRegistry'

export function SceneDirector() {
  const rootRef = useRef<HTMLElement>(null)
  const progressRef = useRef(new Map<SceneId, number>())
  const reducedMotion = useReducedMotion()
  const setCurrentScene = useSceneStore((state) => state.setCurrentScene)
  const setReducedMotion = useSceneStore((state) => state.setReducedMotion)
  const setComposerReady = useSceneStore((state) => state.setComposerReady)

  useEffect(() => setReducedMotion(reducedMotion), [reducedMotion, setReducedMotion])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-scene-id]'))
    const context = gsap.context(() => {
      sections.forEach((section, index) => {
        const id = sceneRegistry[index].id
        const enter = () => {
          section.dataset.active = 'true'
          setCurrentScene(id)
        }
        const leave = () => { section.dataset.active = 'false' }
        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          onEnter: enter,
          onEnterBack: enter,
          onLeave: leave,
          onLeaveBack: leave,
          onUpdate: (self) => {
            progressRef.current.set(id, self.progress)
            section.style.setProperty('--scene-progress', String(self.progress))
          },
        })

        const next = sections[index + 1]
        const factory = sceneRegistry[index].transitionToNext
        if (!next || !factory) return
        const fromContent = section.querySelector<HTMLElement>('[data-scene-content]')
        const toContent = next.querySelector<HTMLElement>('[data-scene-content]')
        if (!fromContent || !toContent) return
        const animation = factory({ from: fromContent, to: toContent, reducedMotion })
        let composerReady = false
        const syncInteraction = (progress: number) => {
          if (id !== 'welcome') return
          const ready = progress === 1
          if (ready === composerReady) return
          composerReady = ready
          setComposerReady(ready)
        }
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          animation,
          scrub: true,
          onToggle: (self) => { section.dataset.transitioning = String(self.isActive) },
          onUpdate: (self) => {
            section.style.setProperty('--transition-progress', String(self.progress))
            syncInteraction(self.progress)
          },
          onRefresh: (self) => { syncInteraction(self.progress) },
        })
      })
    }, root)
    ScrollTrigger.refresh()
    return () => {
      context.revert()
      progressRef.current.clear()
      setComposerReady(false)
    }
  }, [reducedMotion, setCurrentScene, setComposerReady])

  return (
    <main ref={rootRef} id="journey">
      {sceneRegistry.map(({ id, Component }, index) => (
        <section className={`scene scene-${id}`} data-scene-id={id} id={id} key={id} aria-label={`Scene ${String(index + 1).padStart(2, '0')}: ${id}`}>
          <Component />
        </section>
      ))}
    </main>
  )
}
