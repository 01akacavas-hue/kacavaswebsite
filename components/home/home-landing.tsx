import Image from "next/image"
import Link from "next/link"
import { brothers } from "@/data/brothers"
import { familyMoments, familyPhoto } from "@/data/images"
import { SiteLinks } from "@/components/chrome/site-links"

export function HomeLanding() {

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-24 sm:px-8">
      <header className="grid items-end gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
        <div>
          <p className="text-xs tracking-[0.22em] text-muted uppercase">Manchester, New Hampshire</p>
          <h1 id="home-title" className="mt-3 font-serif text-6xl tracking-tight sm:text-8xl">
            Kacavas
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
            Nicholas, Elias, and Alexander. Three brothers from Manchester, one house on the internet, and the places they keep.
          </p>
          <p className="mt-8">
            <a href="#brothers" className="text-xs tracking-[0.16em] uppercase underline decoration-line underline-offset-4">
              The brothers
            </a>
          </p>
        </div>
        <figure className="relative">
          <div className="relative aspect-[4/3] overflow-hidden bg-ink-2">
            <Image
              src={familyPhoto.src}
              alt={familyPhoto.alt}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 720px"
              className="object-cover object-center"
            />
          </div>
          <figcaption className="mt-3 max-w-xl text-sm text-muted">{familyPhoto.caption}</figcaption>
        </figure>
      </header>

      <ul className="mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:gap-x-4 sm:gap-y-10 sm:overflow-visible">
        {familyMoments.map((photo) => {
          const wide = photo.width > photo.height
          return (
            <li
              key={photo.src}
              className={wide ? "w-[88%] shrink-0 snap-start sm:col-span-3 sm:w-auto" : "w-[72%] shrink-0 snap-start sm:w-auto"}
            >
              <figure>
                <div className={`relative overflow-hidden bg-ink-2 ${wide ? "aspect-[4/3]" : "aspect-[3/4]"}`}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes={wide ? "(max-width: 640px) 88vw, 1100px" : "(max-width: 640px) 72vw, 33vw"}
                    className="object-cover object-center"
                  />
                </div>
                {photo.caption ? <figcaption className="mt-2 max-w-2xl text-sm text-muted">{photo.caption}</figcaption> : null}
              </figure>
            </li>
          )
        })}
      </ul>

      <section id="brothers" aria-labelledby="brothers-title" className="mt-20 scroll-mt-24">
        <h2 id="brothers-title" className="font-serif text-4xl tracking-tight">
          The brothers
        </h2>
        <p className="mt-3 max-w-xl text-muted">Each of them has a page. Start with the brother you came to see.</p>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {brothers.map((brother) => (
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
          Tables, towns, and the places they would send a brother. A password opens the map.
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
