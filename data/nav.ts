import type { BrotherId } from "@/lib/types"

export type PageId = "home" | "eli" | "niko" | "alec" | "shop" | "creative" | "restaurants"

export type SitePage = {
  id: PageId
  href: string
  label: string
  /** Sentence under the label in the side menu. */
  menuNote: string
  title: string
  description: string
  brother?: BrotherId
  /** Public pages are indexed and added to the sitemap. */
  index: boolean
}

/**
 * Menu, sitemap, and page titles all read this list.
 * To add a page: create `app/<route>/page.tsx`, then add a row here.
 */
export const pages: readonly SitePage[] = [
  {
    id: "home",
    href: "/",
    label: "Home",
    menuNote: "The cube",
    title: "Kacavas — Eli, Niko, and Alec",
    description:
      "Elias, Nicholas, and Alec Kacavas. An actor, a U.S. Army captain, and a GTM lead, from Manchester, New Hampshire.",
    index: true,
  },
  {
    id: "eli",
    href: "/eli",
    label: "Eli",
    menuNote: "Actor",
    title: "Elias “Eli” Kacavas",
    description:
      "Elias Kacavas is an actor from Manchester, New Hampshire. Credits include Euphoria, Pretty Little Liars: Original Sin, My Big Fat Greek Wedding 3, and Fire Country. He plays in the band The Vanity.",
    brother: "eli",
    index: true,
  },
  {
    id: "niko",
    href: "/niko",
    label: "Niko",
    menuNote: "Captain",
    title: "Nicholas “Niko” Kacavas",
    description:
      "Nicholas H. Kacavas is a U.S. Army captain and a cavalry officer. West Point class of 2022. Identical twin of Elias Kacavas.",
    brother: "niko",
    index: true,
  },
  {
    id: "alec",
    href: "/alec",
    label: "Alec",
    menuNote: "Operator",
    title: "Alec Kacavas",
    description:
      "Alec Kacavas is GTM lead at Lance, building AI for hotels. Previously Rho, Vive Mints, Blue Water Mortgage, and Silent Falcon. Babson College. San Francisco.",
    brother: "alec",
    index: true,
  },
  {
    id: "shop",
    href: "/shop",
    label: "Shop",
    menuNote: "The shelf",
    title: "Shop",
    description: "Example pieces for a future Kacavas shop. Checkout is not connected yet.",
    index: true,
  },
  {
    id: "creative",
    href: "/creative",
    label: "Creative",
    menuNote: "Gallery",
    title: "Creative",
    description: "A gallery placeholder for photographs and work the brothers own.",
    index: true,
  },
  {
    id: "restaurants",
    href: "/restaurants",
    label: "Restaurants",
    menuNote: "Private map",
    title: "Restaurants & places",
    description: "A private map of restaurants and places.",
    index: false,
  },
]

export function getPage(id: PageId): SitePage {
  const page = pages.find((item) => item.id === id)
  if (!page) throw new Error(`Unknown page: ${id}`)
  return page
}
