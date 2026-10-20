import { expect, it } from 'vitest'
import { resolveWorldStage } from './worldStage'

const visible = { composerVisible: true, currentlyVisible: true }

it('keeps the live blueprint on the moving board during 2→3, then hands off to Currently', () => {
  const transition = { ...visible, active: 'composer', boundary: 'composer', direction: 'forward' }
  expect(resolveWorldStage(transition)).toBe('composer')
  expect(resolveWorldStage({ ...transition, composerVisible: false })).toBe('currently')
})

it('fades the blueprint before handing the shared canvas to the black hole on 2→1', () => {
  const transition = { ...visible, active: 'composer', boundary: 'welcome', direction: 'backward' }
  expect(resolveWorldStage(transition)).toBe('composer')
  expect(resolveWorldStage({ ...transition, composerVisible: false })).toBe('black-hole')
})

it('retains Currently until its fade ends on 3→2, then renders the incoming blueprint', () => {
  const transition = { ...visible, active: 'currently', boundary: 'composer', direction: 'backward' }
  expect(resolveWorldStage(transition)).toBe('currently')
  expect(resolveWorldStage({ ...transition, currentlyVisible: false })).toBe('composer')
})

it('restores settled scenes without retaining transition visibility flags', () => {
  for (const active of ['prelude', 'composer', 'currently', 'profile', 'goodbye'] as const) {
    expect(resolveWorldStage({ active, composerVisible: false, currentlyVisible: false })).toBe(active)
  }
  expect(resolveWorldStage({ ...visible, active: 'welcome' })).toBe('black-hole')
  expect(resolveWorldStage({ ...visible, active: 'space' })).toBe('space')
})
