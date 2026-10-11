type EntryBrowser = {
  history: Pick<History, 'scrollRestoration' | 'replaceState' | 'state'>
  location: Pick<Location, 'hash' | 'pathname' | 'search'>
  scrollTo: (x: number, y: number) => void
}

// Run before mounting the director: restored positions must not advance its timelines.
export function prepareJourneyEntry(browser: EntryBrowser): void {
  browser.history.scrollRestoration = 'manual'
  if (browser.location.hash) {
    browser.history.replaceState(browser.history.state, '', browser.location.pathname + browser.location.search)
  }
  browser.scrollTo(0, 0)
}

type EntryEnvironment = EntryBrowser & {
  document: Pick<Document, 'readyState'>
  requestAnimationFrame: (callback: FrameRequestCallback) => number
  addEventListener: (type: 'load', callback: () => void, options: { once: boolean }) => void
}

export function mountJourneyAtEntry(browser: EntryEnvironment, mount: () => void): void {
  prepareJourneyEntry(browser)
  const settle = () => browser.requestAnimationFrame(() => browser.requestAnimationFrame(() => {
    // Embedded browsers can restore scroll after load despite manual restoration.
    // Keep the long journey unmounted until that restoration has settled.
    prepareJourneyEntry(browser)
    mount()
  }))
  if (browser.document.readyState === 'complete') settle()
  else browser.addEventListener('load', settle, { once: true })
}
