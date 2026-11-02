import { OgImage, ogContentType, ogSize } from "@/lib/og-image"

export const alt = "Kacavas — Elias, Nicholas, and Alexander"
export const size = ogSize
export const contentType = ogContentType

export default function OpenGraphImage() {
  return OgImage()
}
