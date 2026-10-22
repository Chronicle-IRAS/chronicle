export type Viewport = { width: number; height: number; layoutHeight?: number }

/** Chrome's collapsing toolbar is not a new layout or a new chapter. */
export function isToolbarResize(previous: Viewport, next: Viewport, touch: boolean): boolean {
  return touch && previous.width === next.width &&
    previous.layoutHeight === next.layoutHeight &&
    Math.abs(next.height - previous.height) <= previous.height * .25
}
