import { useEffect, useLayoutEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useSceneStore } from '../stores/sceneStore'
import type { SceneId } from '../types/scene'
import { sceneRegistry } from './sceneRegistry'
import { SpaceWorld } from '../features/space/SpaceWorld'
import type { SpaceCamera } from '../features/space/field'
import { addSpaceMotion } from '../features/space/addSpaceMotion'
import { useAmbientPointer } from '../hooks/useAmbientPointer'

export function SceneDirector() {
  const rootRef = useRef<HTMLElement>(null)
  const progressRef = useRef(new Map<SceneId, number>())
  const camera = useRef<SpaceCamera>({ depth: 0, turn: 0, visible: 0 })
  const reducedMotion = useReducedMotion()
  useAmbientPointer(rootRef, reducedMotion)
  const setCurrentScene = useSceneStore((state) => state.setCurrentScene)
  const setReducedMotion = useSceneStore((state) => state.setReducedMotion)
  const setComposerReady = useSceneStore((state) => state.setComposerReady)

  useEffect(() => setReducedMotion(reducedMotion), [reducedMotion, setReducedMotion])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-scene-id]'))
    const context = gsap.context(() => {
      const world = root.querySelector<HTMLElement>('[data-space-world]')
      const contents = sections.map((section) => section.querySelector<HTMLElement>('[data-scene-content]')!)
      gsap.set(contents.slice(2), { autoAlpha: 0 })
      gsap.set(world, { autoAlpha: 0, clipPath: 'circle(150% at 70% 60%)' })
      camera.current.depth = 0
      camera.current.turn = 0
      camera.current.visible = 0
      let activeScene: SceneId | undefined
      let interactive = false
      const syncActive = () => {
        const activeIndex = sections.reduce((last, section, i) => section.offsetTop <= window.scrollY + 1 ? i : last, 0)
        const id = sceneRegistry[activeIndex].id
        if (activeScene !== id) {
          activeScene = id
          sections.forEach((section, i) => {
            section.inert = i !== activeIndex
            section.dataset.active = String(i === activeIndex)
            section.setAttribute('aria-hidden', String(i !== activeIndex))
          })
          setCurrentScene(id)
        }
        const ready = id === 'composer' && window.scrollY >= sections[1].offsetTop && window.scrollY <= sections[1].offsetTop + sections[1].offsetHeight * 0.3
        if (ready !== interactive) { interactive = ready; setComposerReady(ready) }
      }
      sections.forEach((section, index) => {
        const id = sceneRegistry[index].id
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom top',
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
        if (world) addSpaceMotion(animation, id, world, camera.current, reducedMotion)
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          animation,
          scrub: true,
          onToggle: (self) => { section.dataset.transitioning = String(self.isActive) },
          onUpdate: (self) => {
            section.style.setProperty('--transition-progress', String(self.progress))
          },
        })
      })
      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: syncActive, onRefresh: syncActive })
      syncActive()
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
      <SpaceWorld camera={camera.current} reducedMotion={reducedMotion} />
      {sceneRegistry.map(({ id, Component }, index) => (
        <section className={`scene scene-${id}`} style={{ zIndex: 10 - index }} data-scene-id={id} id={id} key={id} aria-label={`Scene ${String(index + 1).padStart(2, '0')}: ${id}`}>
          <Component />
        </section>
      ))}
    </main>
  )
}
