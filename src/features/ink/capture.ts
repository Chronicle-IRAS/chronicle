const clamp = (value: number) => Math.max(0, Math.min(1, value))
const smooth = (value: number) => { const p = clamp(value); return p * p * (3 - 2 * p) }

/** Elliptical capture in screen space, with a quiet lift before the inward acceleration. */
export function inkCapture(dx: number, dy: number, progress: number, variation = 0) {
  const p = clamp(progress)
  const capture = smooth((p - .12) / .88)
  const lift = Math.sin(Math.PI * clamp(p / .38)) * .045
  const radius = (1 + lift) * Math.pow(1 - capture, .82)
  const angle = capture * (1.55 + variation * .35)
  const flatten = .62
  const x = (dx * Math.cos(angle) - dy / flatten * Math.sin(angle)) * radius
  const y = (dx * Math.sin(angle) * flatten + dy * Math.cos(angle)) * radius
  return {
    x, y,
    rotation: angle * 180 / Math.PI * .55,
    scale: (1 + lift) * (1 - capture * .94),
    opacity: 1 - smooth((capture - .65) / .28),
  }
}
