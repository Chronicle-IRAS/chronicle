import { gsap } from '../lib/gsap'

export type TransitionElements = {
  from: HTMLElement
  to: HTMLElement
  reducedMotion: boolean
}

export type TransitionFactory = (elements: TransitionElements) => ReturnType<typeof gsap.timeline>
