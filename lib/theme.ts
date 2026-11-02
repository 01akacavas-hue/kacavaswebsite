import type { BrotherId } from "./types"

/**
 * Muted accents on the cream ground. The same hex values are in
 * `app/globals.css`. `tests/content.test.ts` checks they match.
 * Each color is dark enough for text on cream (WCAG AA).
 */
export const accents: Record<BrotherId, string> = {
  eli: "#3e4c2c",
  niko: "#1a365d",
  alec: "#8c3d28",
}

export const cream = "#f7f3ec"
export const ink = "#1a1714"
