import { creditCount, oscarCount, type BrotherRecord } from "@/data/achievements"
import { isOpenRing } from "./map-filters"
import { stateForCity } from "./us-states"
import { brotherIds, type BrotherId, type Place } from "./types"

export type StatValue = number | null

export type BrotherScore = {
  id: BrotherId
  countries: number
  cities: number
  states: number
  michelin: number
  movies: StatValue
  shows: StatValue
  oscars: StatValue
}

export type StatKey = "countries" | "cities" | "states" | "michelin" | "movies" | "shows" | "oscars"

export const statRows: readonly { key: StatKey; label: string; hint: string }[] = [
  { key: "countries", label: "Countries", hint: "Counted once per country, and only after a visit." },
  { key: "cities", label: "Cities", hint: "Counted once per city, and only after a visit." },
  { key: "states", label: "States", hint: "U.S. visits only. Washington is counted as the District of Columbia." },
  { key: "michelin", label: "Michelin dinners", hint: "A star counts when the note names it, and only if he has been." },
  { key: "movies", label: "Movies", hint: "Shorts stay on the filmography. They are not counted here." },
  { key: "shows", label: "TV shows", hint: "Series he appeared in." },
  { key: "oscars", label: "Oscars", hint: "Best Picture films he appeared in. Not a personal award." },
]

function visitedBy(place: Place, brother: BrotherId): boolean {
  return place.brothers.includes(brother) && !isOpenRing(place)
}

export function scoreBrother(places: readonly Place[], brother: BrotherId, record: BrotherRecord): BrotherScore {
  const countries = new Set<string>()
  const cities = new Set<string>()
  const states = new Set<string>()
  let michelin = 0
  for (const place of places) {
    if (!visitedBy(place, brother)) continue
    countries.add(place.country)
    cities.add(`${place.city}\u0000${place.country}`)
    if (place.country === "United States") {
      const state = stateForCity(place.city)
      if (state) states.add(state)
    }
    if (place.michelin) michelin += 1
  }
  return {
    id: brother,
    countries: countries.size,
    cities: cities.size,
    states: states.size,
    michelin,
    movies: creditCount(record.movies),
    shows: creditCount(record.shows),
    oscars: oscarCount(record.movies),
  }
}

export function scoreboard(places: readonly Place[], records: Record<BrotherId, BrotherRecord>): BrotherScore[] {
  return brotherIds.map((id) => scoreBrother(places, id, records[id]))
}

export function rankBy(scores: readonly BrotherScore[], key: StatKey): BrotherScore[] {
  return [...scores].sort((a, b) => {
    const av = a[key] ?? -1
    const bv = b[key] ?? -1
    if (av !== bv) return bv - av
    return brotherIds.indexOf(a.id) - brotherIds.indexOf(b.id)
  })
}
