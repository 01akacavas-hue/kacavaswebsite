import { accents } from "@/lib/theme"
import type { BrotherId, SocialLink } from "@/lib/types"

export type Brother = {
  id: BrotherId
  /** Scroll order on the home scene: 0 Nicholas, 1 Elias, 2 Alexander. */
  index: number
  name: string
  shortName: string
  /** Nickname, shown on the page and the home card. */
  knownAs?: string
  epithet: string
  href: string
  bio: string
  career: string
  /** Label for the second fact line. Eli uses music; the others use sports. */
  asideLabel: string
  sports: string
  socials: readonly SocialLink[]
  accent: string
}

export const brothers = [
  {
    id: "niko",
    index: 0,
    name: "Nicholas Kacavas",
    shortName: "Nicholas",
    knownAs: "Niko",
    epithet: "The captain",
    href: "/niko",
    bio: "U.S. Army captain. West Point class of 2022.",
    career: "Captain and cavalry officer.",
    asideLabel: "Sports",
    sports: "Grew up playing the same sports as his brothers.",
    socials: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/nicholas-kacavas-b65337201" }],
    accent: accents.niko,
  },
  {
    id: "eli",
    index: 1,
    name: "Elias Kacavas",
    shortName: "Elias",
    epithet: "The actor",
    href: "/eli",
    bio: "Actor from Manchester, New Hampshire. Euphoria, Pretty Little Liars: Original Sin, and My Big Fat Greek Wedding 3.",
    career: "Film and television.",
    asideLabel: "Music & hobbies",
    sports: "Guitar, piano, and The Vanity. Basketball growing up.",
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/eliaskacavas/" },
      { label: "IMDb", href: "https://www.imdb.com/name/nm10094535/" },
      { label: "Rotten Tomatoes", href: "https://www.rottentomatoes.com/celebrity/elias_kacavas" },
    ],
    accent: accents.eli,
  },
  {
    id: "alec",
    index: 2,
    name: "Alexander Kacavas",
    shortName: "Alexander",
    knownAs: "Alec",
    epithet: "GTM lead",
    href: "/alec",
    bio: "GTM lead at Lance in San Francisco. Babson College. He loves any sport.",
    career: "Lance, Rho, Vive Mints, Blue Water Mortgage, and Silent Falcon.",
    asideLabel: "Sports",
    sports: "Any sport he can get into, including Rho Hoops in San Francisco.",
    socials: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/aleckacavas" },
      { label: "Lance", href: "https://lance.live" },
    ],
    accent: accents.alec,
  },
] as const satisfies readonly Brother[]

export function getBrother(id: Brother["id"]): Brother {
  const brother = brothers.find((item) => item.id === id)
  if (!brother) throw new Error(`Unknown brother: ${id}`)
  return brother
}
