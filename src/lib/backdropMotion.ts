import { clamp } from './math'

/** Keep the existing parallax geometry, but animate transforms on its owners. */
export function backdropTransforms(progress: number, heroProgress: number, px: number, py: number, width: number, height: number) {
  const p = clamp(progress)
  const hero = clamp(heroProgress)
  const shift = width > 720 ? hero * width * 0.08 : 0
  return {
    orb: `translate3d(${(shift + px * 18).toFixed(2)}px, ${(py * 12 - p * height * 0.04).toFixed(2)}px, 0) scale(${(1 - hero * 0.06 + p * 0.08).toFixed(4)})`,
    glow: `translate3d(${shift.toFixed(2)}px, 0, 0)`,
    orbit: `rotate(${(p * 140).toFixed(2)}deg)`,
    node: `rotate(${(-90 + p * 320).toFixed(2)}deg) translateX(calc(var(--s) * 0.57))`,
    ghost: `translate3d(0, ${(-p * height * 0.14).toFixed(2)}px, 0)`,
    waves: `translate3d(0, ${(p * height * 0.08).toFixed(2)}px, 0)`,
    near: `translateY(${(-p * 60).toFixed(2)}px)`,
    far: `translateY(${(-p * 140).toFixed(2)}px)`,
    crossX: `translateY(${(py * 10).toFixed(2)}px)`,
    crossY: `translateX(${(px * 14).toFixed(2)}px)`,
  }
}
