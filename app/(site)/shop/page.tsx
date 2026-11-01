import type { Metadata } from "next"
import { Page } from "@/components/chrome/page"
import { ShopGrid } from "@/components/shop/shop-grid"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata("shop")

export default function ShopPage() {
  return (
    <Page>
      <p className="text-xs tracking-[0.2em] text-muted uppercase">Shop</p>
      <h1 className="mt-3 font-serif text-6xl tracking-tight">The shelf</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Four example cards, so the shelf has a shape. Nothing here is for sale, and checkout is not
        connected. Stripe has a route waiting in the API when a real piece is ready.
      </p>
      <ShopGrid />
    </Page>
  )
}
