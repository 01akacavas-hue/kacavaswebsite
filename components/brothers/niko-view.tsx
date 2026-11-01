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
          <h1 className="mt-4 font-serif text-6xl tracking-tight sm:text-8xl">Captain</h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            Nicholas H. Kacavas. West Point ’22. Cavalry officer. Identical twin of Elias.
          </p>
        </div>
        <div className="relative aspect-[4/5] bg-ink-2">
          <Portrait id="niko" priority sizes="(max-width: 768px) 100vw, 360px" />
        </div>
      </header>

      <Reveal className="mt-14 max-w-2xl space-y-5 text-lg leading-relaxed">
        <p>
          Nicholas H. Kacavas is a captain in the United States Army and a cavalry officer. He and
          Elias are identical twins. Alec is their younger brother. They grew up in Manchester, New
          Hampshire.
        </p>
        <p>
          He graduated from the United States Military Academy at West Point in 2022 with a Bachelor
          of Science in Political Science and a minor in European Regional Studies.
        </p>
        <p className="border-l border-niko pl-5 text-base text-muted">
          Elias has described him as very type-A, list-oriented, and logical, and has said he looks
          up to him. They grew up playing the same sports. Elias has said Niko loves the arts, and
          that in high school he took a summer program in political studies.
        </p>
      </Reveal>

      <Reveal className="mt-16">
        <h2 className="font-serif text-4xl">Service</h2>
        <p className="mt-3 max-w-2xl text-muted">{nikoPromotion.detail}</p>
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
        <p className="text-xs tracking-[0.18em] text-faint uppercase">Their grandfather</p>
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
