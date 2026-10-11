import { expect, it, vi } from 'vitest'
import { mountJourneyAtEntry, prepareJourneyEntry } from './prepareJourneyEntry'

it('replaces a late chapter fragment while retaining query and history state, then starts at the preface', () => {
  const state = { entry: 'existing' }
  const history = { scrollRestoration: 'auto' as ScrollRestoration, state, replaceState: vi.fn() }
  const scrollTo = vi.fn()
  prepareJourneyEntry({ history, location: { hash: '#goodbye', pathname: '/chronicle/', search: '?from=profile' }, scrollTo })
  expect(history.scrollRestoration).toBe('manual')
  expect(history.replaceState).toHaveBeenCalledWith(state, '', '/chronicle/?from=profile')
  expect(scrollTo).toHaveBeenCalledWith(0, 0)
})

it('also starts a plain reload at the preface without replacing its history entry', () => {
  const history = { scrollRestoration: 'auto' as ScrollRestoration, state: null, replaceState: vi.fn() }
  const scrollTo = vi.fn()
  prepareJourneyEntry({ history, location: { hash: '', pathname: '/', search: '' }, scrollTo })
  expect(history.scrollRestoration).toBe('manual')
  expect(history.replaceState).not.toHaveBeenCalled()
  expect(scrollTo).toHaveBeenCalledWith(0, 0)
})

it('mounts only after late browser restoration has been reset', () => {
  let top = 900, load = () => {}
  const frames: FrameRequestCallback[] = []
  const mount = vi.fn(() => { expect(top).toBe(0) })
  mountJourneyAtEntry({
    history: { scrollRestoration: 'auto', state: null, replaceState: vi.fn() },
    location: { hash: '', pathname: '/', search: '' },
    scrollTo: (_x, y) => { top = y }, document: { readyState: 'loading' },
    addEventListener: (_event, callback) => { load = callback },
    requestAnimationFrame: callback => frames.push(callback),
  }, mount)
  expect(top).toBe(0)
  expect(mount).not.toHaveBeenCalled()
  load()
  frames.shift()!(0)
  top = 860 // The browser restores the old chapter after load.
  expect(mount).not.toHaveBeenCalled()
  frames.shift()!(16)
  expect(mount).toHaveBeenCalledOnce()
})

it('also settles an already-loaded document without waiting for another load event', () => {
  const frames: FrameRequestCallback[] = []
  const addEventListener = vi.fn(), mount = vi.fn()
  mountJourneyAtEntry({
    history: { scrollRestoration: 'auto', state: null, replaceState: vi.fn() },
    location: { hash: '', pathname: '/', search: '' }, scrollTo: vi.fn(),
    document: { readyState: 'complete' }, addEventListener,
    requestAnimationFrame: callback => frames.push(callback),
  }, mount)
  frames.shift()!(0)
  frames.shift()!(16)
  expect(addEventListener).not.toHaveBeenCalled()
  expect(mount).toHaveBeenCalledOnce()
})
