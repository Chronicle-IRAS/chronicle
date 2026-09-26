import { afterEach, expect, it, vi } from 'vitest'
import { lockJourneyInput } from './lockJourneyInput'

afterEach(() => vi.unstubAllGlobals())

it('blocks mid-transition scroll input and restores editing and native scrolling once', () => {
  const events = new EventTarget()
  const html = { style: { overflow: 'auto' } }
  const attributes = new Map<string, string>()
  const root = {
    inert: false,
    dataset: {} as Record<string, string>,
    getAttribute: (name: string) => attributes.get(name) ?? null,
    setAttribute: (name: string, value: string) => attributes.set(name, value),
    removeAttribute: (name: string) => attributes.delete(name),
  }
  vi.stubGlobal('window', events)
  vi.stubGlobal('document', { documentElement: html })
  const release = lockJourneyInput(root as unknown as HTMLElement)
  expect(root.inert).toBe(true)
  expect(html.style.overflow).toBe('hidden')
  const wheel = new Event('wheel', { cancelable: true })
  const touch = new Event('touchmove', { cancelable: true })
  const key = Object.assign(new Event('keydown', { cancelable: true }), { key: 'PageDown' })
  for (const event of [wheel, touch, key]) {
    events.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
  }
  release()
  release()
  expect(root.inert).toBe(false)
  expect(html.style.overflow).toBe('auto')
  expect(root.dataset.traversing).toBeUndefined()
  expect(attributes.has('aria-busy')).toBe(false)
  const restoredWheel = new Event('wheel', { cancelable: true })
  events.dispatchEvent(restoredWheel)
  expect(restoredWheel.defaultPrevented).toBe(false)
})
