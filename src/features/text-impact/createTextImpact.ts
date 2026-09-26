import { gsap } from '../../lib/gsap'
import { sampleImpulse, textImpulse } from './trajectory'

export function createTextImpact(root: HTMLElement) {
  const pieces = Array.from(root.querySelectorAll<HTMLElement>('[data-impact-piece]'))
  gsap.set(pieces, { x: 0, y: 0, rotation: 0 })
  const setters = pieces.map((piece) => ({ x: gsap.quickSetter(piece, 'x', 'px'), y: gsap.quickSetter(piece, 'y', 'px'), rotation: gsap.quickSetter(piece, 'rotation', 'deg') }))
  const state = { progress: 0 }
  return gsap.to(state, {
    progress: 1, duration: 1, ease: 'none', paused: true,
    onUpdate: () => setters.forEach((setter, index) => {
      const position = sampleImpulse(textImpulse(index), state.progress)
      setter.x(position.x)
      setter.y(position.y)
      setter.rotation(position.rotation)
    }),
  })
}
