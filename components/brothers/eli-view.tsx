import { ViewTransition } from "react"
import Image from "next/image"
import { achievements, type Credit } from "@/data/achievements"
import { eliMarquee, vanity } from "@/data/eli"
import { eliasPhotos } from "@/data/images"
import { oxfordJoin } from "@/lib/lists"
import { ExternalLink } from "@/components/chrome/external-link"
import { Marquee } from "@/components/brothers/marquee"
import { Portrait } from "@/components/portrait"
import { Reveal } from "@/components/motion/reveal"

const kindLabel = {
  series: "Series",
  movie: "Film",
  short: "Short",
} as const

const imdb = "https://www.imdb.com/name/nm10094535/"

export function EliView() {
  const record = achievements.eli
  const shows = record.shows ?? []
  const movies = record.movies ?? []

  return (
    <>
      <header>
        <p className="text-xs tracking-[0.22em] text-eli uppercase">Actor</p>
        <h1 className="mt-3 font-serif text-6xl tracking-tight sm:text-8xl">Elias</h1>
        <p className="mt-3 text-lg text-muted">Elias Kacavas. Manchester, New Hampshire. Based in New York, as of June 2024.</p>
      </header>
      <Marquee titles={eliMarquee} />
      <ul className="mt-8 flex flex-wrap gap-4">
        {eliasPhotos.map((photo) => (
          <li key={photo.src} className="w-[min(100%,220px)] sm:w-[220px]">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="220px"
              className="h-auto w-full"
            />
          </li>
        ))}
      </ul>
      <Reveal>
        <div className="grid items-start gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <ViewTransition name="portrait-eli">
            <div className="relative aspect-[4/5] bg-ink-2">
              <Portrait id="eli" priority sizes="(max-width: 768px) 100vw, 420px" />
            </div>
          </ViewTransition>
          <div className="space-y-5 text-lg leading-relaxed text-paper/95">
            <p>
              Elias Kacavas grew up in Manchester, New Hampshire, in a Greek Orthodox community: St.
              George Cathedral, the Glendi festival, and Greek school. His grandfather’s family came
              from Megalopolis, near Sparta. He graduated from Manchester Central High. Alexander is
              his younger brother.
            </p>
            <p>
              He planned on medicine, then spent a gap year in Bay Ridge, Brooklyn, sleeping on a
              couch and working at a Dunkin’ Donuts. He read Adler, Meisner,
              Strasberg, Hagen, and Cohen. In high school his DECA team wrote a business plan for a
              Greek restaurant, placed second in New Hampshire, and went on to the international
              competition in California.
            </p>
            <p>
              He left to film Euphoria and Pretty Little Liars: Original Sin. As of June 2024 he was based in
              New York, and he had talked about living in Los Angeles later. He was grand marshal of
              Manchester’s Taco Tour.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-20">
        <h2 className="font-serif text-4xl">Filmography</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Series and films, then shorts. Shorts are listed and are not counted as movies. Oscars won: 0.
        </p>
        <p className="mt-4">
          <ExternalLink href={imdb}>IMDb</ExternalLink>
        </p>
        <h3 className="mt-10 font-serif text-2xl">Television</h3>
        <CreditList credits={shows} />
        <h3 className="mt-10 font-serif text-2xl">Film</h3>
        <CreditList credits={movies} />
        <h3 className="mt-10 font-serif text-2xl">Shorts</h3>
        <CreditList credits={record.shorts} />
      </Reveal>

      <Reveal className="mt-20 border border-line p-6 sm:p-10">
        <p className="text-xs tracking-[0.2em] text-eli uppercase">Music</p>
        <h2 className="mt-3 font-serif text-4xl">{vanity.name}</h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed">{vanity.summary}</p>
        <dl className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs tracking-[0.16em] text-faint uppercase">Influences</dt>
            <dd className="mt-2">{oxfordJoin(vanity.influences)}</dd>
          </div>
          <div>
            <dt className="text-xs tracking-[0.16em] text-faint uppercase">Stages</dt>
            <dd className="mt-2">{oxfordJoin(vanity.venues)}</dd>
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

function CreditList({ credits }: { credits: readonly Credit[] }) {
  return (
    <ol className="mt-4 divide-y divide-line border-y border-line">
      {credits.map((credit) => (
        <li key={credit.id} className="grid gap-2 py-5 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-8">
          <p className="font-mono text-sm text-muted">{credit.year}</p>
          <div>
            <p className="text-[0.68rem] tracking-[0.16em] text-faint uppercase">{kindLabel[credit.kind]}</p>
            <h3 className="mt-1 font-serif text-2xl">{credit.title}</h3>
            <p className="mt-1 text-eli">{credit.role ?? "Role not listed"}</p>
            {credit.note ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{credit.note}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  )
}
