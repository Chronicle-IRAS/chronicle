export type DriftBody = {
  id: string
  x: number; y: number; vx: number; vy: number
  anchorX: number; anchorY: number
  rx: number; ry: number
  phase: number; time: number
  linked: boolean; fixed: boolean
}
export type DriftBounds = { left: number; right: number; top: number; bottom: number }
export type DragTarget = { body: DriftBody; x: number; y: number }
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

export function collide(a: DriftBody, b: DriftBody) {
  if (a.fixed && b.fixed) return
  const dx = b.x - a.x, dy = b.y - a.y
  const rx = a.rx + b.rx + 6, ry = a.ry + b.ry + 6
  const distance = Math.hypot(dx / rx, dy / ry)
  if (distance >= 1) return
  const length = Math.hypot(dx, dy)
  const nx = length > .001 ? dx / length : 1, ny = length > .001 ? dy / length : 0
  const overlap = length > .001 ? length / Math.max(distance, .00001) - length : rx
  const ma = a.fixed ? 0 : 1 / (a.rx * a.ry), mb = b.fixed ? 0 : 1 / (b.rx * b.ry)
  const total = ma + mb
  a.x -= nx * overlap * ma / total; a.y -= ny * overlap * ma / total
  b.x += nx * overlap * mb / total; b.y += ny * overlap * mb / total
  const closing = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny
  if (closing < 0) {
    const impulse = -closing * 1.48 / total
    a.vx -= impulse * nx * ma; a.vy -= impulse * ny * ma
    b.vx += impulse * nx * mb; b.vy += impulse * ny * mb
  }
}

function contain(body: DriftBody, bounds: DriftBounds) {
  if (body.fixed) return
  const left = bounds.left + body.rx, right = Math.max(left, bounds.right - body.rx)
  const top = bounds.top + body.ry, bottom = Math.max(top, bounds.bottom - body.ry)
  if (body.x < left || body.x > right) { body.x = clamp(body.x, left, right); body.vx *= -.55 }
  if (body.y < top || body.y > bottom) { body.y = clamp(body.y, top, bottom); body.vy *= -.55 }
}

export function stepDrift(bodies: DriftBody[], elapsed: number, bounds: DriftBounds, drag?: DragTarget) {
  const dt = clamp(elapsed, 0, .04)
  if (!dt) return
  const startX = drag?.body.x ?? 0, startY = drag?.body.y ?? 0
  // Sweep held nodes through intervening space; quick drags must not tunnel through neighbours.
  const travel = drag ? Math.hypot(drag.x - startX, drag.y - startY) : 0
  const steps = Math.min(64, Math.max(2, Math.ceil(travel / 18)))
  const h = dt / steps
  for (let step = 1; step <= steps; step++) {
    if (drag) {
      drag.body.x = startX + (drag.x - startX) * step / steps
      drag.body.y = startY + (drag.y - startY) * step / steps
      drag.body.vx = clamp((drag.x - startX) / dt, -400, 400)
      drag.body.vy = clamp((drag.y - startY) / dt, -400, 400)
    }
    for (const body of bodies) {
      if (body.fixed) continue
      body.time += h
      const span = body.linked ? 12 : 105
      const targetX = body.anchorX + Math.sin(body.time * .31 + body.phase) * span
      const targetY = body.anchorY + Math.sin(body.time * .39 + body.phase * 1.7) * span * .65
      const spring = body.linked ? .9 : .42
      body.vx = clamp((body.vx + (targetX - body.x) * spring * h) * Math.exp(-.85 * h), -180, 180)
      body.vy = clamp((body.vy + (targetY - body.y) * spring * h) * Math.exp(-.85 * h), -180, 180)
      body.x += body.vx * h; body.y += body.vy * h
      contain(body, bounds)
    }
    for (let pass = 0; pass < 3; pass++) {
      for (let a = 0; a < bodies.length; a++) {
        for (let b = a + 1; b < bodies.length; b++) collide(bodies[a], bodies[b])
      }
      for (const body of bodies) contain(body, bounds)
    }
  }
}
