import { brotherIds, placeCategories, type BrotherId, type Place, type PlaceCategory } from "./types"

export type VisitState = "visited" | "recommended"

export type MapView = "map" | "list" | "board"

export type MapFilters = {
  /** Brothers currently drawn. Empty means none. */
  brothers: BrotherId[]
  visits: VisitState[]
  /** `null` means every type. An empty list means none. */
  categories: PlaceCategory[] | null
  city: string
  query: string
  view: MapView
  trails: BrotherId[]
  placeId: string | null
}

export function defaultMapFilters(): MapFilters {
  return {
    brothers: [...brotherIds],
    visits: ["visited", "recommended"],
    categories: null,
    city: "",
    query: "",
    view: "map",
    trails: [],
    placeId: null,
  }
}

export function isOpenRing(place: Place): boolean {
  return Boolean(place.recommended || place.wishlist)
}

export function placeStateLabel(place: Place): string {
  if (place.wishlist) return "Next up"
  if (place.recommended) return "Recommended"
  return "Visited"
}

export function placeMatches(place: Place, filters: MapFilters): boolean {
  if (filters.brothers.length === 0 || !place.brothers.some((id) => filters.brothers.includes(id))) return false
  const open = isOpenRing(place)
  if (open && !filters.visits.includes("recommended")) return false
  if (!open && !filters.visits.includes("visited")) return false
  if (filters.categories && !filters.categories.includes(place.category)) return false
  if (filters.city && place.city !== filters.city) return false
  const query = filters.query.trim().toLowerCase()
  if (!query) return true
  const haystack = [place.name, place.city, place.neighborhood, place.country, place.category, place.notes]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
  return haystack.includes(query)
}

export function visiblePlaces(places: readonly Place[], filters: MapFilters): Place[] {
  return places.filter((place) => placeMatches(place, filters))
}

/** How many of this brother's places match every filter except the brother chips. */
export function brotherCount(places: readonly Place[], filters: MapFilters, brother: BrotherId): number {
  const widened: MapFilters = { ...filters, brothers: [brother] }
  return places.filter((place) => place.brothers.includes(brother) && placeMatches(place, widened)).length
}

export type CityOption = {
  city: string
  count: number
  latitude: number
  longitude: number
}

export function cityOptions(places: readonly Place[], filters: MapFilters): CityOption[] {
  const widened: MapFilters = { ...filters, city: "" }
  const grouped = new Map<string, { count: number; latitude: number; longitude: number }>()
  for (const place of places) {
    if (!placeMatches(place, widened) || place.countryPin) continue
    const current = grouped.get(place.city) ?? { count: 0, latitude: 0, longitude: 0 }
    current.count += 1
    current.latitude += place.latitude
    current.longitude += place.longitude
    grouped.set(place.city, current)
  }
  const query = filters.query.trim().toLowerCase()
  const options = [...grouped.entries()].map(([city, value]) => ({
    city,
    count: value.count,
    latitude: value.latitude / value.count,
    longitude: value.longitude / value.count,
  }))
  const matched = query ? options.filter((option) => option.city.toLowerCase().includes(query)) : options
  const list = matched.length > 0 ? matched : options
  return list.sort((a, b) => b.count - a.count || a.city.localeCompare(b.city, undefined, { sensitivity: "base" }))
}

const brotherSet = new Set<string>(brotherIds)
const categorySet = new Set<string>(placeCategories)

function splitParam(value: string | null): string[] {
  if (!value) return []
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
}

function parseBrothers(value: string | null): BrotherId[] {
  if (!value) return [...brotherIds]
  if (value === "none") return []
  return splitParam(value).filter((id): id is BrotherId => brotherSet.has(id))
}

function parseVisits(value: string | null): VisitState[] {
  if (!value) return ["visited", "recommended"]
  if (value === "none") return []
  return splitParam(value).filter((item): item is VisitState => item === "visited" || item === "recommended")
}

function parseCategories(value: string | null): PlaceCategory[] | null {
  if (!value) return null
  if (value === "none") return []
  return splitParam(value).filter((item): item is PlaceCategory => categorySet.has(item))
}

export function parseMapFilters(params: URLSearchParams, placeIds?: ReadonlySet<string>): MapFilters {
  const placeId = params.get("place")
  const viewParam = params.get("view")
  const view: MapView = viewParam === "list" || viewParam === "board" ? viewParam : "map"
  return {
    brothers: parseBrothers(params.get("brothers")),
    visits: parseVisits(params.get("visit")),
    categories: parseCategories(params.get("types")),
    city: params.get("city") ?? "",
    query: params.get("q") ?? "",
    view,
    trails: parseBrothers(params.get("trails") ?? "none"),
    placeId: placeId && (!placeIds || placeIds.has(placeId)) ? placeId : null,
  }
}

export function serializeMapFilters(filters: MapFilters): string {
  const params = new URLSearchParams()
  const allBrothers = brotherIds.every((id) => filters.brothers.includes(id)) && filters.brothers.length === brotherIds.length
  if (!allBrothers) params.set("brothers", filters.brothers.length ? filters.brothers.join(",") : "none")
  const bothVisits = filters.visits.includes("visited") && filters.visits.includes("recommended") && filters.visits.length === 2
  if (!bothVisits) params.set("visit", filters.visits.length ? filters.visits.join(",") : "none")
  if (filters.categories) params.set("types", filters.categories.length ? filters.categories.join(",") : "none")
  if (filters.city) params.set("city", filters.city)
  if (filters.query.trim()) params.set("q", filters.query.trim())
  if (filters.view !== "map") params.set("view", filters.view)
  if (filters.trails.length) params.set("trails", filters.trails.join(","))
  if (filters.placeId) params.set("place", filters.placeId)
  return params.toString()
}
