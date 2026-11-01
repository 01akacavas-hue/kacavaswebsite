import { accents } from "@/lib/theme"
import type { BrotherId, SocialLink } from "@/lib/types"

export type Brother = {
  id: BrotherId
  /** Face order on the home cube: 0 Elias, 1 Nicholas, 2 Alec. */
  index: number
  name: string
  shortName: string
  epithet: string
  href: string
  bio: string
  career: string
  sports: string
  socials: readonly SocialLink[]
  accent: string
}

export const brothers = [
  {
    id: "eli",
    index: 0,
    name: "Elias Kacavas",
    shortName: "Eli",
    epithet: "The actor",
    href: "/eli",
    bio: "Actor from Manchester, New Hampshire. Euphoria, Pretty Little Liars: Original Sin, and My Big Fat Greek Wedding 3.",
    career: "Film and television, after two years at NYU Tisch.",
    sports: "Basketball growing up. Guitar, piano, and the band The Vanity.",
    socials: [
      { label: "Instagram", href: "https://www.instagram.com/eliaskacavas/" },
      { label: "IMDb", href: "https://www.imdb.com/name/nm10094535/" },
      { label: "Rotten Tomatoes", href: "https://www.rottentomatoes.com/celebrity/elias_kacavas" },
    ],
    accent: accents.eli,
  },
  {
    id: "niko",
    index: 1,
    name: "Nicholas Kacavas",
    shortName: "Niko",
    epithet: "The captain",
    href: "/niko",
    bio: "U.S. Army captain. West Point class of 2022, and Elias's identical twin.",
    career: "Captain and cavalry officer.",
    sports: "Grew up in the same sports as his brothers.",
    socials: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/nicholas-kacavas-b65337201" }],
    accent: accents.niko,
  },
  {
    id: "alec",
    index: 2,
    name: "Alec Kacavas",
    shortName: "Alec",
    epithet: "The operator",
    href: "/alec",
    bio: "GTM lead at Lance in San Francisco. The younger brother, by way of Babson and Boston.",
    career: "Lance, Rho, Vive Mints, Blue Water Mortgage, Silent Falcon.",
    sports: "Plays and organizes Rho Hoops with founders in San Francisco.",
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
