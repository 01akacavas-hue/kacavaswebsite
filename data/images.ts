import type { BrotherId, SiteImage } from "@/lib/types"

/**
 * All image paths live here.
 *
 * Drop a photo into `public/` and change `src`. Use photographs the brothers
 * own. Do not commit press photos, studio stills, or anything pulled from
 * Instagram, IMDb, or magazine sites.
 *
 * When a real photo replaces a placeholder, rewrite `alt` so it describes
 * that photograph. Width and height should match the file so the layout
 * does not jump.
 */

export const portraits: Record<BrotherId, SiteImage> = {
  eli: {
    src: "/images/placeholders/eli.svg",
    alt: "Placeholder portrait of Elias Kacavas",
    width: 800,
    height: 1000,
  },
  niko: {
    src: "/images/placeholders/niko.svg",
    alt: "Placeholder portrait of Nicholas Kacavas",
    width: 800,
    height: 1000,
  },
  alec: {
    src: "/images/placeholders/alec.svg",
    alt: "Placeholder portrait of Alec Kacavas",
    width: 800,
    height: 1000,
  },
}

export type GalleryItem = SiteImage & {
  id: string
  caption: string
  group: "Portraits" | "The Vanity" | "Stills"
}

export const gallery: readonly GalleryItem[] = [
  {
    id: "eli-portrait",
    ...portraits.eli,
    caption: "Eli. Replace with a photograph he owns.",
    group: "Portraits",
  },
  {
    id: "niko-portrait",
    ...portraits.niko,
    caption: "Niko. Replace with a photograph he is willing to publish.",
    group: "Portraits",
  },
  {
    id: "alec-portrait",
    ...portraits.alec,
    caption: "Alec. Replace with a photograph he owns.",
    group: "Portraits",
  },
  {
    id: "vanity",
    src: "/images/placeholders/vanity.svg",
    alt: "Placeholder frame for The Vanity",
    width: 1200,
    height: 800,
    caption: "The Vanity. Add a live photograph.",
    group: "The Vanity",
  },
  {
    id: "still-one",
    src: "/images/placeholders/still.svg",
    alt: "Placeholder frame for a film still",
    width: 1200,
    height: 800,
    caption: "Still. Add a frame the production has cleared.",
    group: "Stills",
  },
  {
    id: "still-two",
    src: "/images/placeholders/note.svg",
    alt: "Placeholder frame for a note or poster",
    width: 800,
    height: 1000,
    caption: "Note. A poster, a set list, a page.",
    group: "Stills",
  },
]
