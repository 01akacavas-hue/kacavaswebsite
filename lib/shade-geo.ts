import { feature } from "topojson-client"
import type { Feature, FeatureCollection, Geometry } from "geojson"
import type { GeometryCollection, Topology } from "topojson-specification"
import { canonicalCountry } from "@/data/niko-countries"
import { countriesVisited, visitedStates } from "@/lib/leaderboard"
import { brothersInOrder } from "@/lib/places"
import { brotherKey } from "@/lib/shade-color"
import { brotherIds, type BrotherId, type Place } from "@/lib/types"
import rawCountries from "../public/maps/countries-50m.json"
import rawStates from "../public/maps/states-10m.json"

type NamedProperties = { name?: string }

type CountryTopology = Topology<{
  countries: GeometryCollection<NamedProperties>
}>

type StateTopology = Topology<{
  states: GeometryCollection<NamedProperties>
}>

const countryTopology = rawCountries as unknown as CountryTopology
const stateTopology = rawStates as unknown as StateTopology

const countryCollection = feature(countryTopology, countryTopology.objects.countries) as FeatureCollection<Geometry, NamedProperties>
const stateCollection = feature(stateTopology, stateTopology.objects.states) as FeatureCollection<Geometry, NamedProperties>

/** Territories in the census file that are not states and not the District. */
const excludedStateNames = new Set([
  "American Samoa",
  "Commonwealth of the Northern Mariana Islands",
  "Guam",
  "Puerto Rico",
  "United States Virgin Islands",
])

/**
 * Natural Earth names for the country strings the guides already use.
 * England and the United Kingdom share one shape.
 */
const countryGeoNames: Record<string, string> = {
  "United States": "United States of America",
  "Czech Republic": "Czechia",
  England: "United Kingdom",
  "United Kingdom": "United Kingdom",
  "Dominican Republic": "Dominican Rep.",
  "Turks and Caicos": "Turks and Caicos Is.",
  "Vatican City": "Vatican",
}

export function countryGeoName(country: string): string {
  const canonical = canonicalCountry(country)
  return countryGeoNames[canonical] ?? canonical
}

/** Census name for a state. Washington, DC is the District polygon. */
export function stateGeoName(state: string): string {
  if (state === "Washington, DC") return "District of Columbia"
  return state
}

export type ShadeProperties = {
  name: string
  brothers: string
}

export type ShadeCounts = { 1: number; 2: number; 3: number }

function brothersFor(groups: Map<string, Set<BrotherId>>, name: string): BrotherId[] {
  return brothersInOrder([...(groups.get(name) ?? [])])
}

function countryBrothers(places: readonly Place[]): Map<string, Set<BrotherId>> {
  const groups = new Map<string, Set<BrotherId>>()
  for (const brother of brotherIds) {
    for (const country of countriesVisited(places, brother)) {
      const name = countryGeoName(country)
      const current = groups.get(name) ?? new Set<BrotherId>()
      current.add(brother)
      groups.set(name, current)
    }
  }
  return groups
}

function stateBrothers(places: readonly Place[]): Map<string, Set<BrotherId>> {
  const groups = new Map<string, Set<BrotherId>>()
  for (const brother of brotherIds) {
    for (const state of visitedStates(places, brother)) {
      const name = stateGeoName(state)
      const current = groups.get(name) ?? new Set<BrotherId>()
      current.add(brother)
      groups.set(name, current)
    }
  }
  return groups
}

function painted(name: string, brothers: readonly BrotherId[], geometry: Geometry): Feature<Geometry, ShadeProperties> {
  return {
    type: "Feature",
    properties: { name, brothers: brotherKey(brothers) },
    geometry,
  }
}

export function countryShadeGeoJSON(places: readonly Place[]): FeatureCollection<Geometry, ShadeProperties> {
  const groups = countryBrothers(places)
  const features: Feature<Geometry, ShadeProperties>[] = []
  for (const item of countryCollection.features) {
    const name = item.properties?.name
    if (!name) continue
    const brothers = brothersFor(groups, name)
    if (brothers.length === 0) continue
    features.push(painted(name, brothers, item.geometry))
  }
  return { type: "FeatureCollection", features }
}

export function stateShadeGeoJSON(places: readonly Place[]): FeatureCollection<Geometry, ShadeProperties> {
  const groups = stateBrothers(places)
  const features: Feature<Geometry, ShadeProperties>[] = []
  for (const item of stateCollection.features) {
    const name = item.properties?.name
    if (!name || excludedStateNames.has(name)) continue
    features.push(painted(name, brothersFor(groups, name), item.geometry))
  }
  return { type: "FeatureCollection", features }
}

export function shadeCounts(collection: FeatureCollection<Geometry, ShadeProperties>): ShadeCounts {
  const counts: ShadeCounts = { 1: 0, 2: 0, 3: 0 }
  for (const item of collection.features) {
    const brothers = item.properties?.brothers ?? ""
    if (!brothers) continue
    const size = brothers.split(",").length
    if (size === 1 || size === 2 || size === 3) counts[size] += 1
  }
  return counts
}

export function unshadedCountryNames(places: readonly Place[]): string[] {
  const drawn = new Set(countryShadeGeoJSON(places).features.map((item) => item.properties?.name))
  const missing = new Set<string>()
  for (const brother of brotherIds) {
    for (const country of countriesVisited(places, brother)) {
      const geo = countryGeoName(country)
      if (!drawn.has(geo)) missing.add(`${country} -> ${geo}`)
    }
  }
  return [...missing].sort()
}

export function unshadedStateNames(places: readonly Place[]): string[] {
  const drawn = new Set(stateShadeGeoJSON(places).features.map((item) => item.properties?.name))
  const missing = new Set<string>()
  for (const brother of brotherIds) {
    for (const state of visitedStates(places, brother)) {
      const geo = stateGeoName(state)
      if (!drawn.has(geo)) missing.add(`${state} -> ${geo}`)
    }
  }
  return [...missing].sort()
}
