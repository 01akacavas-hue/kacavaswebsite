export type RecolorableStyle = {
  layers: Array<{ id: string; type: string; paint?: Record<string, unknown> }>
  [key: string]: unknown
}

const land = "#f4efe4"
const water = "#c5d5e4"
const waterway = "#b7c9db"
const sage = "#e4efe6"
const road = "#e6dccf"
const roadFaint = "#f3ece3"
const building = "#efe8dc"
const buildingLine = "#e4d9cc"
const boundary = "#cfc6ba"
const label = "#3f3a34"
const halo = "#f7f3ec"
const waterLabel = "#3e5870"

function paintOf(layer: { paint?: Record<string, unknown> }): Record<string, unknown> {
  layer.paint ??= {}
  return layer.paint
}

function setColor(paint: Record<string, unknown>, key: string, color: string) {
  if (key in paint) paint[key] = color
}

/** Warm editorial recolor of the Positron (or similarly named) vector style. */
export function recolorStyle<T extends RecolorableStyle>(style: T): T {
  for (const layer of style.layers) {
    const paint = paintOf(layer)
    const id = layer.id
    if (layer.type === "background") {
      paint["background-color"] = land
      continue
    }
    if (id === "water") {
      paint["fill-color"] = water
      continue
    }
    if (id === "waterway" || id.startsWith("waterway")) {
      setColor(paint, "line-color", waterway)
      setColor(paint, "fill-color", water)
    }
    if (id === "park" || id === "landcover_wood") {
      paint["fill-color"] = sage
      continue
    }
    if (id.startsWith("landcover_") || id === "landuse_residential" || id === "road_area_pier" || id === "road_pier") {
      setColor(paint, "fill-color", land)
      setColor(paint, "line-color", land)
      continue
    }
    if (id === "building") {
      paint["fill-color"] = building
      paint["fill-outline-color"] = buildingLine
      continue
    }
    if (id.startsWith("boundary")) {
      paint["line-color"] = boundary
      continue
    }
    if (id.startsWith("highway") || id.startsWith("tunnel") || id.startsWith("railway") || id.startsWith("aeroway") || id.startsWith("road_")) {
      const faint = id.includes("inner") || id.includes("subtle") || id.includes("dash") || id.includes("path") || id.endsWith("runway")
      const color = faint ? roadFaint : road
      setColor(paint, "line-color", color)
      setColor(paint, "fill-color", color)
      continue
    }
    if (layer.type === "symbol") {
      const onWater = id.startsWith("water")
      if ("text-color" in paint) paint["text-color"] = onWater ? waterLabel : label
      if ("text-halo-color" in paint) paint["text-halo-color"] = halo
      if ("icon-color" in paint) paint["icon-color"] = label
    }
  }
  return style
}

let pending: Promise<RecolorableStyle> | null = null

export function loadEditorialStyle(): Promise<RecolorableStyle> {
  pending ??= fetch("https://tiles.openfreemap.org/styles/positron")
    .then(async (response) => {
      if (!response.ok) throw new Error(`Map style responded ${response.status}`)
      const style = (await response.json()) as RecolorableStyle
      return recolorStyle(style)
    })
    .catch((error: unknown) => {
      pending = null
      throw error
    })
  return pending
}
