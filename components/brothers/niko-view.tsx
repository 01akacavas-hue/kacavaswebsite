import { ViewTransition } from "react"
import { nikoPromotion, nikoService } from "@/data/niko"
import { ExternalLink } from "@/components/chrome/external-link"
import { Portrait } from "@/components/portrait"
import { Reveal } from "@/components/motion/reveal"

export function NikoView() {
  return (
    <>
      <header className="grid items-end gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.7fr)]">
        <div>
          <p className="flex items-center gap-3 text-xs tracking-[0.22em] text-niko uppercase">
            <span className="captain-bars" aria-hidden="true">
              <span />
              <span />
            </span>
            United States Army
          </p>
          <h1 className="mt-4 font-serif text-6xl tracking-tight sm:text-8xl">Nicholas</h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            Captain, U.S. Army. West Point, class of 2022. Cavalry officer.
          </p>
        </div>
        <ViewTransition name="portrait-niko">
          <div className="relative aspect-[4/5] bg-ink-2">
            <Portrait id="niko" priority sizes="(max-width: 768px) 100vw, 360px" />
          </div>
        </ViewTransition>
      </header>

      <Reveal className="mt-14 max-w-2xl space-y-5 text-lg leading-relaxed">
        <p>
          I grew up in Manchester, New Hampshire, with my identical twin, Elias, and our younger
          brother, Alec. I studied political science at West Point, with a minor in European regional
          studies, and I graduated in 2022. I serve as a captain and a cavalry officer.
        </p>
        <p className="border-l border-niko pl-5 text-base text-muted">
          Elias calls me type-A, list-oriented, and logical, and he has said he looks up to me. We
          grew up playing the same sports. I love the arts, and in high school I took a summer
          program in political studies.
        </p>
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
