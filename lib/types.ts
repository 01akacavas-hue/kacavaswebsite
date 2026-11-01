export const brotherIds = ["eli", "niko", "alec"] as const

export type BrotherId = (typeof brotherIds)[number]

export type PlaceFilter = "all" | BrotherId

export type PlaceType = "restaurant" | "place"

export type SocialLink = {
  label: string
  href: string
}

export type Place = {
  id: string
  name: string
  city: string
  /** Country or territory name, written out. */
  country: string
  type: PlaceType
  /** Decimal degrees. Positive is north. */
  latitude: number
  /** Decimal degrees. Positive is east. */
  longitude: number
  brothers: readonly BrotherId[]
  notes: string
  /**
   * Starter pins are examples. Set this to false only after a brother confirms the visit.
   */
  example: boolean
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
