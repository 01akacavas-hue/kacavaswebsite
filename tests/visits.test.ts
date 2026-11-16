import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, it } from "node:test"
import { alecStateVisits } from "../data/alec-states"
import { countryVisitLists } from "../data/country-pins"
import { places } from "../data/places"
import { visitedStates } from "../lib/leaderboard"
import { mixBrotherColors } from "../lib/shade-color"
import { accents } from "../lib/theme"
import { countryShadeGeoJSON, shadeCounts, stateShadeGeoJSON, unshadedCountryNames, unshadedStateNames } from "../lib/shade-geo"
import type { Geometry } from "geojson"

function firstCoordinate(geometry: Geometry | undefined): number[] | null {
  if (!geometry) return null
  const point = geometry.type === "Polygon" ? geometry.coordinates[0]?.[0] : geometry.type === "MultiPolygon" ? geometry.coordinates[0]?.[0]?.[0] : null
  if (!point || point.length < 2) return null
  return point
}

const root = join(import.meta.dirname, "..")

describe("Alexander's visits", () => {
  it("adds a state pin only where he has no place, and attaches the note otherwise", () => {
    const pins = places.filter((place) => place.statePin && place.brothers.includes("alec"))
    assert.deepEqual(
      pins.map((place) => place.state).sort(),
      [
        "Arizona",
        "Arkansas",
        "Maryland",
        "Mississippi",
        "Missouri",
        "New Jersey",
        "North Carolina",
        "Pennsylvania",
        "Rhode Island",
        "South Carolina",
        "Texas",
        "Utah",
        "Virginia",
        "Wyoming",
      ],
    )
    for (const visit of alecStateVisits) {
      const pin = places.find((place) => place.statePin && place.state === visit.state && place.brothers.includes(visit.brother))
      const attached = places.some(
        (place) => !place.statePin && place.brothers.includes(visit.brother) && place.visitNote?.includes(visit.note),
      )
      assert.equal(Boolean(pin) !== attached, true, visit.state)
      const text = pin?.notes ?? places.find((place) => place.visitNote?.includes(visit.note))?.visitNote ?? ""
      assert.match(text, new RegExp(`visited and stayed in ${visit.state.replace(",", "\\,")}`))
      assert.equal(text.includes("\u2014"), false, visit.state)
      assert.equal(/\bEli\b/.test(text), false, visit.state)
    }
    assert.equal(pins.length, 14)
    assert.equal([...visitedStates(places, "alec")].includes("Idaho"), false)
    assert.equal([...visitedStates(places, "alec")].includes("Washington, DC"), true)
    assert.equal([...visitedStates(places, "alec")].includes("District of Columbia"), false)
    assert.match(places.find((place) => place.id === "boston-rowes-wharf")?.visitNote ?? "", /College and living in Boston/)
    assert.match(places.find((place) => place.id === "dc-proper-21")?.visitNote ?? "", /Adams Morgan/)
    assert.match(places.find((place) => place.id === "nola-frenchmen")?.visitNote ?? "", /Café du Monde/)
    assert.match(places.find((place) => place.state === "Wyoming")?.notes ?? "", /Idaho/)
    assert.equal(
      places.some((place) => place.visitNote?.includes("Staying up north at Congels' in the Steanatles")),
      true,
    )
  })

  it("adds a country pin only where he has no place, and attaches the note otherwise", () => {
    const list = countryVisitLists.find((item) => item.brother === "alec")
    if (!list) throw new Error("Alexander's country list is missing")
    const pins = places.filter((place) => place.countryPin && place.brothers.includes("alec"))
    assert.deepEqual(
      pins.map((place) => place.country).sort(),
      ["Barbados", "Canada", "Dominican Republic", "Greece", "Italy", "Jamaica", "Netherlands", "Poland", "South Africa", "Vatican City"],
    )
    for (const country of list.countries) {
      const note: string | undefined = list.notes?.[country]
      const pin = places.find((place) => place.countryPin && place.country === country && place.brothers.includes("alec"))
      if (!note) {
        assert.equal(pin?.country, "Vatican City")
        assert.match(pin?.notes ?? "", /Alexander has been\. No specific place is on the map yet\./)
        continue
      }
      const attached = places.some(
        (place) => !place.countryPin && place.country === country && place.brothers.includes("alec") && place.visitNote?.includes(note),
      )
      assert.equal(Boolean(pin) !== attached, true, country)
      const text: string = pin?.notes ?? places.find((place) => place.visitNote?.includes(note))?.visitNote ?? ""
      assert.match(text, new RegExp(`has been to ${country.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`))
      assert.equal(text.includes("\u2014"), false, country)
      assert.equal(/\bEli\b/.test(text), false, country)
    }
    const poland = places.find((place) => place.id === "country-alec-poland")
    assert.match(poland?.notes ?? "", /Kraków with Niko/)
    assert.equal(/deploy/i.test(poland?.notes ?? ""), false)
    assert.match(places.find((place) => place.id === "tamarindo-pico")?.visitNote ?? "", /San José and Tamarindo/)
    assert.match(places.find((place) => place.id === "london-oxo")?.visitNote ?? "", /Love London and Farnborough/)
    assert.match(places.find((place) => place.id === "barcelona-tapas-catalana")?.visitNote ?? "", /as a jit/)
    assert.equal(
      places.some((place) => place.countryPin && place.country === "Costa Rica"),
      false,
    )
    assert.equal(
      places.some((place) => place.countryPin && place.country === "Spain" && place.brothers.includes("alec")),
      false,
    )
    assert.equal(
      places.some((place) => place.countryPin && place.country === "United Kingdom"),
      false,
    )
  })

  it("keeps em dashes and Eli out of the new visit copy", () => {
    for (const file of ["data/alec-states.ts", "data/country-pins.ts", "data/state-pins.ts", "components/map/shade-legend.tsx"]) {
      const text = readFileSync(join(root, file), "utf8")
      assert.equal(text.includes("\u2014"), false, file)
      assert.equal(text.includes("\u2013"), false, file)
    }
  })
})

describe("visit shading", () => {
  it("mixes brother colors in Oklab and keeps a single accent exact", () => {
    assert.equal(mixBrotherColors(["niko"]), accents.niko)
    assert.equal(mixBrotherColors(["eli"]), accents.eli)
    assert.equal(mixBrotherColors(["alec"]), accents.alec)
    assert.equal(mixBrotherColors(["eli", "niko"]), mixBrotherColors(["niko", "eli"]))
    const pair = mixBrotherColors(["niko", "eli"])
    const triple = mixBrotherColors(["niko", "eli", "alec"])
    assert.match(pair, /^#[0-9a-f]{6}$/)
    assert.match(triple, /^#[0-9a-f]{6}$/)
    assert.notEqual(pair, accents.niko)
    assert.notEqual(triple, pair)
  })

  it("shades every visited country and state, and counts who has been", () => {
    assert.deepEqual(unshadedCountryNames(places), [])
    assert.deepEqual(unshadedStateNames(places), [])
    const countries = countryShadeGeoJSON(places)
    const states = stateShadeGeoJSON(places)
    assert.equal(states.features.length, 51)
    assert.deepEqual(shadeCounts(countries), { 1: 17, 2: 9, 3: 0 })
    assert.deepEqual(shadeCounts(states), { 1: 17, 2: 10, 3: 1 })
    const vatican = countries.features.find((feature) => feature.properties?.name === "Vatican")
    assert.equal(vatican?.properties?.brothers, "alec")
    assert.equal(
      countries.features.some((feature) => feature.properties?.name === "United States of America"),
      false,
    )
    const york = states.features.find((feature) => feature.properties?.name === "New York")
    assert.equal(york?.properties?.brothers, "niko,eli,alec")
    const idaho = states.features.find((feature) => feature.properties?.name === "Idaho")
    assert.equal(idaho?.properties?.brothers, "")
    const alaska = states.features.find((feature) => feature.properties?.name === "Alaska")
    const hawaii = states.features.find((feature) => feature.properties?.name === "Hawaii")
    const district = states.features.find((feature) => feature.properties?.name === "District of Columbia")
    assert.equal(alaska?.properties?.brothers, "")
    assert.equal(hawaii?.properties?.brothers, "alec")
    assert.equal(district?.properties?.brothers, "niko,alec")
    const hawaiiPoint = firstCoordinate(hawaii?.geometry)
    const alaskaPoint = firstCoordinate(alaska?.geometry)
    assert.ok(hawaiiPoint && hawaiiPoint[0] < -140 && hawaiiPoint[1] < 30)
    assert.ok(alaskaPoint && alaskaPoint[1] > 50)
  })

  it("keeps state outlines on the globe instead of hiding them behind the United States view", () => {
    const source = readFileSync(join(root, "components/map/globe-map.tsx"), "utf8")
    assert.equal(source.includes('scope === "us" ? "visible"'), false)
    assert.equal(source.includes('scope === "us" ? ["!='), false)
  })
})
