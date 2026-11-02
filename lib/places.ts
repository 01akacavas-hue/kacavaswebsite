import { brotherIds, type BrotherId, type Place, type PlaceFilter, type PlaceSortKey } from "./types"

export function filterPlaces(places: readonly Place[], filter: PlaceFilter): Place[] {
  if (filter === "all") return [...places]
  return places.filter((place) => place.brothers.includes(filter))
}

export type PlaceQuery = {
  text: string
  city: string
  neighborhood: string
  category: string
  brother: PlaceFilter
}

export const emptyPlaceQuery: PlaceQuery = {
  text: "",
  city: "all",
  neighborhood: "all",
  category: "all",
  brother: "all",
}

export function queryPlaces(places: readonly Place[], query: PlaceQuery): Place[] {
  const text = query.text.trim().toLowerCase()
  return places.filter((place) => {
    if (query.brother !== "all" && !place.brothers.includes(query.brother)) return false
    if (query.city !== "all" && place.city !== query.city) return false
    if (query.neighborhood !== "all" && (place.neighborhood ?? "") !== query.neighborhood) return false
    if (query.category !== "all" && place.category !== query.category) return false
    if (!text) return true
    const haystack = [place.name, place.city, place.neighborhood, place.category, place.notes, place.country]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
    return haystack.includes(text)
  })
}

export function sortPlaces(places: readonly Place[], key: PlaceSortKey, direction: "asc" | "desc"): Place[] {
  const sorted = [...places].sort((a, b) => {
    const result = comparePlaces(a, b, key)
    return direction === "asc" ? result : -result
  })
  return sorted
}

function comparePlaces(a: Place, b: Place, key: PlaceSortKey): number {
  if (key === "price" || key === "stars") {
    const av = a[key] ?? -1
    const bv = b[key] ?? -1
    if (av !== bv) return av - bv
  } else {
    const av = (key === "neighborhood" ? a.neighborhood : a[key]) ?? ""
    const bv = (key === "neighborhood" ? b.neighborhood : b[key]) ?? ""
    const result = av.localeCompare(bv, undefined, { sensitivity: "base" })
    if (result !== 0) return result
  }
  const city = a.city.localeCompare(b.city, undefined, { sensitivity: "base" })
  if (city !== 0) return city
  return a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
}

export function uniqueValues(places: readonly Place[], key: "city" | "neighborhood" | "category"): string[] {
  const values = new Set<string>()
  for (const place of places) {
    const value = place[key]
    if (value) values.add(value)
  }
  return [...values].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
}

export function placesInCity(places: readonly Place[], place: Place): Place[] {
  return places
    .filter((item) => item.city === place.city && Boolean(item.wishlist) === Boolean(place.wishlist))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
}

export function priceLabel(price: Place["price"]): string {
  if (!price) return ""
  return "$".repeat(price)
}

export function starLabel(stars: Place["stars"]): string {
  if (!stars) return ""
  return "★".repeat(stars)
}

export function googleMapsUrl(place: Place): string {
  const query = [place.name, place.neighborhood, place.city, place.country].filter(Boolean).join(", ")
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export function brotherLabel(id: BrotherId): string {
  if (id === "alec") return "Alexander"
  if (id === "eli") return "Elias"
  return "Nicholas"
}

/** Nicholas, then Elias, then Alexander. */
export function brothersInOrder(ids: readonly BrotherId[]): BrotherId[] {
  return [...ids].sort((a, b) => brotherIds.indexOf(a) - brotherIds.indexOf(b))
}
