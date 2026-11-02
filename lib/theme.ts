import type { BrotherId } from "./types"

/**
 * Muted accents on the cream ground. The same hex values are in
 * `app/globals.css`. `tests/content.test.ts` checks they match.
 * Each color is dark enough for text on cream (WCAG AA).
 */
export const accents: Record<BrotherId, string> = {
  eli: "#1f6b3a",
  niko: "#9b2c2c",
  alec: "#1e4e89",
}

export const cream = "#f7f3ec"
export const ink = "#1a1714"
