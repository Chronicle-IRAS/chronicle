export type SpaceCamera = { depth: number; turn: number; pan: number; warp: number; visible: number }

export function createStarField(count: number, seed = 1207): Float32Array {
  const stars = new Float32Array(count * 5)
  let value = seed
  const random = () => { value = (Math.imul(value, 1664525) + 1013904223) >>> 0; return value / 4294967296 }
  for (let i = 0; i < count; i++) {
    stars.set([(random() - 0.5) * 1800, (random() - 0.5) * 1200, random() * 1600, 1 + random() * 1.7, random()], i * 5)
  }
  return stars
}
