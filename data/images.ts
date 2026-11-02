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

/** The three brothers together. Who is who in the frame is not confirmed. */
export const familyPhoto: SiteImage = {
  src: "/images/home/brothers.jpg",
  alt: "The three Kacavas brothers in the backyard.",
  width: 1600,
  height: 1200,
}

export const familyMoments: readonly SiteImage[] = [
  {
    src: "/images/home/boat-skyline.jpg",
    alt: "The three Kacavas brothers, seen from behind, looking at the San Francisco skyline from a boat.",
    width: 768,
    height: 1024,
  },
  {
    src: "/images/home/golden-gate.jpg",
    alt: "The three Kacavas brothers in white linen on a boat, with the Golden Gate Bridge behind them.",
    width: 768,
    height: 1024,
  },
  {
    src: "/images/home/nyc-suits.jpg",
    alt: "The three Kacavas brothers in suits on a lawn, with the Lower Manhattan skyline behind them.",
    width: 1400,
    height: 1867,
  },
  {
    src: "/images/niko/brunch.jpg",
    alt: "The three Kacavas brothers at brunch.",
    width: 1024,
    height: 768,
  },
]

export const portraits: Record<BrotherId, SiteImage> = {
  niko: {
    src: "/images/niko/field.jpg",
    alt: "Nicholas in the field.",
    width: 1024,
    height: 682,
  },
  eli: {
    src: "/images/eli/portrait.jpg",
    alt: "Elias Kacavas, photographed for his own Instagram",
    width: 1080,
    height: 1350,
  },
  alec: {
    src: "/images/alec/aurora.jpg",
    alt: "Alexander smiling on a balcony under the northern lights.",
    width: 1400,
    height: 1867,
  },
}

export const nicholasPhotos: readonly SiteImage[] = [
  {
    src: "/images/niko/dress.jpg",
    alt: "Nicholas in dress uniform.",
    width: 768,
    height: 1024,
  },
  {
    src: "/images/niko/ballpark.jpg",
    alt: "Two brothers at a ballpark.",
    width: 1400,
    height: 1867,
  },
  {
    src: "/images/niko/dessert.jpg",
    alt: "Nicholas eating dessert.",
    width: 1080,
    height: 1920,
  },
  {
    src: "/images/niko/bar.jpg",
    alt: "Nicholas in a white shirt.",
    width: 1400,
    height: 1867,
  },
  {
    src: "/images/niko/brunch.jpg",
    alt: "The three Kacavas brothers at brunch.",
    width: 1024,
    height: 768,
  },
]

export const eliasPhotos: readonly SiteImage[] = [
  {
    src: "/images/eli/window.jpg",
    alt: "Elias sitting in a window overlooking the water.",
    width: 360,
    height: 480,
  },
  {
    src: "/images/eli/flag.jpg",
    alt: "Two brothers holding a folded flag.",
    width: 360,
    height: 450,
  },
]

export const nikoTank: SiteImage = {
  src: "/images/niko/tank.jpg",
  alt: "Tank crew during training.",
  width: 993,
  height: 758,
}

export const alexanderGrill: SiteImage = {
  src: "/images/alec/grill.jpg",
  alt: "A board of steaks off the grill.",
  width: 768,
  height: 1024,
}

export const alexanderPhotos: readonly (SiteImage & { caption?: string; wide?: boolean })[] = [
  {
    src: "/images/alec/rho-lock-in.jpg",
    alt: "Alexander standing in front of a truck wrapped in an advertisement.",
    width: 1120,
    height: 702,
    wide: true,
    caption: "I did GTM at Rho, in San Francisco.",
  },
  {
    src: "/images/alec/golden-gate.jpg",
    alt: "Alexander on the water, with a bridge behind him.",
    width: 1200,
    height: 1600,
  },
  {
    src: "/images/alec/race.jpg",
    alt: "Alexander running a race.",
    width: 932,
    height: 1400,
  },
  {
    src: "/images/alec/surfboard.jpg",
    alt: "Alexander on a beach, holding a wooden surfboard.",
    width: 1600,
    height: 1165,
  },
  {
    src: "/images/alec/fleece.jpg",
    alt: "Alexander smiling in beach grass.",
    width: 1400,
    height: 2103,
  },
  {
    src: "/images/alec/champagne.jpg",
    alt: "Alexander opening a bottle of champagne.",
    width: 1400,
    height: 2100,
  },
  {
    src: "/images/alec/wetsuit.jpg",
    alt: "Alexander in a wetsuit beside a surfboard.",
    width: 724,
    height: 1086,
  },
]

export type GalleryItem = SiteImage & {
  id: string
  caption: string
  group: "Portraits" | "The Vanity" | "Stills"
}

export const gallery: readonly GalleryItem[] = [
  {
    id: "niko-portrait",
    ...portraits.niko,
    caption: "Nicholas in the field.",
    group: "Portraits",
  },
  {
    id: "eli-portrait",
    ...portraits.eli,
    caption: "Elias. Replace with a photograph he owns.",
    group: "Portraits",
  },
  {
    id: "alec-portrait",
    ...portraits.alec,
    caption: "Alexander. Replace with a photograph he owns.",
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
