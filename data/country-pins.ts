import type { BrotherId, Place } from "@/lib/types"
import { canonicalCountry, nikoVisitedCountries } from "./niko-countries"
import { brotherLabel, brothersInOrder } from "@/lib/places"

export type CountryVisitList = {
  brother: BrotherId
  /** Canonical country names. America is the United States, and Czechia is the Czech Republic. */
  countries: readonly string[]
  /** His note for a country. Countries without one use the plain "has been" line. */
  notes?: Readonly<Record<string, string>>
}

/**
 * Visited-country lists. A country pin is added only when that brother has no place in the country yet.
 * Add the next list here. If a new country has no center below, the build fails until one is added.
 */
export const countryVisitLists: readonly CountryVisitList[] = [
  { brother: "niko", countries: nikoVisitedCountries },
  {
    brother: "alec",
    countries: [
      "Canada",
      "Jamaica",
      "Dominican Republic",
      "Barbados",
      "Costa Rica",
      "United Kingdom",
      "Italy",
      "Spain",
      "Netherlands",
      "Greece",
      "Vatican City",
      "Poland",
      "South Africa",
    ],
    notes: {
      Canada: "Ottawa trip with Elias and Niagara with family.",
      Jamaica: "Family trip. Daiquiris and the arcade room.",
      "Dominican Republic": "Punta Cana.",
      Barbados: "2025 Christmas with Pop and the bros.",
      "Costa Rica": "San José and Tamarindo. Ximena and cousins.",
      "United Kingdom": "Love London and Farnborough.",
      Italy: "One of my top 3 countries in the world. Venice, Milan, Rome, and the Amalfi Coast!",
      Spain: "Barcelona backpacking with Johnny and Tossa de Mar with family as a jit.",
      Netherlands: "Amsterdam backpacking.",
      Greece: "Many times with family. Athens, Sparta, Naxos, Paros, Antiparos, and Corfu!",
      Poland: "Kraków with Niko.",
      "South Africa": "Cape Town with the Pottingers and the Eastern Cape with Mindy, David, and Jenean.",
    },
  },
]

/**
 * Approximate geographic centers. These are the country, not a city and not a restaurant.
 * England is England, not the United Kingdom.
 */
const countryCenters: Record<string, { latitude: number; longitude: number }> = {
  Canada: { latitude: 56.13, longitude: -106.35 },
  Jamaica: { latitude: 18.11, longitude: -77.3 },
  Barbados: { latitude: 13.19, longitude: -59.54 },
  "Turks and Caicos": { latitude: 21.69, longitude: -71.8 },
  Greece: { latitude: 39.07, longitude: 21.82 },
  Luxembourg: { latitude: 49.82, longitude: 6.13 },
  Monaco: { latitude: 43.74, longitude: 7.42 },
  Estonia: { latitude: 58.6, longitude: 25.01 },
  Latvia: { latitude: 56.88, longitude: 24.6 },
  England: { latitude: 52.56, longitude: -1.46 },
  Netherlands: { latitude: 52.13, longitude: 5.29 },
  Switzerland: { latitude: 46.82, longitude: 8.23 },
  Austria: { latitude: 47.52, longitude: 14.55 },
  Hungary: { latitude: 47.16, longitude: 19.5 },
  "Dominican Republic": { latitude: 18.9, longitude: -70.4 },
  Italy: { latitude: 42.5, longitude: 12.57 },
  "Vatican City": { latitude: 41.9022, longitude: 12.4533 },
  Poland: { latitude: 51.92, longitude: 19.13 },
  "South Africa": { latitude: -29, longitude: 24 },
  "Costa Rica": { latitude: 9.93, longitude: -84.09 },
  Spain: { latitude: 40.2, longitude: -3.7 },
  "United Kingdom": { latitude: 54, longitude: -2.5 },
}

function countryId(brother: BrotherId, country: string): string {
  const slug = country
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return `country-${brother}-${slug}`
}

export function countryVisitSentence(brother: BrotherId, country: string, note?: string): string {
  if (!note) return `${brotherLabel(brother)} has been. No specific place is on the map yet.`
  return `${brotherLabel(brother)} has been to ${country}.\n\n${note}`
}

function coveredCountryKeys(existing: readonly Place[]): Set<string> {
  const covered = new Set<string>()
  for (const place of existing) {
    if (place.countryPin) continue
    const country = canonicalCountry(place.country)
    for (const brother of place.brothers) covered.add(`${brother}\0${country}`)
  }
  return covered
}

/** Keep his note on places he already has in that country, instead of adding another pin. */
export function attachCountryNotes(places: readonly Place[], lists: readonly CountryVisitList[] = countryVisitLists): Place[] {
  const covered = coveredCountryKeys(places)
  const notes = new Map<string, string>()
  for (const list of lists) {
    for (const [raw, note] of Object.entries(list.notes ?? {})) {
      const country = canonicalCountry(raw)
      const key = `${list.brother}\0${country}`
      if (!note.trim() || !covered.has(key)) continue
      notes.set(key, countryVisitSentence(list.brother, country, note))
    }
  }
  return places.map((place) => {
    if (place.countryPin || place.statePin) return place
    const country = canonicalCountry(place.country)
    const parts: string[] = []
    for (const brother of brothersInOrder(place.brothers)) {
      const text = notes.get(`${brother}\0${country}`)
      if (text) parts.push(text)
    }
    if (parts.length === 0) return place
    const visitNote = [place.visitNote, ...parts].filter(Boolean).join("\n\n")
    return { ...place, visitNote }
  })
}

/**
 * One pin per listed country that this brother does not already have a place in.
 * A restaurant, a recommendation, or any other pin in that country is enough to skip it.
 */
export function countryPinsFor(existing: readonly Place[], lists: readonly CountryVisitList[] = countryVisitLists): Place[] {
  const covered = coveredCountryKeys(existing)
  const pins: Place[] = []
  for (const list of lists) {
    for (const raw of list.countries) {
      const country = canonicalCountry(raw)
      const key = `${list.brother}\0${country}`
      if (covered.has(key)) continue
      const center = countryCenters[country]
      if (!center) throw new Error(`No country center for ${country}`)
      covered.add(key)
      const note = list.notes?.[country] ?? list.notes?.[raw]
      pins.push({
        id: countryId(list.brother, country),
        name: country,
        city: "",
        country,
        category: "country",
        latitude: center.latitude,
        longitude: center.longitude,
        approximate: true,
        countryPin: true,
        brothers: [list.brother],
        notes: countryVisitSentence(list.brother, country, note),
      })
    }
  }
  return pins
}
