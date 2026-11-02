export const brotherIds = ["niko", "eli", "alec"] as const

export type BrotherId = (typeof brotherIds)[number]

export type PlaceFilter = "all" | BrotherId

export const placeCategories = [
  "restaurant",
  "bar",
  "cigar lounge",
  "activity",
  "museum",
  "cafe",
  "brewery",
  "club",
  "food hall",
  "park",
  "beach",
  "gallery",
  "lodging",
  "comedy",
] as const

export type PlaceCategory = (typeof placeCategories)[number]

export type PlaceSortKey = "name" | "city" | "neighborhood" | "category" | "price" | "stars"

export const placeGrades = ["A+", "A", "A-", "B+"] as const

export type PlaceGrade = (typeof placeGrades)[number]

export type SocialLink = {
  label: string
  href: string
}

export type Place = {
  id: string
  name: string
  city: string
  neighborhood?: string
  /** Country or territory name, written out. */
  country: string
  category: PlaceCategory
  /** Decimal degrees. Positive is north. */
  latitude: number
  /** Decimal degrees. Positive is east. */
  longitude: number
  /**
   * True when the pin is a city or neighborhood center because the storefront
   * could not be confirmed.
   */
  approximate?: boolean
  brothers: readonly BrotherId[]
  notes: string
  /** Count of `$` marks in the guide, from 1 to 5. */
  price?: 1 | 2 | 3 | 4 | 5
  /** Count of `*` marks used as a rating in the guide, from 1 to 5. */
  stars?: 1 | 2 | 3 | 4 | 5
  /** A letter grade from Nicholas's notes. */
  grade?: PlaceGrade
  /** Michelin stars, kept apart from a personal star rating. */
  michelin?: 1 | 2 | 3
  /** Marked "must try" in the notes. */
  mustTry?: boolean
  /**
   * A recommendation he has not tried. Drawn as an open ring, not a visit.
   */
  recommended?: boolean
  /** A city still to visit. Drawn as an outline pin, separate from the visits. */
  wishlist?: boolean
}

export type Product = {
  id: string
  name: string
  description: string
  /** USD cents. */
  priceCents: number
  image: string
  imageAlt: string
  /** Example cards are not for sale. */
  example: boolean
  /**
   * Stripe Price id (`price_...`). Leave unset until checkout is connected.
   * See `app/api/checkout/route.ts`.
   */
  stripePriceId?: string
}

export type SiteImage = {
  src: string
  alt: string
  width: number
  height: number
}
