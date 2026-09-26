export type Impulse = { x: number; y: number; spin: number }

export function sampleImpulse(impulse: Impulse, progress: number) {
  const t = Math.max(0, Math.min(1, progress))
  return { x: impulse.x * t, y: impulse.y * t + 650 * t * t, rotation: impulse.spin * t }
}

export function textImpulse(index: number): Impulse {
  return { x: Math.sin(index * 2.4 + 1) * 360, y: -140 - (index % 4) * 45, spin: Math.cos(index * 1.7) * 95 }
}
