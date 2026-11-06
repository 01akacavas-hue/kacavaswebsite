import type { BrotherId, Place } from "@/lib/types"
import { canonicalCountry, nikoVisitedCountries } from "./niko-countries"
import { brotherLabel } from "@/lib/places"

export type CountryVisitList = {
  brother: BrotherId
  /** Canonical country names. America is the United States, and Czechia is the Czech Republic. */
  countries: readonly string[]
}

/**
 * Visited-country lists. A country pin is added only when that brother has no place in the country yet.
 * Add the next list here. If a new country has no center below, the build fails until one is added.
 */
export const countryVisitLists: readonly CountryVisitList[] = [
  { brother: "niko", countries: nikoVisitedCountries },
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
}

function countryId(brother: BrotherId, country: string): string {
  const slug = country
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
  return `country-${brother}-${slug}`
}

/**
 * One pin per listed country that this brother does not already have a place in.
 * A restaurant, a recommendation, or any other pin in that country is enough to skip it.
 */
export function countryPinsFor(existing: readonly Place[], lists: readonly CountryVisitList[] = countryVisitLists): Place[] {
  const covered = new Set<string>()
  for (const place of existing) {
    if (place.countryPin) continue
    const country = canonicalCountry(place.country)
    for (const brother of place.brothers) covered.add(`${brother}\0${country}`)
  }

  const pins: Place[] = []
  for (const list of lists) {
    for (const raw of list.countries) {
      const country = canonicalCountry(raw)
      const key = `${list.brother}\0${country}`
      if (covered.has(key)) continue
      const center = countryCenters[country]
      if (!center) throw new Error(`No country center for ${country}`)
      covered.add(key)
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
        notes: `${brotherLabel(list.brother)} has been. No specific place is on the map yet.`,
      })
    }
  }
  return pins
}
