export type BallPoint = { x: number; y: number }

export function nearestFusionTarget(
  points: readonly BallPoint[],
  moving: number,
  radius: number,
  unavailable: readonly number[] = [],
): number {
  let closest = radius * 1.75
  let target = -1
  points.forEach((point, index) => {
    if (index === moving || unavailable.includes(index)) return
    const distance = Math.hypot(point.x - points[moving].x, point.y - points[moving].y)
    if (distance < closest) {
      closest = distance
      target = index
    }
  })
  return target
}

export function arrangeBalls(width: number, height: number): BallPoint[] {
  if (width >= 560) {
    return Array.from({ length: 8 }, (_, index) => {
      const angle = -Math.PI * 0.75 + (index * Math.PI) / 4
      return {
        x: width / 2 + Math.cos(angle) * width * 0.36,
        y: height / 2 + Math.sin(angle) * height * 0.33,
      }
    })
  }
  const columns = width < 560 ? 2 : 4
  const rows = 8 / columns
  return Array.from({ length: 8 }, (_, i) => ({
    x: (width * ((i % columns) + 0.5)) / columns,
    y: (height * (Math.floor(i / columns) + 0.5)) / rows,
  }))
}

export function clampBallPosition(
  point: BallPoint,
  width: number,
  height: number,
  radius: number,
): BallPoint {
  const pad = Math.min(radius + 10, Math.min(width, height) * 0.25)
  return {
    x: Math.max(pad, Math.min(Math.max(pad, width - pad), point.x)),
    y: Math.max(pad, Math.min(Math.max(pad, height - pad), point.y)),
  }
}

export function computeFusionPoint(
  movingPoint: BallPoint,
  targetPoint: BallPoint,
  width: number,
  height: number,
  radius: number,
): BallPoint {
  return clampBallPosition(
    {
      x: targetPoint.x * 0.62 + movingPoint.x * 0.38,
      y: targetPoint.y * 0.62 + movingPoint.y * 0.38,
    },
    width,
    height,
    radius,
  )
}

export function ejectRandomTech<T>(
  techIds: readonly T[],
  randomSample = Math.random(),
): { ejected: T; remaining: T[] } | null {
  if (techIds.length < 2) return null
  const clamped = Math.max(0, Math.min(0.999999, randomSample))
  const pickIndex = Math.floor(clamped * techIds.length)
  const ejected = techIds[pickIndex]
  const remaining = techIds.filter((_, index) => index !== pickIndex)
  return { ejected, remaining }
}

export function computeEjectLanding(
  origin: BallPoint,
  existingPoints: readonly BallPoint[],
  width: number,
  height: number,
  radius: number,
  seedAngle = 0,
): BallPoint {
  const distance = Math.max(radius * 2.35, 128)
  const center = { x: width / 2, y: height / 2 }
  const towardCenter = Math.atan2(center.y - origin.y, center.x - origin.x)

  for (let attempt = 0; attempt < 8; attempt++) {
    const offset = ((attempt % 2 === 0 ? 1 : -1) * Math.ceil(attempt / 2) * Math.PI) / 4
    const angle = attempt === 0 ? seedAngle : towardCenter + offset
    const candidate = clampBallPosition(
      {
        x: origin.x + Math.cos(angle) * distance,
        y: origin.y + Math.sin(angle) * distance,
      },
      width,
      height,
      radius,
    )
    const crowded = existingPoints.some(
      other => Math.hypot(other.x - candidate.x, other.y - candidate.y) < radius * 1.65,
    )
    if (!crowded) return candidate
  }

  return clampBallPosition(
    {
      x: origin.x + Math.cos(towardCenter) * distance,
      y: origin.y + Math.sin(towardCenter) * distance,
    },
    width,
    height,
    radius,
  )
}
