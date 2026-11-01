import { eliCredits, eliMarquee, vanity } from "@/data/eli"
import { ExternalLink } from "@/components/chrome/external-link"
import { Marquee } from "@/components/brothers/marquee"
import { Portrait } from "@/components/portrait"
import { Reveal } from "@/components/motion/reveal"

const kindLabel = {
  series: "Series",
  film: "Film",
  short: "Short",
  commercial: "Commercial",
} as const

export function EliView() {
  const released = eliCredits.filter((credit) => !credit.releaseUnconfirmed)
  const unconfirmed = eliCredits.filter((credit) => credit.releaseUnconfirmed)

  return (
    <>
      <header>
        <p className="text-xs tracking-[0.22em] text-eli uppercase">Actor</p>
        <h1 className="mt-3 font-serif text-6xl tracking-tight sm:text-8xl">Elias</h1>
        <p className="mt-3 text-lg text-muted">Eli Kacavas. Manchester, New Hampshire. New York, as of 2024.</p>
      </header>
      <Marquee titles={eliMarquee} />
      <Reveal>
        <div className="grid items-start gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="relative aspect-[4/5] bg-ink-2">
            <Portrait id="eli" priority sizes="(max-width: 768px) 100vw, 420px" />
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-paper/95">
            <p>
              Elias Kacavas grew up in Manchester, New Hampshire, in a Greek Orthodox community: St.
              George Cathedral, the Glendi festival, and Greek school. His grandfather’s family came
              from Megalopolis, near Sparta. He graduated from Manchester Central High. Nicholas is
              his identical twin. Alec is their younger brother.
            </p>
            <p>
              He planned on medicine, then took a gap year in Bay Ridge, Brooklyn. He slept on a
              couch, worked at a Dunkin’ Donuts run by two Greek twins, and read Adler, Meisner,
              Strasberg, Hagen, and Cohen. In high school his DECA team wrote a business plan for a
              Greek restaurant, placed second in New Hampshire, and went on to the international
              competition in California.
            </p>
            <p>
              He studied method acting for two years at NYU Tisch, in the Strasberg studio, and left
              to film Euphoria and Pretty Little Liars: Original Sin. As of a June 2024 interview he
              was based in New York, and he had talked about living in Los Angeles later. He was
              grand marshal of Manchester’s Taco Tour.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-20">
        <h2 className="font-serif text-4xl">Filmography</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Roles as published on IMDb, Rotten Tomatoes, and the interviews named in the research for
          this site.
        </p>
        <CreditList credits={released} />
      </Reveal>

      {unconfirmed.length > 0 ? (
        <Reveal className="mt-14">
          <h2 className="font-serif text-3xl">Release unconfirmed</h2>
          <p className="mt-3 max-w-2xl text-muted">
            IMDb lists these as completed or upcoming. A release was not confirmed in the sources
            used here.
          </p>
          <CreditList credits={unconfirmed} />
        </Reveal>
      ) : null}

      <Reveal className="mt-20 border border-line p-6 sm:p-10">
        <p className="text-xs tracking-[0.2em] text-eli uppercase">Music</p>
        <h2 className="mt-3 font-serif text-4xl">{vanity.name}</h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed">{vanity.summary}</p>
        <dl className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs tracking-[0.16em] text-faint uppercase">Influences</dt>
            <dd className="mt-2">{vanity.influences.join(", ")}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-[0.16em] text-faint uppercase">Stages</dt>
            <dd className="mt-2">{vanity.venues.join(", ")}</dd>
          </div>
        </dl>
        <p className="mt-6 text-muted italic">{vanity.aside}</p>
      </Reveal>

      <Reveal className="mt-16">
        <h2 className="font-serif text-4xl">Off stage</h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed">
          He played basketball growing up, in a house full of brothers competing at sports. He hikes
          with his mother and Vinny, a beagle, works out at the YMCA, and has cigars and Scotch with
          his father. He has named The Deer Hunter and Le Samouraï as favorite films, and The Foundry
          and Fotia as favorite New Hampshire restaurants. He once modeled for a vintage store in
          Rhode Island.
        </p>
        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          <ExternalLink href="https://www.imdb.com/name/nm10094535/">IMDb</ExternalLink>
          <ExternalLink href="https://www.instagram.com/eliaskacavas/">Instagram</ExternalLink>
          <ExternalLink href="https://www.rottentomatoes.com/celebrity/elias_kacavas">
            Rotten Tomatoes
          </ExternalLink>
        </p>
      </Reveal>
    </>
  )
}

function CreditList({ credits }: { credits: typeof eliCredits }) {
  return (
    <ol className="mt-8 divide-y divide-line border-y border-line">
      {credits.map((credit) => (
        <li key={credit.id} className="grid gap-2 py-5 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-8">
          <p className="font-mono text-sm text-muted">{credit.year}</p>
          <div>
            <p className="text-[0.68rem] tracking-[0.16em] text-faint uppercase">{kindLabel[credit.kind]}</p>
            <h3 className="mt-1 font-serif text-2xl">{credit.title}</h3>
            {credit.role ? <p className="mt-1 text-eli">{credit.role}</p> : null}
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{credit.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
