import type { Feature, FeatureCollection, MultiLineString, Point } from "geojson"
import type { BrotherId, Place } from "./types"
import { isOpenRing } from "./map-filters"
import { citiesForBrother, trailLines } from "./trails"

export type PinProperties = {
  id: string
  primary: BrotherId
  secondary: BrotherId | ""
  open: 0 | 1
  alec: number
  niko: number
  eli: number
}

export function placesToGeoJSON(places: readonly Place[]): FeatureCollection<Point, PinProperties> {
  return {
    type: "FeatureCollection",
    features: places.map((place) => {
      const [primary, second, third] = place.brothers
      const share = 1 / place.brothers.length
      const feature: Feature<Point, PinProperties> = {
        type: "Feature",
        id: place.id,
        geometry: { type: "Point", coordinates: [place.longitude, place.latitude] },
        properties: {
          id: place.id,
          primary: primary ?? "alec",
          secondary: second ?? third ?? "",
          open: isOpenRing(place) ? 1 : 0,
          alec: place.brothers.includes("alec") ? share : 0,
          niko: place.brothers.includes("niko") ? share : 0,
          eli: place.brothers.includes("eli") ? share : 0,
        },
      }
      return feature
    }),
  }
}

export type TrailProperties = { brother: BrotherId }

export function trailsToGeoJSON(places: readonly Place[], brothers: readonly BrotherId[]): FeatureCollection<MultiLineString, TrailProperties> {
  const features: Feature<MultiLineString, TrailProperties>[] = []
  for (const brother of brothers) {
    const lines = trailLines(citiesForBrother(places, brother))
    if (lines.length === 0) continue
    features.push({
      type: "Feature",
      properties: { brother },
      geometry: { type: "MultiLineString", coordinates: lines },
    })
  }
  return { type: "FeatureCollection", features }
}
