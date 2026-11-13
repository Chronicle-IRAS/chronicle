/** Document-space layout bounds, unaffected by entrance/parallax transforms. */
export function layoutRect(element: HTMLElement) {
  let left = 0
  let top = 0
  let node: HTMLElement | null = element
  while (node) {
    left += node.offsetLeft
    top += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return { left, top, width: element.offsetWidth, height: element.offsetHeight }
}
