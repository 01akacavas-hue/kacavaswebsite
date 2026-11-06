import Image from "next/image"
import { ViewTransition } from "react"
import { nikoPromotion, nikoQuotes, nikoService } from "@/data/niko"
import { nicholasPhotos, nikoTank, portraits } from "@/data/images"
import { ExternalLink } from "@/components/chrome/external-link"
import { Portrait } from "@/components/portrait"
import { Reveal } from "@/components/motion/reveal"

export function NikoView() {
  return (
    <>
      <header>
        <p className="flex items-center gap-3 text-xs tracking-[0.22em] text-niko uppercase">
          <span className="captain-bars" aria-hidden="true">
            <span />
            <span />
          </span>
          United States Army
        </p>
        <h1 className="mt-4 font-serif text-6xl tracking-tight sm:text-8xl">Nicholas</h1>
        <p className="mt-3 text-sm tracking-[0.14em] text-muted uppercase">Goes by Niko</p>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Captain, U.S. Army. West Point, class of 2022. Cavalry officer.
        </p>
        <figure className="mt-10">
          <ViewTransition name="portrait-niko">
            <div className="relative aspect-[3/2] w-full bg-ink-2">
              <Portrait id="niko" priority sizes="(max-width: 768px) 100vw, 1100px" className="object-cover object-center" />
            </div>
          </ViewTransition>
          <figcaption className="mt-3 max-w-2xl text-sm text-muted">{portraits.niko.caption}</figcaption>
        </figure>
      </header>

      <Reveal className="mt-14 max-w-2xl space-y-5 text-lg leading-relaxed">
        <p>
          I grew up in Manchester, New Hampshire, with Elias and our younger brother, Alexander. I studied political science at West Point, with a minor in European regional
          studies, and I graduated in 2022. I serve as a captain and a cavalry officer.
        </p>
        <p className="border-l border-niko pl-5 text-base text-muted">
          Elias calls me type-A, list-oriented, and logical, and he has said he looks up to me. We
          grew up playing the same sports. I love the arts, and in high school I took a summer
          program in political studies.
        </p>
      </Reveal>

      <Reveal className="mt-16">
        <h2 className="font-serif text-4xl">In his own words</h2>
        <div className="mt-10 grid max-w-3xl gap-12">
          {nikoQuotes.map((quote) => (
            <blockquote key={quote.text} className="border-l-2 border-niko pl-5">
              <p className="font-serif text-3xl leading-snug text-niko sm:text-5xl">“{quote.text}”</p>
              {quote.context ? <footer className="mt-4 text-sm text-muted">{quote.context}</footer> : null}
            </blockquote>
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-16">
        <figure>
          <div className="relative aspect-[4/3] w-full bg-ink-2">
            <Image src={nikoTank.src} alt={nikoTank.alt} fill sizes="(max-width: 768px) 100vw, 1100px" className="object-cover object-center" />
          </div>
          {nikoTank.caption ? <figcaption className="mt-3 max-w-2xl text-sm text-muted">{nikoTank.caption}</figcaption> : null}
        </figure>
      </Reveal>

      <Reveal className="mt-16">
        <h2 className="font-serif text-4xl">Photographs</h2>
        <p className="mt-3 max-w-2xl text-muted">Whites on a lawn, a full ballpark, dessert, and the three of them at brunch.</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {nicholasPhotos.map((photo) => {
            const wide = photo.width > photo.height
            return (
              <li key={photo.src} className={wide ? "sm:col-span-2" : ""}>
                <figure>
                  <div className={`relative bg-ink-2 ${wide ? "aspect-[4/3]" : "aspect-[3/4]"}`}>
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes={wide ? "(max-width: 768px) 100vw, 960px" : "(max-width: 640px) 100vw, 45vw"}
                      className="object-cover object-center"
                    />
                  </div>
                  {photo.caption ? <figcaption className="mt-2 text-sm text-muted">{photo.caption}</figcaption> : null}
                </figure>
              </li>
            )
          })}
        </ul>
      </Reveal>

      <Reveal className="mt-16">
        <h2 className="font-serif text-4xl">Service</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Promoted to captain in {nikoPromotion.year}. The West Point Association of Graduates lists
          Nicholas H. Kacavas ’22. The list does not give the day.
        </p>
        <ol className="mt-8 border-l border-line">
          {nikoService.map((entry) => (
            <li key={entry.id} className="grid gap-2 py-5 pl-6 sm:grid-cols-[11rem_minmax(0,1fr)]">
              <p className="font-mono text-sm text-niko">{entry.period}</p>
              <div>
                <h3 className="font-serif text-2xl">{entry.title}</h3>
                <p className="mt-1 text-sm text-muted">{entry.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal className="mt-16 max-w-xl border border-line p-6">
        <p className="text-xs tracking-[0.18em] text-muted uppercase">Our grandfather</p>
        <p className="mt-3 leading-relaxed">
          Nicholas G. Kacavas, 1927–2012, served in the United States Navy during the Second World War.
        </p>
      </Reveal>

      <p className="mt-10">
        <ExternalLink href="https://www.linkedin.com/in/nicholas-kacavas-b65337201">LinkedIn</ExternalLink>
      </p>
    </>
  )
}
