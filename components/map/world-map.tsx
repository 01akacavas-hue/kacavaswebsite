"use client"

import { geoEqualEarth, geoPath } from "d3-geo"
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import { accents } from "@/lib/theme"
import { spiderfy } from "@/lib/spiderfy"
import type { Place } from "@/lib/types"
import { MAP_HEIGHT, MAP_WIDTH, countries } from "@/lib/world"

type View = { x: number; y: number; scale: number }

const minScale = 1
const maxScale = 14
const sea = "#c5d5e4"
const land = "#f4efe4"
const coast = "#6e675c"

export function WorldMap({
  places,
  selectedId,
  onSelect,
}: {
  places: readonly Place[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [view, setView] = useState<View>({ x: 0, y: 0, scale: 1.15 })
  const drag = useRef({
    active: false,
    pointerId: -1,
    x: 0,
    y: 0,
    originX: 0,
    originY: 0,
  })

  const projection = useMemo(() => {
    return geoEqualEarth().fitExtent(
      [
        [20, 16],
        [MAP_WIDTH - 20, MAP_HEIGHT - 16],
      ],
      countries,
    )
  }, [])

  const lands = useMemo(() => {
    const path = geoPath(projection)
    return countries.features.map((shape, index) => ({
      id: index,
      d: path(shape) ?? "",
    }))
  }, [projection])

  const pins = useMemo(() => {
    const projected = places.flatMap((place) => {
      const point = projection([place.longitude, place.latitude])
      if (!point) return []
      return [{ item: place, x: point[0], y: point[1] }]
    })
    return spiderfy(projected, 22 / view.scale)
  }, [places, projection, view.scale])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const rect = svg.getBoundingClientRect()
      const factor = event.deltaY > 0 ? 0.9 : 1.12
      setView((current) => zoomAt(current, factor, event.clientX, event.clientY, rect))
    }
    svg.addEventListener("wheel", onWheel, { passive: false })
    return () => svg.removeEventListener("wheel", onWheel)
  }, [])

  function zoom(factor: number) {
    const rect = svgRef.current?.getBoundingClientRect()
    setView((current) => {
      if (!rect) return clampView({ ...current, scale: current.scale * factor })
      return zoomAt(current, factor, rect.left + rect.width / 2, rect.top + rect.height / 2, rect)
    })
  }

  function onPointerDown(event: ReactPointerEvent<SVGSVGElement>) {
    if (event.button !== 0) return
    if (event.target instanceof Element && event.target.closest("[data-pin]")) return
    drag.current = {
      active: true,
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      originX: view.x,
      originY: view.y,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    if (!drag.current.active || drag.current.pointerId !== event.pointerId) return
    const dx = event.clientX - drag.current.x
    const dy = event.clientY - drag.current.y
    const rect = event.currentTarget.getBoundingClientRect()
    setView((current) =>
      clampView({
        ...current,
        x: drag.current.originX + dx * (MAP_WIDTH / rect.width),
        y: drag.current.originY + dy * (MAP_HEIGHT / rect.height),
      }),
    )
  }

  function onPointerUp(event: ReactPointerEvent<SVGSVGElement>) {
    if (drag.current.pointerId !== event.pointerId) return
    drag.current.active = false
  }

  return (
    <div className="relative border border-line" style={{ background: sea }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="h-[68vh] min-h-[420px] w-full touch-none sm:h-[min(78vh,820px)]"
        role="group"
        aria-label="World map"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect()
          setView((current) => zoomAt(current, 1.6, event.clientX, event.clientY, rect))
        }}
      >
        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill={sea} />
        <g
          transform={`translate(${MAP_WIDTH / 2} ${MAP_HEIGHT / 2}) translate(${view.x} ${view.y}) scale(${view.scale}) translate(${-MAP_WIDTH / 2} ${-MAP_HEIGHT / 2})`}
        >
          {lands.map((shape) => (
            <path key={shape.id} d={shape.d} fill={land} stroke={coast} strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
          ))}
          {pins.map((pin) =>
            pin.offset ? (
              <line
                key={`${pin.item.id}-stem`}
                x1={pin.originX}
                y1={pin.originY}
                x2={pin.x}
                y2={pin.y}
                stroke="#1a1714"
                strokeWidth={1 / view.scale}
                opacity={0.7}
              />
            ) : null,
          )}
          {pins.map((pin) => (
            <Pin
              key={pin.item.id}
              place={pin.item}
              x={pin.x}
              y={pin.y}
              scale={view.scale}
              selected={pin.item.id === selectedId}
              onSelect={onSelect}
            />
          ))}
        </g>
      </svg>
      <div className="absolute top-3 right-3 flex flex-col gap-2" role="group" aria-label="Map zoom">
        <button type="button" className="size-11 border border-line bg-ink text-lg" onClick={() => zoom(1.35)} aria-label="Zoom in">
          +
        </button>
        <button type="button" className="size-11 border border-line bg-ink text-lg" onClick={() => zoom(0.75)} aria-label="Zoom out">
          −
        </button>
        <button
          type="button"
          className="h-11 border border-line bg-ink px-2 text-[0.65rem] tracking-[0.14em] uppercase"
          onClick={() => setView({ x: 0, y: 0, scale: 1.15 })}
        >
          Reset
        </button>
      </div>
    </div>
  )
}

function Pin({
  place,
  x,
  y,
  scale,
  selected,
  onSelect,
}: {
  place: Place
  x: number
  y: number
  scale: number
  selected: boolean
  onSelect: (id: string) => void
}) {
  const colors = place.brothers.map((id) => accents[id])
  const fill = colors[0] ?? "#f3efe6"
  const radius = (selected ? 7.5 : 5.5) / scale
  const hit = 12 / scale

  function choose() {
    onSelect(place.id)
  }

  return (
    <g
      data-pin="true"
      className="pin"
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${place.name}, ${place.city}, ${place.country}`}
      transform={`translate(${x} ${y})`}
      onClick={(event) => {
        event.stopPropagation()
        choose()
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          choose()
        }
      }}
      style={{ cursor: "pointer" }}
    >
      <circle className="pin-hit" r={hit} fill="transparent" />
      {colors.slice(1).map((color, index) => (
        <circle key={color} r={radius + (3 + index * 2) / scale} fill="none" stroke={color} strokeWidth={1.6 / scale} />
      ))}
      <circle r={radius} fill={fill} stroke={selected ? "#1a1714" : "#fffdf8"} strokeWidth={1.4 / scale} />
    </g>
  )
}

function zoomAt(current: View, factor: number, clientX: number, clientY: number, rect: DOMRect): View {
  const scale = clamp(current.scale * factor, minScale, maxScale)
  const sx = ((clientX - rect.left) / rect.width) * MAP_WIDTH
  const sy = ((clientY - rect.top) / rect.height) * MAP_HEIGHT
  const worldX = MAP_WIDTH / 2 + (sx - MAP_WIDTH / 2 - current.x) / current.scale
  const worldY = MAP_HEIGHT / 2 + (sy - MAP_HEIGHT / 2 - current.y) / current.scale
  return clampView({
    scale,
    x: sx - MAP_WIDTH / 2 - scale * (worldX - MAP_WIDTH / 2),
    y: sy - MAP_HEIGHT / 2 - scale * (worldY - MAP_HEIGHT / 2),
  })
}

function clampView(view: View): View {
  const scale = clamp(view.scale, minScale, maxScale)
  const limitX = (MAP_WIDTH * (scale - 1)) / 2 + 120
  const limitY = (MAP_HEIGHT * (scale - 1)) / 2 + 90
  return {
    scale,
    x: clamp(view.x, -limitX, limitX),
    y: clamp(view.y, -limitY, limitY),
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
