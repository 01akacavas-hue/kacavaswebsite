import { OgImage, ogContentType, ogSize } from "@/lib/og-image"

export const alt = "Elias Kacavas, actor"
export const size = ogSize
export const contentType = ogContentType

export default function OpenGraphImage() {
  return OgImage({
    eyebrow: "Elias",
    title: "Elias Kacavas",
    footer: "Actor, from Manchester, New Hampshire",
    accent: "#1f6b3a",
  })
}
