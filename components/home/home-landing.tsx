import Image from "next/image"
import Link from "next/link"
import { brothers } from "@/data/brothers"
import { familyMoments, familyPhoto } from "@/data/images"
import { SiteLinks } from "@/components/chrome/site-links"

const order = ["alec", "eli", "niko"] as const

export function HomeLanding() {
  const cards = order.map((id) => brothers.find((brother) => brother.id === id)).filter((brother) => brother != null)

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-24 sm:px-8">
      <header className="grid items-end gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
        <div>
          <p className="text-xs tracking-[0.22em] text-muted uppercase">Manchester, New Hampshire</p>
          <h1 id="home-title" className="mt-3 font-serif text-6xl tracking-tight sm:text-8xl">
            Kacavas
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
            Elias, Nicholas, and Alexander. Three brothers, one house on the internet, and the places they keep.
          </p>
          <p className="mt-8">
            <a href="#brothers" className="text-xs tracking-[0.16em] uppercase underline decoration-line underline-offset-4">
              The brothers
            </a>
          </p>
        </div>
        <figure className="relative">
          <div className="relative aspect-[3/4] overflow-hidden bg-ink-2 sm:aspect-[4/3]">
            <Image
              src={familyPhoto.src}
              alt={familyPhoto.alt}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 720px"
              className="object-cover object-[center_22%] sm:object-center"
            />
          </div>
          <figcaption className="mt-3 text-sm text-muted">The three of them, in the backyard.</figcaption>
        </figure>
      </header>

      <ul className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible">
        {familyMoments.map((photo) => (
          <li key={photo.src} className="relative aspect-[3/4] w-[78%] shrink-0 snap-start overflow-hidden bg-ink-2 md:w-auto">
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 768px) 78vw, 30vw" className="object-cover" />
          </li>
        ))}
      </ul>

      <section id="brothers" aria-labelledby="brothers-title" className="mt-20 scroll-mt-24">
        <h2 id="brothers-title" className="font-serif text-4xl tracking-tight">
          The brothers
        </h2>
        <p className="mt-3 max-w-xl text-muted">Each keeps his own page. Start with whichever one you came for.</p>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {cards.map((brother) => (
            <li key={brother.id}>
              <article className="flex h-full flex-col border border-line border-t-2 p-5" style={{ borderTopColor: brother.accent }}>
                <p className="text-xs tracking-[0.18em] uppercase" style={{ color: brother.accent }}>
                  {brother.epithet}
                </p>
                <h3 className="mt-2 font-serif text-4xl tracking-tight">{brother.shortName}</h3>
                {"knownAs" in brother && brother.knownAs ? (
                  <p className="mt-2 text-sm text-muted">Goes by {brother.knownAs}.</p>
                ) : null}
                <p className="mt-3 flex-1 leading-relaxed text-muted">{brother.bio}</p>
                <Link
                  href={brother.href}
                  className="mt-6 inline-flex h-11 items-center text-xs tracking-[0.16em] uppercase"
                  style={{ color: brother.accent }}
                >
                  {brother.shortName}&apos;s page
                  <span aria-hidden="true"> →</span>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="places-title" className="mt-16 border border-line p-6 sm:p-8">
        <p className="text-xs tracking-[0.18em] text-muted uppercase">Private</p>
        <h2 id="places-title" className="mt-2 font-serif text-4xl tracking-tight">
          Restaurants & places
        </h2>
        <p className="mt-3 max-w-xl leading-relaxed text-muted">
          A map of tables and towns. A password opens it.
        </p>
        <Link href="/restaurants" className="mt-6 inline-flex h-11 items-center text-xs tracking-[0.16em] uppercase underline decoration-line underline-offset-4">
          Open the map
        </Link>
      </section>

      <div className="mt-16 border-t border-line pt-6">
        <SiteLinks />
      </div>
    </div>
  )
}
