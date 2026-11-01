import Image from "next/image"
import { gallery } from "@/data/images"

const groups = ["Portraits", "The Vanity", "Stills"] as const

export function Gallery() {
  return (
    <div className="mt-12 space-y-14">
      {groups.map((group) => {
        const items = gallery.filter((item) => item.group === group)
        return (
          <section key={group} aria-labelledby={`gallery-${group}`}>
            <h2 id={`gallery-${group}`} className="font-serif text-3xl">
              {group}
            </h2>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <li key={item.id} className="border border-line">
                  <div className="relative aspect-[4/5] bg-ink-2">
                    <Image src={item.src} alt={item.alt} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                  </div>
                  <p className="p-4 text-sm text-muted">{item.caption}</p>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
