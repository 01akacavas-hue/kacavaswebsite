import type { Place, PlaceFilter } from "./types"

export function filterPlaces(places: readonly Place[], filter: PlaceFilter): Place[] {
  if (filter === "all") return [...places]
  return places.filter((place) => place.brothers.includes(filter))
}
