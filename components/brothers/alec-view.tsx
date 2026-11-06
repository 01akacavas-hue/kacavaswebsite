import Image from "next/image"
import { ViewTransition } from "react"
import { academyAwardPhoto, alecQuote, alecRoles } from "@/data/alec"
import { alexanderGrill, alexanderPhotos, portraits } from "@/data/images"
import { ExternalLink } from "@/components/chrome/external-link"
import { Portrait } from "@/components/portrait"
import { Reveal } from "@/components/motion/reveal"

export function AlecView() {
  const current = alecRoles.find((role) => role.current)

  return (
    <>
      <header className="grid items-end gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <div>
          <p className="text-xs tracking-[0.22em] text-alec uppercase">GTM lead</p>
          <h1 className="mt-3 font-serif text-6xl tracking-tight sm:text-8xl">Alexander</h1>
          <p className="mt-3 text-sm tracking-[0.14em] text-muted uppercase">Goes by Alec</p>
          <p className="mt-4 max-w-xl text-lg text-muted">
            GTM lead at Lance, in San Francisco. I went to Babson, and I love any sport.
          </p>
        </div>
        <figure>
          <ViewTransition name="portrait-alec">
            <div className="relative aspect-[4/5] bg-ink-2">
              <Portrait id="alec" priority sizes="(max-width: 768px) 100vw, 420px" />
            </div>
          </ViewTransition>
          <figcaption className="mt-2 text-sm text-muted">{portraits.alec.caption}</figcaption>
        </figure>
      </header>

      <Reveal className="mt-12 max-w-3xl">
        <blockquote className="border-l-2 border-alec pl-5">
          <p className="font-serif text-2xl leading-snug sm:text-3xl">“{alecQuote.text}”</p>
          <footer className="mt-4 text-sm text-muted">
            <ExternalLink href={alecQuote.href}>{alecQuote.source}</ExternalLink>
          </footer>
        </blockquote>
      </Reveal>

      {current ? (
        <Reveal className="mt-12 border border-alec/50 p-6 sm:p-8">
          <p className="text-xs tracking-[0.18em] text-alec uppercase">Now</p>
          <h2 className="mt-2 font-serif text-4xl">
            {current.title}, {current.org}
          </h2>
          <p className="mt-2 font-mono text-sm text-muted">
            {current.period} · {current.place}
          </p>
          <p className="mt-4 max-w-2xl leading-relaxed">{current.detail}</p>
          <p className="mt-4">
            <ExternalLink href="https://lance.live">lance.live</ExternalLink>
          </p>
        </Reveal>
      ) : null}

      <Reveal className="mt-16">
        <h2 className="font-serif text-4xl">Highlights</h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <article className="border border-line">
            <div className="relative aspect-[3/2] bg-ink-2">
              <Image
                src={academyAwardPhoto.src}
                alt={academyAwardPhoto.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-xs tracking-[0.18em] text-alec uppercase">Film</p>
              <h3 className="mt-2 font-serif text-4xl">CODA</h3>
              <p className="mt-4 leading-relaxed">
                I was in the movie CODA, which won Best Picture at the Oscars, the 94th Academy Awards, in 2022.
              </p>
              <p className="mt-4 text-xs leading-relaxed text-faint">
                {academyAwardPhoto.depicted}. Photo by <ExternalLink href={academyAwardPhoto.authorUrl}>{academyAwardPhoto.author}</ExternalLink>,{" "}
                <ExternalLink href={academyAwardPhoto.licenseUrl}>{academyAwardPhoto.license}</ExternalLink>, via{" "}
                <ExternalLink href={academyAwardPhoto.sourceUrl}>Wikimedia Commons</ExternalLink>.
              </p>
            </div>
          </article>
          <article className="flex flex-col justify-between border border-line p-6 sm:p-8">
            <p className="text-xs tracking-[0.18em] text-alec uppercase">World record</p>
            <p className="mt-8 font-serif text-7xl tracking-tight sm:text-8xl">1,430</p>
            <div className="mt-8">
              <h3 className="font-serif text-3xl">Longest continuous shotski</h3>
              <p className="mt-4 leading-relaxed">I hold a world record: the longest continuous shotski, with 1,430 people, in Park City, Utah.</p>
            </div>
          </article>
          <article className="grid border border-line lg:col-span-2 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
            <div className="relative aspect-[3/4] min-h-72 bg-ink-2 lg:aspect-auto lg:h-full">
              <Image
                src={alexanderGrill.src}
                alt={alexanderGrill.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 280px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <p className="text-xs tracking-[0.18em] text-alec uppercase">Grill</p>
              <h3 className="mt-2 font-serif text-4xl">Resident grillmaster.</h3>
              <p className="mt-4 max-w-xl leading-relaxed">I am the resident grillmaster. If there is a board of steaks, I cooked them.</p>
            </div>
          </article>
        </div>
      </Reveal>

      <Reveal className="mt-16">
        <h2 className="font-serif text-4xl">Record</h2>
        <p className="mt-3 max-w-2xl text-muted">
          I went to Babson, including the Management Consulting Field Experience. A few of these dates overlap, the way they do on my profile.
        </p>
        <ol className="mt-8">
          {alecRoles.map((role) => (
            <li key={role.id} className="grid gap-2 border-t border-line py-6 sm:grid-cols-[12rem_minmax(0,1fr)]">
              <p className="font-mono text-sm text-alec">{role.period}</p>
              <div>
                <h3 className="font-serif text-2xl">
                  {role.title}
                  <span className="text-muted">, {role.org}</span>
                </h3>
                <p className="mt-1 text-sm text-faint">{role.place}</p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{role.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal className="mt-16">
        <h2 className="font-serif text-4xl">Photographs</h2>
        <p className="mt-3 max-w-2xl text-muted">San Francisco, the water, a race bib, and the bottle still closed.</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {alexanderPhotos.map((photo) => {
            const frame = photoFrame(photo)
            return (
            <li key={photo.src} className={frame.item}>
              <figure>
                <div className={`relative bg-ink-2 ${frame.frame}`}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes={photo.wide ? "(max-width: 768px) 100vw, 1100px" : "(max-width: 640px) 100vw, 30vw"}
                    className="object-cover"
                  />
                </div>
                {photo.caption ? <figcaption className="mt-2 max-w-2xl text-sm text-muted">{photo.caption}</figcaption> : null}
              </figure>
            </li>
            )
          })}
        </ul>
      </Reveal>

      <Reveal className="mt-12 max-w-2xl">
        <h2 className="font-serif text-3xl">Outside</h2>
        <p className="mt-4 leading-relaxed">
          I play and organize Rho Hoops, a five-on-five run with San Francisco founders. In 2026 I moderated a startup fireside chat. I grew up in a sports-heavy house with my brothers.
        </p>
        <p className="mt-6">
          <ExternalLink href="https://www.linkedin.com/in/aleckacavas">LinkedIn</ExternalLink>
        </p>
      </Reveal>
    </>
  )
}

function photoFrame(photo: { width: number; height: number; wide?: boolean }) {
  const ratio = photo.width / photo.height
  if (photo.wide || ratio >= 1.15) {
    return {
      item: "sm:col-span-3",
      frame: ratio >= 1.5 ? "aspect-[8/5]" : "aspect-[4/3]",
    }
  }
  return { item: "", frame: "aspect-[3/4]" }
}
