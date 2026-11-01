export type CreditKind = "series" | "film" | "short" | "commercial"

export type Credit = {
  id: string
  year: string
  title: string
  role: string | null
  kind: CreditKind
  detail: string
  /** IMDb lists the title as completed or upcoming. The release was not confirmed. */
  releaseUnconfirmed?: boolean
}

export const eliMarquee = [
  "Euphoria",
  "Pretty Little Liars: Original Sin",
  "My Big Fat Greek Wedding 3",
  "Fire Country",
  "Winter Spring Summer or Fall",
  "In a Holidaze",
  "Corporate Retreat",
] as const

export const eliCredits: readonly Credit[] = [
  {
    id: "wahlberg",
    year: "2017",
    title: "National commercial",
    role: "With Mark Wahlberg",
    kind: "commercial",
    detail: "His first professional job. He posted it on June 13, 2017.",
  },
  {
    id: "matriarch",
    year: "2019",
    title: "The Death of a Matriarch",
    role: null,
    kind: "film",
    detail: "An early credit. No role name was published in the sources used here.",
  },
  {
    id: "fluff",
    year: "2019",
    title: "House of Fluff",
    role: "Jack",
    kind: "short",
    detail: "Short film.",
  },
  {
    id: "mercy",
    year: "2022",
    title: "Mercy",
    role: "Jacob",
    kind: "short",
    detail: "Short film.",
  },
  {
    id: "euphoria",
    year: "2022",
    title: "Euphoria",
    role: "18 Year-Old Cal / Young Cal",
    kind: "series",
    detail:
      "One episode, HBO. The younger version of the character played by Eric Dane. He has called it his favorite role.",
  },
  {
    id: "pll",
    year: "2022–2024",
    title: "Pretty Little Liars: Original Sin",
    role: "Greg Mantzoukas",
    kind: "series",
    detail: "Eighteen episodes on Max. Series regular, and main cast in season two.",
  },
  {
    id: "mbfgw",
    year: "2023",
    title: "My Big Fat Greek Wedding 3",
    role: "Aristotle",
    kind: "film",
    detail:
      "Theatrical and Peacock. Nia Vardalos left him an olive-wood dish with a note that said welcome home.",
  },
  {
    id: "wssf",
    year: "2024",
    title: "Winter Spring Summer or Fall",
    role: "PJ",
    kind: "film",
    detail: "Feature.",
  },
  {
    id: "fire-country",
    year: "2025–2026",
    title: "Fire Country",
    role: "Tex",
    kind: "series",
    detail: "Nine episodes.",
  },
  {
    id: "retreat",
    year: "2026",
    title: "Corporate Retreat",
    role: "Cliff",
    kind: "film",
    detail: "Feature.",
  },
  {
    id: "holidaze",
    year: "2026",
    title: "In a Holidaze",
    role: "Theo",
    kind: "film",
    detail: "Rotten Tomatoes lists the role as Theo.",
  },
  {
    id: "feelings",
    year: "2026",
    title: "Only Good Feelings",
    role: "Kameron",
    kind: "film",
    detail: "IMDb lists this as completed or upcoming.",
    releaseUnconfirmed: true,
  },
  {
    id: "wolf",
    year: "2026",
    title: "The Wolf and the Lamb",
    role: "Deputy Charlie Quinn",
    kind: "film",
    detail: "IMDb lists this as completed or upcoming.",
    releaseUnconfirmed: true,
  },
  {
    id: "nick",
    year: "2026",
    title: "Nick",
    role: null,
    kind: "short",
    detail: "Short. IMDb lists this as completed or upcoming.",
    releaseUnconfirmed: true,
  },
]

export const vanity = {
  name: "The Vanity",
  summary:
    "He fronts a rock band, The Vanity. He has played guitar since his junior year of high school, and he plays piano.",
  influences: ["The Beatles", "The Rolling Stones", "Queen", "Bob Dylan", "Bruce Springsteen"],
  venues: ["Bowery Electric", "Knitting Factory", "Chelsea Music Hall"],
  aside: "He has said he would never play “Wonderwall.”",
}
