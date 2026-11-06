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
  /**
   * Hidden pages stay in the repo but 404, and they drop out of the menu.
   * Set this to true to publish Shop or Creative again.
   */
  enabled: boolean
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
    menuNote: "Brothers",
    title: "Kacavas: Nicholas, Elias, and Alexander",
    description:
      "Nicholas, Elias, and Alexander Kacavas. A U.S. Army captain, an actor, and a GTM lead, from Manchester, New Hampshire.",
    index: false,
    enabled: true,
  },
  {
    id: "niko",
    href: "/niko",
    label: "Nicholas",
    menuNote: "Captain",
    title: "Nicholas Kacavas",
    description:
      "Nicholas H. Kacavas is a U.S. Army captain and a cavalry officer. He goes by Niko. West Point class of 2022. Identical twin of Elias Kacavas.",
    brother: "niko",
    index: false,
    enabled: true,
  },
  {
    id: "eli",
    href: "/eli",
    label: "Elias",
    menuNote: "Actor",
    title: "Elias Kacavas",
    description:
      "Elias Kacavas is an actor from Manchester, New Hampshire. Credits include Euphoria, Pretty Little Liars: Original Sin, My Big Fat Greek Wedding 3, and Fire Country. He plays in the band The Vanity.",
    brother: "eli",
    index: false,
    enabled: true,
  },
  {
    id: "alec",
    href: "/alec",
    label: "Alexander",
    menuNote: "GTM lead",
    title: "Alexander Kacavas",
    description:
      "Alexander Kacavas is GTM lead at Lance in San Francisco. He goes by Alec. He went to Babson, and he loves any sport. Previously Rho, Vive Mints, Blue Water Mortgage, and Silent Falcon.",
    brother: "alec",
    index: false,
    enabled: true,
  },
  {
    id: "shop",
    href: "/shop",
    label: "Shop",
    menuNote: "Shop",
    title: "Shop",
    description: "Example pieces for a future Kacavas shop. Checkout is not connected yet.",
    index: false,
    enabled: false,
  },
  {
    id: "creative",
    href: "/creative",
    label: "Creative",
    menuNote: "Gallery",
    title: "Creative",
    description: "A gallery placeholder for photographs and work the brothers own.",
    index: false,
    enabled: false,
  },
  {
    id: "restaurants",
    href: "/restaurants",
    label: "Restaurants",
    menuNote: "Map",
    title: "Restaurants & places",
    description: "A private map of restaurants and places.",
    index: false,
    enabled: true,
  },
]

export function getPage(id: PageId): SitePage {
  const page = pages.find((item) => item.id === id)
  if (!page) throw new Error(`Unknown page: ${id}`)
  return page
}

export function isPageEnabled(id: PageId): boolean {
  return getPage(id).enabled
}

/** Pages that appear in the side menu. */
export const menuPages = pages.filter((page) => page.enabled)
