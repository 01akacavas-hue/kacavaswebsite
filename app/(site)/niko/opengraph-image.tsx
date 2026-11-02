import { OgImage, ogContentType, ogSize } from "@/lib/og-image"

export const alt = "Nicholas Kacavas, U.S. Army captain"
export const size = ogSize
export const contentType = ogContentType

export default function OpenGraphImage() {
  return OgImage({
    eyebrow: "Nicholas",
    title: "Nicholas Kacavas",
    footer: "U.S. Army captain, West Point class of 2022",
    accent: "#9b2c2c",
  })
}
