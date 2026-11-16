import { alecStateVisits } from "@/data/alec-states"
import { brotherLabel, brothersInOrder } from "@/lib/places"
import { stateForCity } from "@/lib/us-states"
import type { BrotherId, Place } from "@/lib/types"

/**
 * Interior points for state pins. These are the state, not a city and not a restaurant.
 * A state he already has a place in does not get a pin, so it does not need a center.
 */
const stateCenters: Record<string, { latitude: number; longitude: number }> = {
  Arizona: { latitude: 34.27, longitude: -111.66 },
  Arkansas: { latitude: 34.8, longitude: -92.2 },
  Maryland: { latitude: 39.06, longitude: -76.8 },
  Mississippi: { latitude: 32.74, longitude: -89.68 },
  Missouri: { latitude: 38.36, longitude: -92.46 },
  "New Jersey": { latitude: 40.19, longitude: -74.67 },
  "North Carolina": { latitude: 35.55, longitude: -79.39 },
  Pennsylvania: { latitude: 40.97, longitude: -77.73 },
  "Rhode Island": { latitude: 41.68, longitude: -71.58 },
  "South Carolina": { latitude: 33.84, longitude: -81.16 },
  Texas: { latitude: 31.48, longitude: -99.33 },
  Utah: { latitude: 39.32, longitude: -111.09 },
  Virginia: { latitude: 37.52, longitude: -78.85 },
  Wyoming: { latitude: 43.0, longitude: -107.55 },
}

export function stateVisitSentence(brother: BrotherId, state: string, note: string): string {
  return `${brotherLabel(brother)} visited and stayed in ${state}.\n\n${note}`
}

function stateSlug(state: string): string {
  return state
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function coveredStateKeys(existing: readonly Place[]): Set<string> {
  const covered = new Set<string>()
  for (const place of existing) {
    if (place.countryPin || place.statePin || place.country !== "United States") continue
    const state = stateForCity(place.city)
    if (!state) continue
    for (const brother of place.brothers) covered.add(`${brother}\0${state}`)
  }
  for (const place of existing) {
    if (!place.statePin || !place.state) continue
    for (const brother of place.brothers) covered.add(`${brother}\0${place.state}`)
  }
  return covered
}

/** Keep his note on places he already has in that state, instead of adding another pin. */
export function attachStateNotes(places: readonly Place[]): Place[] {
  const covered = coveredStateKeys(places)
  const notes = new Map<string, string>()
  for (const visit of alecStateVisits) {
    const key = `${visit.brother}\0${visit.state}`
    if (!covered.has(key)) continue
    notes.set(key, stateVisitSentence(visit.brother, visit.state, visit.note))
  }
  return places.map((place) => {
    if (place.countryPin || place.statePin || place.country !== "United States") return place
    const state = stateForCity(place.city)
    if (!state) return place
    const parts: string[] = []
    for (const brother of brothersInOrder(place.brothers)) {
      const text = notes.get(`${brother}\0${state}`)
      if (text) parts.push(text)
    }
    if (parts.length === 0) return place
    const visitNote = [place.visitNote, ...parts].filter(Boolean).join("\n\n")
    return { ...place, visitNote }
  })
}

/** One state pin per visit that this brother does not already have a place in. */
export function statePinsFor(existing: readonly Place[]): Place[] {
  const covered = coveredStateKeys(existing)
  const pins: Place[] = []
  for (const visit of alecStateVisits) {
    const key = `${visit.brother}\0${visit.state}`
    if (covered.has(key)) continue
    const center = stateCenters[visit.state]
    if (!center) throw new Error(`No state center for ${visit.state}`)
    covered.add(key)
    pins.push({
      id: `state-${visit.brother}-${stateSlug(visit.state)}`,
      name: visit.state,
      city: "",
      country: "United States",
      category: "state",
      latitude: center.latitude,
      longitude: center.longitude,
      approximate: true,
      statePin: true,
      state: visit.state,
      brothers: [visit.brother],
      notes: stateVisitSentence(visit.brother, visit.state, visit.note),
    })
  }
  return pins
}
