import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { recolorStyle } from "../lib/globe-style"
import {
  brotherCount,
  defaultMapFilters,
  parseMapFilters,
  placeMatches,
  serializeMapFilters,
  visiblePlaces,
} from "../lib/map-filters"
import { placesToGeoJSON } from "../lib/pins"
import { citiesForBrother, greatCircle, splitDateline, trailLines } from "../lib/trails"
import type { Place } from "../lib/types"

function place(partial: Partial<Place> & Pick<Place, "id" | "city" | "latitude" | "longitude">): Place {
  return {
    name: partial.id,
    country: "United States",
    category: "restaurant",
    brothers: ["alec"],
    notes: "A note.",
    ...partial,
  }
}

const sample: Place[] = [
  place({ id: "boston", city: "Boston", latitude: 42.36, longitude: -71.06 }),
  place({ id: "paris", city: "Paris", latitude: 48.86, longitude: 2.35, brothers: ["niko"], country: "France" }),
  place({
    id: "shared",
    city: "Boston",
    latitude: 42.35,
    longitude: -71.07,
    brothers: ["alec", "niko"],
    recommended: true,
    notes: "Try this.",
  }),
  place({ id: "later", city: "Lisbon", latitude: 38.72, longitude: -9.14, wishlist: true, brothers: ["eli"] }),
]

describe("map filters", () => {
  it("round-trips the defaults as an empty query", () => {
    const filters = defaultMapFilters()
    assert.equal(serializeMapFilters(filters), "")
    assert.deepEqual(parseMapFilters(new URLSearchParams("")), filters)
  })

  it("keeps a narrower query in the URL", () => {
    const filters = {
      ...defaultMapFilters(),
      brothers: ["niko" as const],
      visits: ["recommended" as const],
      categories: ["restaurant" as const],
      city: "Boston",
      query: "toast",
      view: "list" as const,
      trails: ["alec" as const],
      placeId: "shared",
    }
    const parsed = parseMapFilters(new URLSearchParams(serializeMapFilters(filters)), new Set(["shared"]))
    assert.deepEqual(parsed, filters)
  })

  it("drops an unknown place id and treats a missing trail list as off", () => {
    const parsed = parseMapFilters(new URLSearchParams("place=missing"), new Set(["shared"]))
    assert.equal(parsed.placeId, null)
    assert.deepEqual(parsed.trails, [])
  })

  it("filters visits, brothers, and shared pins", () => {
    const filters = { ...defaultMapFilters(), brothers: ["niko" as const], visits: ["recommended" as const] }
    assert.deepEqual(
      visiblePlaces(sample, filters).map((item) => item.id),
      ["shared"],
    )
    assert.equal(placeMatches(sample[0]!, { ...defaultMapFilters(), visits: ["recommended"] }), false)
    assert.equal(brotherCount(sample, defaultMapFilters(), "alec"), 2)
    assert.equal(brotherCount(sample, { ...defaultMapFilters(), visits: ["visited"] }, "eli"), 0)
  })
})

describe("trails and pins", () => {
  it("orders visited cities west to east and skips open rings", () => {
    const stops = citiesForBrother(
      [
        place({ id: "east", city: "Paris", latitude: 48.8, longitude: 2.3 }),
        place({ id: "west", city: "Boston", latitude: 42.3, longitude: -71 }),
        place({ id: "open", city: "Rome", latitude: 41.9, longitude: 12.5, recommended: true }),
      ],
      "alec",
    )
    assert.deepEqual(
      stops.map((stop) => stop.city),
      ["Boston", "Paris"],
    )
  })

  it("keeps the great-circle ends and splits a dateline jump", () => {
    const arc = greatCircle([-70, 40], [2, 48], 8)
    assert.equal(arc[0]?.[0], -70)
    assert.ok(Math.abs((arc.at(-1)?.[0] ?? 0) - 2) < 1e-6)
    const split = splitDateline([
      [170, 10],
      [176, 11],
      [-176, 12],
      [-170, 13],
    ])
    assert.equal(split.length, 2)
    assert.equal(split[0]?.length, 2)
    assert.equal(split[1]?.length, 2)
    const lines = trailLines([
      { city: "A", country: "United States", latitude: 21, longitude: 170 },
      { city: "B", country: "United States", latitude: 21, longitude: -170 },
    ])
    assert.ok(lines.length >= 2)
  })

  it("marks a shared recommendation with two brothers and an open ring", () => {
    const feature = placesToGeoJSON(sample).features.find((item) => item.properties.id === "shared")
    assert.equal(feature?.properties.primary, "alec")
    assert.equal(feature?.properties.secondary, "niko")
    assert.equal(feature?.properties.open, 1)
    assert.equal(feature?.properties.alec, 0.5)
    assert.equal(feature?.properties.niko, 0.5)
  })
})

describe("editorial style", () => {
  it("recolors land, water, and roads without dropping layers", () => {
    const style = recolorStyle({
      layers: [
        { id: "background", type: "background", paint: { "background-color": "#fff" } },
        { id: "water", type: "fill", paint: { "fill-color": "#000" } },
        { id: "highway_major_inner", type: "line", paint: { "line-color": ["interpolate", ["linear"], ["zoom"], 5, "#fff"] } },
        { id: "label_city", type: "symbol", paint: { "text-color": "#000", "text-halo-color": "#fff" } },
      ],
    })
    assert.equal(style.layers[0]?.paint?.["background-color"], "#f4efe4")
    assert.equal(style.layers[1]?.paint?.["fill-color"], "#c5d5e4")
    assert.equal(style.layers[2]?.paint?.["line-color"], "#f3ece3")
    assert.equal(style.layers[3]?.paint?.["text-color"], "#3f3a34")
    assert.equal(style.layers[3]?.paint?.["text-halo-color"], "#f7f3ec")
  })
})
