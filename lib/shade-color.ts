import type { ExpressionSpecification } from "maplibre-gl"
import { brothersInOrder } from "@/lib/places"
import { accents } from "@/lib/theme"
import type { BrotherId } from "@/lib/types"

/**
 * Fills mix in equal weights in Oklab.
 * One brother uses his accent. Two average that pair. Three average all three.
 * Oklab is the blend CSS color-mix uses, so the result stays closer to the
 * accents than a straight red-green-blue average.
 */
export const shadeGroups: readonly (readonly BrotherId[])[] = [
  ["niko"],
  ["eli"],
  ["alec"],
  ["niko", "eli"],
  ["niko", "alec"],
  ["eli", "alec"],
  ["niko", "eli", "alec"],
]

type Lab = [number, number, number]
type Rgb = [number, number, number]

function hexToRgb(hex: string): Rgb {
  const value = hex.replace("#", "")
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ]
}

function rgbToHex([red, green, blue]: Rgb): string {
  const channel = (value: number) => Math.min(255, Math.max(0, value)).toString(16).padStart(2, "0")
  return `#${channel(red)}${channel(green)}${channel(blue)}`
}

function srgbChannelToLinear(channel: number): number {
  const value = channel / 255
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

function linearChannelToSrgb(channel: number): number {
  const value = Math.min(1, Math.max(0, channel))
  const encoded = value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055
  return Math.round(Math.min(1, Math.max(0, encoded)) * 255)
}

function rgbToOklab([red, green, blue]: Rgb): Lab {
  const r = srgbChannelToLinear(red)
  const g = srgbChannelToLinear(green)
  const b = srgbChannelToLinear(blue)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

function oklabToRgb([lightness, a, b]: Lab): Rgb {
  const l = lightness + 0.3963377774 * a + 0.2158037573 * b
  const m = lightness - 0.1055613458 * a - 0.0638541728 * b
  const s = lightness - 0.0894841775 * a - 1.291485548 * b
  const l3 = l ** 3
  const m3 = m ** 3
  const s3 = s ** 3
  return [
    linearChannelToSrgb(4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3),
    linearChannelToSrgb(-1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3),
    linearChannelToSrgb(-0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3),
  ]
}

export function brotherKey(ids: readonly BrotherId[]): string {
  return brothersInOrder(ids).join(",")
}

export function mixBrotherColors(ids: readonly BrotherId[]): string {
  const ordered = brothersInOrder(ids)
  if (ordered.length === 1) {
    const only = ordered[0]
    return only ? accents[only] : "transparent"
  }
  const labs = ordered.map((id) => rgbToOklab(hexToRgb(accents[id])))
  const mixed: Lab = [0, 0, 0]
  for (const lab of labs) {
    mixed[0] += lab[0]
    mixed[1] += lab[1]
    mixed[2] += lab[2]
  }
  const count = labs.length || 1
  return rgbToHex(oklabToRgb([mixed[0] / count, mixed[1] / count, mixed[2] / count]))
}

function buildFillColor(): ExpressionSpecification {
  const expression: unknown[] = ["match", ["get", "brothers"]]
  for (const ids of shadeGroups) {
    expression.push(brotherKey(ids), mixBrotherColors(ids))
  }
  expression.push("rgba(0,0,0,0)")
  return expression as ExpressionSpecification
}

export const brotherFillColor: ExpressionSpecification = buildFillColor()
