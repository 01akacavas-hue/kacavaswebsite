import { OgImage, ogContentType, ogSize } from "@/lib/og-image"

export const alt = "Kacavas — Eli, Niko, and Alec"
export const size = ogSize
export const contentType = ogContentType

export default function OpenGraphImage() {
  return OgImage()
}
