export type PlotPoint<T> = {
  item: T
  x: number
  y: number
}

export type PlacedPoint<T> = PlotPoint<T> & {
  /** True when the pin was moved off its real coordinate so a neighbor can be clicked. */
  offset: boolean
  originX: number
  originY: number
}

/**
 * Spread pins that sit on top of each other at the current zoom.
 * `separation` is in the same units as x/y. Pass `screenPixels / scale`
 * so a cluster opens up on screen and closes again once you zoom in.
 */
export function spiderfy<T>(points: readonly PlotPoint<T>[], separation: number): PlacedPoint<T>[] {
  const pending = points.map((point) => ({ ...point, grouped: false }))
  const placed: PlacedPoint<T>[] = []

  for (const seed of pending) {
    if (seed.grouped) continue
    const group = [seed]
    seed.grouped = true
    let grew = true
    while (grew) {
      grew = false
      for (const other of pending) {
        if (other.grouped) continue
        const near = group.some(
          (member) => Math.hypot(member.x - other.x, member.y - other.y) <= separation,
        )
        if (!near) continue
        other.grouped = true
        group.push(other)
        grew = true
      }
    }

    if (group.length === 1) {
      const only = group[0]
      placed.push({
        item: only.item,
        x: only.x,
        y: only.y,
        originX: only.x,
        originY: only.y,
        offset: false,
      })
      continue
    }

    const centerX = group.reduce((sum, point) => sum + point.x, 0) / group.length
    const centerY = group.reduce((sum, point) => sum + point.y, 0) / group.length
    const ring = separation * 0.85
    group.forEach((point, index) => {
      const angle = -Math.PI / 2 + (index * 2 * Math.PI) / group.length
      placed.push({
        item: point.item,
        x: centerX + Math.cos(angle) * ring,
        y: centerY + Math.sin(angle) * ring,
        originX: point.x,
        originY: point.y,
        offset: true,
      })
    })
  }

  return placed
}
