import type { BrotherId } from "@/lib/types"

export type CreditKind = "movie" | "series" | "short"

export type Credit = {
  id: string
  title: string
  year: string
  /** Published role. Null when no role was listed. */
  role: string | null
  kind: CreditKind
  /** A film he appeared in that won Best Picture. Not a personal award. */
  bestPicture?: boolean
  note?: string
}

export type Trophy = {
  id: string
  title: string
  kicker: string
  detail: string
}

/** A joke vote. Not a real award. */
export type Superlative = {
  id: string
  title: string
}

/**
 * `null` means the list has not been filled in.
 * An empty array means none are confirmed.
 * Do not guess a credit.
 */
export type CreditList = readonly Credit[] | null

export type BrotherRecord = {
  movies: CreditList
  shows: CreditList
  /** Listed on the page. Never counted as movies. */
  shorts: readonly Credit[]
  trophies: readonly Trophy[]
  /** Yearbook jokes. Add another object to give a brother one more. */
  superlatives: readonly Superlative[]
}

const coda: Credit = {
  id: "coda",
  title: "CODA",
  year: "2022",
  role: null,
  kind: "movie",
  bestPicture: true,
  note: "Appeared in CODA. The film won Best Picture at the 94th Academy Awards.",
}

export const achievements: Record<BrotherId, BrotherRecord> = {
  eli: {
    shows: [
      {
        id: "pll",
        title: "Pretty Little Liars: Original Sin",
        year: "2022–2024",
        role: "Greg Mantzoukas",
        kind: "series",
        note: "Series regular.",
      },
      {
        id: "fire-country",
        title: "Fire Country",
        year: "2025–2026",
        role: "Tex",
        kind: "series",
        note: "Recurring.",
      },
      {
        id: "euphoria",
        title: "Euphoria",
        year: "2022",
        role: "Young Cal",
        kind: "series",
        note: "1 episode.",
      },
    ],
    movies: [
      { id: "mbfgw", title: "My Big Fat Greek Wedding 3", year: "2023", role: "Aristotle", kind: "movie" },
      { id: "wssf", title: "Winter Spring Summer or Fall", year: "2024", role: "PJ", kind: "movie" },
      { id: "retreat", title: "Corporate Retreat", year: "2026", role: "Cliff", kind: "movie" },
      { id: "holidaze", title: "In a Holidaze", year: "2026", role: "Theo", kind: "movie", note: "Netflix." },
      { id: "wolf", title: "The Wolf and the Lamb", year: "2026", role: "Deputy Charlie Quinn", kind: "movie" },
      {
        id: "feelings",
        title: "Only Good Feelings",
        year: "2026",
        role: "Kameron",
        kind: "movie",
        note: "In post-production.",
      },
      { id: "babies", title: "Pretty Babies", year: "2026", role: null, kind: "movie", note: "Role not listed." },
    ],
    shorts: [
      { id: "nick", title: "Nick", year: "2026", role: "Nick", kind: "short" },
      { id: "mercy", title: "Mercy", year: "2022", role: "Jacob", kind: "short" },
      { id: "fluff", title: "House of Fluff", year: "2019", role: "Jack", kind: "short" },
      { id: "matriarch", title: "The Death of a Matriarch", year: "2019", role: null, kind: "short" },
    ],
    trophies: [],
    superlatives: [{ id: "dog-dad", title: "Dog Dad" }],
  },
  niko: {
    movies: null,
    shows: null,
    shorts: [],
    trophies: [],
    superlatives: [
      { id: "fattest", title: "The Fattest" },
      { id: "angry", title: "Overly Angry" },
    ],
  },
  alec: {
    movies: [coda],
    shows: null,
    shorts: [],
    trophies: [
      {
        id: "coda",
        title: "CODA",
        kicker: "Best Picture",
        detail: "Appeared in CODA. The film won Best Picture at the 94th Academy Awards, 2022.",
      },
      {
        id: "shotski",
        title: "1,430",
        kicker: "Longest continuous shotski",
        detail: "1,430 people, Park City, Utah.",
      },
    ],
    superlatives: [{ id: "scooter", title: "Best Scooter Driver" }],
  },
}

export function creditCount(list: CreditList): number | null {
  if (list === null) return null
  return list.length
}

/** Best Picture films he appeared in. Null when the movie list is still blank. */
export function oscarCount(movies: CreditList): number | null {
  if (movies === null) return null
  return movies.filter((credit) => credit.bestPicture).length
}
