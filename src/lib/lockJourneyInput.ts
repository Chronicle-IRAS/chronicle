/** A transition owns input until its endpoint; restoring is safe to call twice. */
export function lockJourneyInput(root: HTMLElement): () => void {
  const html = document.documentElement
  const overflow = html.style.overflow
  const inert = root.inert
  const busy = root.getAttribute('aria-busy')
  const traversing = root.dataset.traversing
  const scrollKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '])
  const blockScroll = (event: Event) => event.preventDefault()
  const blockKeys = (event: KeyboardEvent) => { if (scrollKeys.has(event.key)) event.preventDefault() }
  html.style.overflow = 'hidden'
  root.inert = true
  root.dataset.traversing = 'true'
  root.setAttribute('aria-busy', 'true')
  window.addEventListener('wheel', blockScroll, { passive: false })
  window.addEventListener('touchmove', blockScroll, { passive: false })
  window.addEventListener('keydown', blockKeys)
  let locked = true
  return () => {
    if (!locked) return
    locked = false
    html.style.overflow = overflow
    root.inert = inert
    if (busy === null) root.removeAttribute('aria-busy')
    else root.setAttribute('aria-busy', busy)
    if (traversing === undefined) delete root.dataset.traversing
    else root.dataset.traversing = traversing
    window.removeEventListener('wheel', blockScroll)
    window.removeEventListener('touchmove', blockScroll)
    window.removeEventListener('keydown', blockKeys)
  }
}
