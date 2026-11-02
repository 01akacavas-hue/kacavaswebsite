import type { BrotherId, Place } from "./types"
import { isOpenRing } from "./map-filters"

export type LngLat = [number, number]

export type CityStop = {
  city: string
  country: string
  latitude: number
  longitude: number
}

function toVector(longitude: number, latitude: number): [number, number, number] {
  const lambda = (longitude * Math.PI) / 180
  const phi = (latitude * Math.PI) / 180
  const cosine = Math.cos(phi)
  return [cosine * Math.cos(lambda), cosine * Math.sin(lambda), Math.sin(phi)]
}

function fromVector(vector: [number, number, number]): LngLat {
  const [x, y, z] = vector
  return [(Math.atan2(y, x) * 180) / Math.PI, (Math.atan2(z, Math.hypot(x, y)) * 180) / Math.PI]
}

/** Points along the shorter great-circle arc, including both ends. */
export function greatCircle(start: LngLat, end: LngLat, steps = 72): LngLat[] {
  const from = toVector(start[0], start[1])
  const to = toVector(end[0], end[1])
  const dot = Math.min(1, Math.max(-1, from[0] * to[0] + from[1] * to[1] + from[2] * to[2]))
  const omega = Math.acos(dot)
  if (omega < 1e-6) return [start, end]
  const points: LngLat[] = []
  for (let index = 0; index <= steps; index += 1) {
    const t = index / steps
    const sine = Math.sin(omega)
    const weightFrom = Math.sin((1 - t) * omega) / sine
    const weightTo = Math.sin(t * omega) / sine
    points.push(
      fromVector([
        weightFrom * from[0] + weightTo * to[0],
        weightFrom * from[1] + weightTo * to[1],
        weightFrom * from[2] + weightTo * to[2],
      ]),
    )
  }
  return points
}

export function splitDateline(points: readonly LngLat[]): LngLat[][] {
  const lines: LngLat[][] = [[]]
  for (let index = 0; index < points.length; index += 1) {
    const point = points[index]
    if (!point) continue
    const previous = points[index - 1]
    if (previous && Math.abs(point[0] - previous[0]) > 180) lines.push([])
    lines[lines.length - 1]?.push(point)
  }
  return lines.filter((line) => line.length >= 2)
}

/**
 * Visited cities only, ordered west to east. The guide has no dates, so this
 * is a reading order, not a reconstructed trip.
 */
export function citiesForBrother(places: readonly Place[], brother: BrotherId): CityStop[] {
  const grouped = new Map<string, { country: string; latitude: number; longitude: number; count: number }>()
  for (const place of places) {
    if (!place.brothers.includes(brother) || isOpenRing(place)) continue
    const current = grouped.get(place.city) ?? { country: place.country, latitude: 0, longitude: 0, count: 0 }
    current.latitude += place.latitude
    current.longitude += place.longitude
    current.count += 1
    grouped.set(place.city, current)
  }
  return [...grouped.entries()]
    .map(([city, value]) => ({
      city,
      country: value.country,
      latitude: value.latitude / value.count,
      longitude: value.longitude / value.count,
    }))
    .sort((a, b) => a.longitude - b.longitude || a.city.localeCompare(b.city, undefined, { sensitivity: "base" }))
}

export function trailLines(stops: readonly CityStop[]): LngLat[][] {
  if (stops.length < 2) return []
  const points: LngLat[] = []
  for (let index = 0; index < stops.length - 1; index += 1) {
    const from = stops[index]
    const to = stops[index + 1]
    if (!from || !to) continue
    const segment = greatCircle([from.longitude, from.latitude], [to.longitude, to.latitude])
    if (index > 0) segment.shift()
    points.push(...segment)
  }
  return splitDateline(points)
}
