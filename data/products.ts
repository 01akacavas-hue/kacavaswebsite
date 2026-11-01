import type { Product } from "@/lib/types"

/**
 * Shop inventory.
 *
 * The four items below are examples so the shelf has a shape. They are not
 * for sale. To add a real product:
 *
 *   1. Add an image under `public/` and point `image` at it.
 *   2. Set `example` to false.
 *   3. Create a Stripe Price and set `stripePriceId`.
 *   4. Follow the steps in `app/api/checkout/route.ts`.
 */

export const products: readonly Product[] = [
  {
    id: "example-house-tee",
    name: "House tee",
    description: "Example. A heavyweight tee with the three-color mark. Not for sale.",
    priceCents: 4800,
    image: "/images/placeholders/tee.svg",
    imageAlt: "Placeholder image of a house tee",
    example: true,
  },
  {
    id: "example-marquee-print",
    name: "Marquee print",
    description: "Example. A typographic print in Eli's gold. Not for sale.",
    priceCents: 3600,
    image: "/images/placeholders/print.svg",
    imageAlt: "Placeholder image of a marquee print",
    example: true,
  },
  {
    id: "example-field-cap",
    name: "Field cap",
    description: "Example. An olive cap with a small mark. Not for sale.",
    priceCents: 3200,
    image: "/images/placeholders/cap.svg",
    imageAlt: "Placeholder image of a field cap",
    example: true,
  },
  {
    id: "example-note-cards",
    name: "Note cards",
    description: "Example. A set of four cards, one for each city on the map. Not for sale.",
    priceCents: 1800,
    image: "/images/placeholders/cards.svg",
    imageAlt: "Placeholder image of a set of note cards",
    example: true,
  },
]

export function getProduct(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}
