/**
 * The home cube has four physical sides and three stops.
 * Elias, Nicholas, and Alec are the stops. The fourth side is a monogram
 * the cube passes through when the cycle wraps, so a turn never lands on a blank face.
 *
 * Angles are Y rotations in radians. Negative rotation brings the next brother forward.
 */

export const BROTHER_FACE_COUNT = 3

const STOP = [0, -Math.PI / 2, -Math.PI] as const
const TAU = Math.PI * 2
const COAST_SECONDS = 0.22
const FLICK_RADIANS_PER_SECOND = 0.9

export type TurnDirection = 1 | -1

export function advanceBrother(
  index: number,
  direction: TurnDirection,
  currentTarget: number,
): { index: number; angle: number } {
  const safeIndex = normalizeIndex(index)
  const next = normalizeIndex(safeIndex + direction)
  const delta =
    direction === 1
      ? safeIndex === 2
        ? -Math.PI
        : -Math.PI / 2
      : safeIndex === 0
        ? Math.PI
        : Math.PI / 2
  return { index: next, angle: currentTarget + delta }
}

/** Closest absolute angle that presents `index`, measured from `fromAngle`. */
export function angleForIndex(index: number, fromAngle: number): number {
  const base = STOP[normalizeIndex(index)]
  const turn = Math.round((fromAngle - base) / TAU)
  return base + TAU * turn
}

export function snapToBrother(
  angle: number,
  velocity: number,
): { index: number; angle: number } {
  const projected = angle + velocity * COAST_SECONDS
  const preferAhead = Math.abs(velocity) > FLICK_RADIANS_PER_SECOND
  let bestIndex = 0
  let bestAngle = 0
  let bestScore = Number.POSITIVE_INFINITY
  const center = Math.round(projected / TAU)

  for (let turn = center - 2; turn <= center + 2; turn += 1) {
    for (let index = 0; index < BROTHER_FACE_COUNT; index += 1) {
      const candidate = turn * TAU + STOP[index]
      let score = Math.abs(candidate - projected)
      if (preferAhead) {
        const ahead = velocity < 0 ? candidate < angle - 0.08 : candidate > angle + 0.08
        if (!ahead) score += Math.PI
      }
      const closer = score < bestScore - 1e-9
      const tiePrefersForward = Math.abs(score - bestScore) <= 1e-9 && candidate < bestAngle
      if (closer || tiePrefersForward) {
        bestScore = score
        bestIndex = index
        bestAngle = candidate
      }
    }
  }

  return { index: bestIndex, angle: bestAngle }
}

/** Brother currently most square to the camera. The monogram side is never returned. */
export function indexFromAngle(angle: number): number {
  const norm = ((angle % TAU) + TAU) % TAU
  const stops = [
    { index: 0, at: 0 },
    { index: 1, at: (3 * Math.PI) / 2 },
    { index: 2, at: Math.PI },
  ]
  let best = 0
  let bestDistance = Number.POSITIVE_INFINITY
  for (const stop of stops) {
    const raw = Math.abs(norm - stop.at)
    const distance = Math.min(raw, TAU - raw)
    if (distance < bestDistance) {
      bestDistance = distance
      best = stop.index
    }
  }
  return best
}

function normalizeIndex(index: number): number {
  return ((index % BROTHER_FACE_COUNT) + BROTHER_FACE_COUNT) % BROTHER_FACE_COUNT
}
