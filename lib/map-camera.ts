export type Camera = {
  x: number
  y: number
  scale: number
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function clampCamera(view: Camera, width: number, height: number, minScale: number, maxScale: number): Camera {
  const scale = clamp(view.scale, minScale, maxScale)
  const limitX = (width * (scale - 1)) / 2 + 160
  const limitY = (height * (scale - 1)) / 2 + 120
  return {
    scale,
    x: clamp(view.x, -limitX, limitX),
    y: clamp(view.y, -limitY, limitY),
  }
}

/** Keep the map point under the cursor fixed while the scale changes. */
export function zoomAt(
  current: Camera,
  factor: number,
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number },
  mapWidth: number,
  mapHeight: number,
  minScale: number,
  maxScale: number,
): Camera {
  const scale = clamp(current.scale * factor, minScale, maxScale)
  const sx = ((clientX - rect.left) / rect.width) * mapWidth
  const sy = ((clientY - rect.top) / rect.height) * mapHeight
  const worldX = mapWidth / 2 + (sx - mapWidth / 2 - current.x) / current.scale
  const worldY = mapHeight / 2 + (sy - mapHeight / 2 - current.y) / current.scale
  return clampCamera(
    {
      scale,
      x: sx - mapWidth / 2 - scale * (worldX - mapWidth / 2),
      y: sy - mapHeight / 2 - scale * (worldY - mapHeight / 2),
    },
    mapWidth,
    mapHeight,
    minScale,
    maxScale,
  )
}

export function framePoint(
  px: number,
  py: number,
  scale: number,
  mapWidth: number,
  mapHeight: number,
  minScale: number,
  maxScale: number,
): Camera {
  return clampCamera(
    {
      scale,
      x: -scale * (px - mapWidth / 2),
      y: -scale * (py - mapHeight / 2),
    },
    mapWidth,
    mapHeight,
    minScale,
    maxScale,
  )
}

export function frameBounds(
  points: readonly { x: number; y: number }[],
  mapWidth: number,
  mapHeight: number,
  minScale: number,
  maxScale: number,
  padding = 70,
): Camera {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const point of points) {
    minX = Math.min(minX, point.x)
    maxX = Math.max(maxX, point.x)
    minY = Math.min(minY, point.y)
    maxY = Math.max(maxY, point.y)
  }
  const spanX = Math.max(0.04, maxX - minX)
  const spanY = Math.max(0.04, maxY - minY)
  const scale = clamp(
    Math.min((mapWidth - padding * 2) / spanX, (mapHeight - padding * 2) / spanY),
    minScale,
    maxScale,
  )
  return framePoint((minX + maxX) / 2, (minY + maxY) / 2, scale, mapWidth, mapHeight, minScale, maxScale)
}
