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
import { lockJourneyInput } from '../lib/lockJourneyInput'

export function SceneDirector() {
  const rootRef = useRef<HTMLElement>(null)
  const progressRef = useRef(new Map<SceneId, number>())
  const camera = useRef<SpaceCamera>({ depth: 0, turn: 0, pan: 0, warp: 0, visible: 0 })
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
    const navigate = (event: MouseEvent) => {
      const button = (event.target as HTMLElement).closest('[data-journey-next], [data-journey-prev]')
      if (!button || root.dataset.traversing === 'true') return
      const section = button.closest<HTMLElement>('[data-scene-id]')
      const index = section ? sections.indexOf(section) : -1
      const boundary = button.hasAttribute('data-journey-prev') ? index - 1 : index
      if (boundary < 0 || boundary >= sections.length - 1) return
      const y = button.hasAttribute('data-journey-prev') ? sections[index].offsetTop - 8 : sections[boundary].offsetTop + sections[boundary].offsetHeight * sceneRegistry[boundary].holdFraction + 8
      window.scrollTo(0, y)
    }
    root.addEventListener('click', navigate)
    let cancelTraversal = () => {}
    let removeRefreshListeners = () => {}
    const context = gsap.context(() => {
      const world = root.querySelector<HTMLElement>('[data-space-world]')
      const contents = sections.map((section) => section.querySelector<HTMLElement>('[data-scene-content]')!)
      gsap.set(contents.filter((_, i) => !['prelude', 'composer'].includes(sceneRegistry[i].id)), { autoAlpha: 0 })
      gsap.set(world, { autoAlpha: 0, clipPath: 'circle(150% at 70% 60%)' })
      camera.current.depth = 0
      camera.current.turn = 0
      camera.current.pan = 0
      camera.current.warp = 0
      camera.current.visible = 0
      let activeScene: SceneId | undefined
      let interactive = false
      let traversing = false
      let refreshing = false
      let refreshScene = -1
      let viewportWidth = window.innerWidth
      let viewportHeight = window.innerHeight
      const beginRefresh = () => {
        if (refreshing) return
        refreshing = true
        refreshScene = traversing ? -1 : sceneRegistry.findIndex(scene => scene.id === activeScene)
      }
      const isRefreshing = () => {
        // Some browsers deliver the resized document's scroll event before resize.
        if (window.innerWidth !== viewportWidth || window.innerHeight !== viewportHeight) beginRefresh()
        return refreshing
      }
      let flight: gsap.core.Tween | undefined
      let releaseInput = () => {}
      const unlock = () => {
        if (!traversing) return
        traversing = false
        releaseInput()
        delete root.dataset.transitionFrom
        delete root.dataset.transitionDirection
      }
      cancelTraversal = () => { flight?.kill(); unlock() }
      const syncActive = () => {
        if (traversing || isRefreshing()) return
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
        const composerIndex = sceneRegistry.findIndex((scene) => scene.id === 'composer')
        const composer = sections[composerIndex]
        const ready = id === 'composer' && window.scrollY >= composer.offsetTop && window.scrollY <= composer.offsetTop + composer.offsetHeight * sceneRegistry[composerIndex].holdFraction
        if (ready !== interactive) { interactive = ready; setComposerReady(ready) }
      }
      const traverse = (animation: gsap.core.Timeline, forward: boolean, index: number, returnAnimation?: gsap.core.Timeline) => {
        if (traversing) return
        traversing = true
        releaseInput = lockJourneyInput(root)
        root.dataset.transitionFrom = sceneRegistry[index].id
        root.dataset.transitionDirection = forward ? 'forward' : 'backward'
        sections[index].dataset.transitioning = 'true'
        interactive = false
        setComposerReady(false)
        const playback = !forward && returnAnimation ? returnAnimation : animation
        animation.progress(forward ? 0 : 1)
        if (playback !== animation) playback.progress(0)
        flight = playback.tweenTo(forward || playback !== animation ? playback.duration() : 0, {
          duration: reducedMotion ? 0.35 : (!forward ? sceneRegistry[index].returnSeconds : undefined) ?? sceneRegistry[index].transitionSeconds,
          ease: 'none',
          onUpdate: () => { sections[index].style.setProperty('--transition-progress', String(playback.progress())) },
          onComplete: () => {
            // Restore the boundary's canonical start after a separately choreographed return.
            if (playback !== animation) animation.progress(0)
            unlock()
            sections[index].dataset.transitioning = 'false'
            window.scrollTo(0, forward ? sections[index + 1].offsetTop + 2 : sections[index].offsetTop + sections[index].offsetHeight * sceneRegistry[index].holdFraction - 2)
            ScrollTrigger.update()
            syncActive()
          },
        })
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
        const returnAnimation = sceneRegistry[index].transitionBack?.({ from: toContent, to: fromContent, reducedMotion })
        if (world) addSpaceMotion(animation, id, world, camera.current, reducedMotion)
        // Every boundary plays to an endpoint once triggered, including on return.
        ScrollTrigger.create({
          trigger: section,
          start: () => section.offsetTop + section.offsetHeight * sceneRegistry[index].holdFraction,
          end: 'bottom top',
          onEnter: (self) => {
            if (traversing || isRefreshing()) return
            if (window.scrollY >= self.end) animation.progress(1)
            else traverse(animation, true, index)
          },
          onEnterBack: (self) => {
            if (traversing || isRefreshing()) return
            if (window.scrollY <= self.start) animation.progress(0)
            else traverse(animation, false, index, returnAnimation)
          },
          onLeave: () => { if (!traversing && !isRefreshing()) animation.progress(1) },
          onLeaveBack: () => { if (!traversing && !isRefreshing()) animation.progress(0) },
        })
      })
      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: syncActive, onRefresh: syncActive })
      syncActive()
      const finishRefresh = () => {
        // Viewport resizing changes every section's document position. Keep the
        // current chapter and its visual state instead of crossing old boundaries.
        if (refreshScene >= 0 && !traversing) window.scrollTo(0, sections[refreshScene].offsetTop + (refreshScene ? 2 : 0))
        ScrollTrigger.update()
        viewportWidth = window.innerWidth
        viewportHeight = window.innerHeight
        refreshing = false
        syncActive()
      }
      const refreshViewport = () => {
        beginRefresh()
        // The guard also covers small mobile resizes that ScrollTrigger normally
        // ignores. Queue its debounced refresh so the guard always gets released.
        ScrollTrigger.refresh(true)
      }
      window.addEventListener('resize', refreshViewport)
      ScrollTrigger.addEventListener('refreshInit', beginRefresh)
      ScrollTrigger.addEventListener('refresh', finishRefresh)
      removeRefreshListeners = () => {
        window.removeEventListener('resize', refreshViewport)
        ScrollTrigger.removeEventListener('refreshInit', beginRefresh)
        ScrollTrigger.removeEventListener('refresh', finishRefresh)
      }
    }, root)
    ScrollTrigger.refresh()
    return () => {
      root.removeEventListener('click', navigate)
      cancelTraversal()
      removeRefreshListeners()
      context.revert()
      progressRef.current.clear()
      setComposerReady(false)
    }
  }, [reducedMotion, setCurrentScene, setComposerReady])

  return (
    <main ref={rootRef} id="journey">
      <SpaceWorld camera={camera.current} reducedMotion={reducedMotion} />
      {sceneRegistry.map(({ id, Component, scrollScreens }, index) => (
        <section className={`scene scene-${id}`} style={{ zIndex: 10 - index, height: index === sceneRegistry.length - 1 ? `calc(${scrollScreens * 100}svh + 8px)` : `${scrollScreens * 100}svh` }} data-scene-id={id} id={id} key={id} aria-label={`Scene ${id === 'prelude' ? '0.5' : String(index).padStart(2, '0')}: ${id}`}>
          <Component />
        </section>
      ))}
    </main>
  )
}
