import { OgImage, ogContentType, ogSize } from "@/lib/og-image"

export const alt = "Alexander Kacavas, GTM lead"
export const size = ogSize
export const contentType = ogContentType

export default function OpenGraphImage() {
  return OgImage({
    eyebrow: "Alexander",
    title: "Alexander Kacavas",
    footer: "GTM lead at Lance, San Francisco",
    accent: "#1e4e89",
  })
}
