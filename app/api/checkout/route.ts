import { NextResponse } from "next/server"
import { getProduct } from "@/data/products"
import { isRecord, isSameOrigin, readJson } from "@/lib/http"

/**
 * Stripe Checkout extension point. Nothing is charged from this route yet.
 *
 * When the shop should take payment:
 * 1. `npm install stripe`
 * 2. Set `STRIPE_SECRET_KEY` in Vercel (Production and Preview).
 * 3. Create a Price in Stripe and set `stripePriceId` on the product in `data/products.ts`.
 * 4. Set that product's `example` field to false.
 * 5. Replace the final response below with a Checkout Session:
 *
 *    import Stripe from "stripe"
 *    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
 *    const origin = new URL(request.url).origin
 *    const session = await stripe.checkout.sessions.create({
 *      mode: "payment",
 *      line_items: [{ price: product.stripePriceId, quantity: 1 }],
 *      success_url: `${origin}/shop?checkout=success`,
 *      cancel_url: `${origin}/shop?checkout=cancel`,
 *    })
 *    return NextResponse.json({ url: session.url })
 *
 * The shop button stays disabled while `example` is true, so this route is
 * not called for the placeholder cards.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Cross-site request blocked." }, { status: 403 })
  }

  const body = await readJson(request)
  const productId = isRecord(body) && typeof body.productId === "string" ? body.productId : null
  if (!productId) {
    return NextResponse.json({ error: "Missing productId." }, { status: 400 })
  }

  const product = getProduct(productId)
  if (!product) {
    return NextResponse.json({ error: "Unknown product." }, { status: 404 })
  }

  if (product.example || !product.stripePriceId) {
    return NextResponse.json({ error: "Checkout is not available for this item." }, { status: 501 })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 501 })
  }

  return NextResponse.json({ error: "Stripe Checkout is not wired yet." }, { status: 501 })
}
