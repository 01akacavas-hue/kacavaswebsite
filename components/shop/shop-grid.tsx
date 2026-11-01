import Image from "next/image"
import { products } from "@/data/products"
import { formatPrice } from "@/lib/money"

export function ShopGrid() {
  return (
    <ul className="mt-12 grid gap-6 sm:grid-cols-2">
      {products.map((product) => (
        <li key={product.id} className="flex flex-col border border-line">
          <div className="relative aspect-square bg-ink-2">
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col p-5">
            <p className="text-[0.68rem] tracking-[0.16em] text-faint uppercase">Example</p>
            <h2 className="mt-2 font-serif text-3xl">{product.name}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{product.description}</p>
            <p className="mt-4 font-mono text-sm">{formatPrice(product.priceCents)}</p>
            <button
              type="button"
              disabled
              className="mt-4 h-11 border border-line text-xs tracking-[0.16em] text-muted uppercase"
            >
              Checkout coming soon
              <span className="sr-only">. This example is not for sale.</span>
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
