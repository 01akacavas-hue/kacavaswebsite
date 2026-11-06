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
  alt: "The three Kacavas brothers in the backyard, arms around each other, one of them holding a speckled dog.",
  caption: "Backyard light, a birdhouse, and the dog who refused to be left out.",
  width: 1600,
  height: 1200,
}

export const familyMoments: readonly SiteImage[] = [
  {
    src: "/images/home/boat-skyline.jpg",
    alt: "The three brothers from behind, in white shirts, looking out from a boat at a harbor and a city skyline.",
    caption: "White shirts, a harbor full of masts, and a skyline they had not finished looking at.",
    width: 768,
    height: 1024,
  },
  {
    src: "/images/home/golden-gate.jpg",
    alt: "The three brothers in white linen on a boat, smiling, with the Golden Gate Bridge behind them.",
    caption: "White linen, drinks in hand, and the bridge doing the rest of the work.",
    width: 768,
    height: 1024,
  },
  {
    src: "/images/home/nyc-suits.jpg",
    alt: "The three brothers in suits on a lawn, with the Lower Manhattan skyline behind them.",
    caption: "Suits on the grass, a pocket square, and the skyline keeping still.",
    width: 1400,
    height: 1867,
  },
  {
    src: "/images/niko/brunch.jpg",
    alt: "The three brothers at an outdoor brunch table, with orange juice, coffee, and beer.",
    caption: "Brunch on the patio: orange juice, a dark beer, and nobody in a hurry.",
    width: 1024,
    height: 768,
  },
]

export const portraits: Record<BrotherId, SiteImage> = {
  niko: {
    src: "/images/niko/field.jpg",
    alt: "Nicholas in the field at golden hour, helmet on, a clipboard in his hands.",
    caption: "Late light on the field, and a clipboard passed between them.",
    width: 1024,
    height: 682,
  },
  eli: {
    src: "/images/eli/portrait.jpg",
    alt: "Elias in a striped sweater, seated in a makeup chair, with mirror lights and face charts behind him.",
    caption: "The makeup chair, a striped sweater, and a wall of faces behind him.",
    width: 1080,
    height: 1350,
  },
  alec: {
    src: "/images/alec/aurora.jpg",
    alt: "Alexander smiling on a balcony in a blue shirt, the northern lights pink and green behind him.",
    caption: "A balcony, a blue shirt, and the northern lights doing the decorating.",
    width: 1400,
    height: 1867,
  },
}

export const nicholasPhotos: readonly SiteImage[] = [
  {
    src: "/images/niko/dress.jpg",
    alt: "Nicholas in white dress uniform on a sunny lawn, a crowd behind him, his ring held toward the camera.",
    caption: "Whites on a sunny lawn, the crowd behind him, and a ring held up for the camera.",
    width: 768,
    height: 1024,
  },
  {
    src: "/images/niko/ballpark.jpg",
    alt: "Two brothers in sunglasses at a packed ballpark, an arm around each other.",
    caption: "Sunglasses, a full ballpark, and an arm around a brother.",
    width: 1400,
    height: 1867,
  },
  {
    src: "/images/niko/dessert.jpg",
    alt: "Nicholas at a restaurant table, leaning over a dark bowl of dessert, a small espresso beside it.",
    caption: "A dark bowl of dessert, and a small espresso beside it.",
    width: 1080,
    height: 1920,
  },
  {
    src: "/images/niko/bar.jpg",
    alt: "Nicholas in a white shirt at a sports bar, phone in one hand and a peace sign in the other.",
    caption: "A white shirt, a sports bar, and a peace sign for the camera.",
    width: 1400,
    height: 1867,
  },
  {
    src: "/images/niko/brunch.jpg",
    alt: "The three brothers at brunch, leaning in, drinks on the table.",
    caption: "The same patio, the same lean, the drinks still half full.",
    width: 1024,
    height: 768,
  },
]

export const eliasPhotos: readonly SiteImage[] = [
  {
    src: "/images/eli/window.jpg",
    alt: "Elias sitting barefoot in a wide window, looking out over blue water and green hills.",
    caption: "A wide window, bare feet, and blue water past the trees.",
    width: 360,
    height: 480,
  },
  {
    src: "/images/eli/flag.jpg",
    alt: "Two brothers in a garden, smiling, holding a folded flag between them.",
    caption: "Two brothers, a folded flag, and the garden in full leaf.",
    width: 360,
    height: 450,
  },
]

export const nikoTank: SiteImage = {
  src: "/images/niko/tank.jpg",
  alt: "A tank crew on a training day, hatches open, mud on the tracks.",
  caption: "Hatches open, mud on the tracks, and the day still bright.",
  width: 993,
  height: 758,
}

export const alexanderGrill: SiteImage = {
  src: "/images/alec/grill.jpg",
  alt: "A wooden cutting board crowded with grilled steaks, the marks still dark.",
  caption: "Steaks off the grill, lined up like he meant every one of them.",
  width: 768,
  height: 1024,
}

export const alexanderPhotos: readonly (SiteImage & { caption?: string; wide?: boolean })[] = [
  {
    src: "/images/alec/rho-lock-in.jpg",
    alt: "Alexander standing in front of a box truck wrapped in a Rho advertisement in San Francisco.",
    width: 1120,
    height: 702,
    wide: true,
    caption: "Go-to-market at Rho, in San Francisco. The truck made it official.",
  },
  {
    src: "/images/alec/golden-gate.jpg",
    alt: "Alexander in sunglasses and a dark fleece, the Golden Gate Bridge and the water behind him.",
    caption: "Sunglasses, a fleece collar, and the bridge filling the sky.",
    width: 1200,
    height: 1600,
  },
  {
    src: "/images/alec/race.jpg",
    alt: "Alexander running a road race in a navy tank top, a bib on his chest, the crowd behind a rail.",
    caption: "Mid-race, navy tank, bib on, and the crowd along the rail.",
    width: 932,
    height: 1400,
  },
  {
    src: "/images/alec/surfboard.jpg",
    alt: "Alexander in a blue hoodie beside a tall wooden surfboard, rocks and water behind him.",
    caption: "A wooden board, a blue hoodie, and the water still behind him.",
    width: 1600,
    height: 1165,
    wide: true,
  },
  {
    src: "/images/alec/fleece.jpg",
    alt: "Alexander in a gray fleece, smiling, tall beach grass behind him.",
    caption: "Tall grass, a gray fleece, and a grin aimed off camera.",
    width: 1400,
    height: 2103,
  },
  {
    src: "/images/alec/champagne.jpg",
    alt: "Alexander in a navy suit, working the cork out of a bottle of champagne.",
    caption: "A navy suit, both hands on the bottle, and the cork still to come.",
    width: 1400,
    height: 2100,
  },
  {
    src: "/images/alec/wetsuit.jpg",
    alt: "Alexander pulling on a black wetsuit beside a surfboard, one shoulder still bare.",
    caption: "One arm still out of the wetsuit, the board already in the frame.",
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
    caption: "Late light on the field, and a clipboard passed between them.",
    group: "Portraits",
  },
  {
    id: "eli-portrait",
    ...portraits.eli,
    caption: "The makeup chair, a striped sweater, and a wall of faces behind him.",
    group: "Portraits",
  },
  {
    id: "alec-portrait",
    ...portraits.alec,
    caption: "A balcony, a blue shirt, and the northern lights doing the decorating.",
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
