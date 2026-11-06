import { achievements, type Trophy } from "@/data/achievements"
import { countriesVisited, rankBy, scoreboard, statRows, type BrotherScore, type StatKey } from "@/lib/leaderboard"
import { brotherLabel } from "@/lib/places"
import { accents } from "@/lib/theme"
import { brotherIds, type BrotherId, type Place } from "@/lib/types"

function formatStat(value: number | null): string {
  if (value === null) return "Add yours"
  return String(value)
}

function Race({ scores, stat }: { scores: readonly BrotherScore[]; stat: StatKey }) {
  const numbers = scores.map((score) => score[stat]).filter((value): value is number => value !== null)
  const max = Math.max(1, ...numbers, 0)
  return (
    <div className="mt-4 grid gap-3">
      {scores.map((score, index) => {
        const value = score[stat]
        const width = value === null || value === 0 ? 0 : Math.max(8, Math.round((value / max) * 100))
        return (
          <div key={score.id} className="grid grid-cols-[6.5rem_minmax(0,1fr)_5.5rem] items-center gap-3 sm:grid-cols-[7.5rem_minmax(0,1fr)_5.5rem]">
            <p className="text-sm" style={{ color: accents[score.id] }}>
              {brotherLabel(score.id)}
            </p>
            <div className="h-3 bg-ink-2" aria-hidden="true">
              {width > 0 ? (
                <div className="race-fill h-full" style={{ width: `${width}%`, background: accents[score.id], animationDelay: `${index * 90}ms` }} />
              ) : null}
            </div>
            <p className={`text-right text-sm whitespace-nowrap ${value === null ? "text-xs tracking-[0.08em] text-faint uppercase" : "font-mono"}`}>{formatStat(value)}</p>
          </div>
        )
      })}
    </div>
  )
}

function Podium({ scores }: { scores: readonly BrotherScore[] }) {
  const ranked = rankBy(scores, "cities")
  const [first, second, third] = ranked
  const steps = [second, first, third].filter((score): score is BrotherScore => Boolean(score))
  const max = Math.max(1, ...steps.map((score) => score.cities))
  return (
    <div className="mt-8 grid grid-cols-3 items-end gap-3">
      {steps.map((score, index) => {
        const height = score.cities === 0 ? 10 : Math.round(48 + (score.cities / max) * 112)
        return (
          <div key={score.id} className="text-center">
            <p className="font-serif text-4xl tracking-tight sm:text-5xl" style={{ color: accents[score.id] }}>
              {score.cities}
            </p>
            <p className="mt-1 text-xs tracking-[0.16em] uppercase" style={{ color: accents[score.id] }}>
              {brotherLabel(score.id)}
            </p>
            <div className="podium-fill mt-3" style={{ height, background: accents[score.id], animationDelay: `${index * 120}ms` }} />
          </div>
        )
      })}
    </div>
  )
}

function TrophyCard({ trophy, brother }: { trophy: Trophy; brother: BrotherId }) {
  return (
    <article className="trophy-card border border-line bg-ink p-6" style={{ borderTopWidth: 3, borderTopColor: accents[brother] }}>
      <p className="text-[0.68rem] tracking-[0.16em] uppercase" style={{ color: accents[brother] }}>
        {trophy.kicker}
      </p>
      <h3 className="mt-3 font-serif text-4xl tracking-tight">{trophy.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{trophy.detail}</p>
    </article>
  )
}

function CountryRoll({ places }: { places: readonly Place[] }) {
  return (
    <div className="mt-5 grid gap-5">
      {brotherIds.map((id) => {
        const names = countriesVisited(places, id)
        if (names.length === 0) return null
        return (
          <div key={id}>
            <p className="text-xs tracking-[0.14em] uppercase" style={{ color: accents[id] }}>
              {brotherLabel(id)}
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {names.map((name) => (
                <li key={name} className="border border-line px-2 py-1 text-sm">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

function EmptyShelf({ brother }: { brother: BrotherId }) {
  return (
    <div className="flex min-h-36 items-center border border-dashed border-line px-5 py-6">
      <p className="text-sm text-faint">
        <span style={{ color: accents[brother] }}>{brotherLabel(brother)}</span>
        <span> · Add yours</span>
      </p>
    </div>
  )
}

export function Leaderboard({ places }: { places: readonly Place[] }) {
  const scores = scoreboard(places, achievements)
  return (
    <div className="mt-8">
      <section aria-labelledby="leaderboard-title">
        <p className="text-xs tracking-[0.2em] text-muted uppercase">Brother against brother</p>
        <h2 id="leaderboard-title" className="mt-2 font-serif text-4xl tracking-tight sm:text-5xl">
          Leaderboard
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          Countries, cities, states, and Michelin dinners count only when someone was actually there. A shared table counts for each brother. Recommendations stay off the tally. Movies, shows, and Oscars come from the achievements list. A blank line is still open.
        </p>
        <Podium scores={scores} />
        <p className="mt-2 text-xs tracking-[0.14em] text-faint uppercase">Cities visited</p>
        <div className="mt-10 grid gap-8">
          {statRows.map((row) => (
            <section key={row.key} aria-label={row.label}>
              <h3 className="font-serif text-2xl">{row.label}</h3>
              <p className="mt-1 text-sm text-muted">{row.hint}</p>
              <Race scores={scores} stat={row.key} />
              {row.key === "countries" ? <CountryRoll places={places} /> : null}
            </section>
          ))}
        </div>
      </section>

      <section className="mt-16" aria-labelledby="trophy-title">
        <h2 id="trophy-title" className="font-serif text-4xl tracking-tight">
          Trophy case
        </h2>
        <p className="mt-3 max-w-2xl text-muted">What they have already done, kept on one shelf. An empty box is still waiting.</p>
        <div className="mt-8 grid gap-10">
          {brotherIds.map((id) => {
            const trophies = achievements[id].trophies
            return (
              <div key={id}>
                <h3 className="font-serif text-2xl" style={{ color: accents[id] }}>
                  {brotherLabel(id)}
                </h3>
                {trophies.length > 0 ? (
                  <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                    {trophies.map((trophy) => (
                      <li key={trophy.id}>
                        <TrophyCard trophy={trophy} brother={id} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-4">
                    <EmptyShelf brother={id} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <Superlatives />
      </section>
    </div>
  )
}

const superlativeOrder: readonly BrotherId[] = brotherIds

function Superlatives() {
  const ribbons = superlativeOrder.flatMap((brother) =>
    achievements[brother].superlatives.map((item) => ({ brother, ...item })),
  )
  return (
    <div className="mt-14 border border-dashed border-line p-5 sm:p-8">
      <h3 className="font-serif text-3xl tracking-tight">Superlatives</h3>
      <p className="mt-2 max-w-xl text-sm text-muted">A joke, as voted by the brothers. No refunds.</p>
      <ul className="mt-6 flex flex-wrap gap-4">
        {ribbons.map((ribbon) => (
          <li key={ribbon.id}>
            <p className="yearbook-ribbon" style={{ background: accents[ribbon.brother] }}>
              <span className="block text-[0.62rem] tracking-[0.18em] uppercase">{brotherLabel(ribbon.brother)}</span>
              <span className="mt-1 block font-serif text-xl leading-tight">{ribbon.title}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
