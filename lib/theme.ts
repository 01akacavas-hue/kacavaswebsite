import type { BrotherId } from "./types"

/**
 * Accent colors. The same hex values are repeated in `app/globals.css`
 * so Tailwind utilities and WebGL can share them. `tests/content.test.ts`
 * fails if the stylesheet drifts.
 */
export const accents: Record<BrotherId, string> = {
  eli: "#e0b15c",
  niko: "#a3b896",
  alec: "#e07a52",
}

export const ink = "#090908"
export const paper = "#f3efe6"
