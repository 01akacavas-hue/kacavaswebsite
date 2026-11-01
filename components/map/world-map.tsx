"use client"

import { geoEqualEarth, geoPath } from "d3-geo"
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import { accents } from "@/lib/theme"
import type { Place } from "@/lib/types"
import { MAP_HEIGHT, MAP_WIDTH, countries } from "@/lib/world"

type View = { x: number; y: number; scale: number }

const minScale = 1
const maxScale = 6

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
  const [view, setView] = useState<View>({ x: 0, y: 0, scale: 1 })
  const drag = useRef({
    active: false,
    moved: false,
    pointerId: -1,
    x: 0,
    y: 0,
    originX: 0,
    originY: 0,
  })

  const projection = useMemo(() => {
    return geoEqualEarth().fitExtent(
      [
        [16, 12],
        [MAP_WIDTH - 16, MAP_HEIGHT - 12],
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
    return places.flatMap((place) => {
      const point = projection([place.longitude, place.latitude])
      if (!point) return []
      return [{ place, x: point[0], y: point[1] }]
    })
  }, [places, projection])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const factor = event.deltaY > 0 ? 0.92 : 1.08
      setView((current) => clampView({ ...current, scale: current.scale * factor }))
    }
    svg.addEventListener("wheel", onWheel, { passive: false })
    return () => svg.removeEventListener("wheel", onWheel)
  }, [])

  function zoom(factor: number) {
    setView((current) => clampView({ ...current, scale: current.scale * factor }))
  }

  function onPointerDown(event: ReactPointerEvent<SVGSVGElement>) {
    if (event.button !== 0) return
    if (event.target instanceof Element && event.target.closest("[data-pin]")) return
    drag.current = {
      active: true,
      moved: false,
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
    if (Math.hypot(dx, dy) > 4) drag.current.moved = true
    const rect = event.currentTarget.getBoundingClientRect()
    const scaleX = MAP_WIDTH / rect.width
    const scaleY = MAP_HEIGHT / rect.height
    setView((current) =>
      clampView({
        ...current,
        x: drag.current.originX + dx * scaleX,
        y: drag.current.originY + dy * scaleY,
      }),
    )
  }

  function onPointerUp(event: ReactPointerEvent<SVGSVGElement>) {
    if (drag.current.pointerId !== event.pointerId) return
    drag.current.active = false
  }

  return (
    <div className="relative border border-line bg-ink">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="h-[52vh] w-full touch-none sm:h-[min(68vh,640px)]"
        role="group"
        aria-label="World map"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#090908" />
        <g
          transform={`translate(${MAP_WIDTH / 2} ${MAP_HEIGHT / 2}) translate(${view.x} ${view.y}) scale(${view.scale}) translate(${-MAP_WIDTH / 2} ${-MAP_HEIGHT / 2})`}
        >
          {lands.map((land) => (
            <path key={land.id} d={land.d} className="map-land" />
          ))}
          {pins.map(({ place, x, y }) => (
            <Pin
              key={place.id}
              place={place}
              x={x}
              y={y}
              scale={view.scale}
              selected={place.id === selectedId}
              onSelect={onSelect}
            />
          ))}
        </g>
      </svg>
      <div className="absolute right-3 bottom-3 flex flex-col gap-2" role="group" aria-label="Map zoom">
        <button type="button" className="size-11 border border-line bg-ink text-lg" onClick={() => zoom(1.25)} aria-label="Zoom in">
          +
        </button>
        <button type="button" className="size-11 border border-line bg-ink text-lg" onClick={() => zoom(0.8)} aria-label="Zoom out">
          −
        </button>
        <button
          type="button"
          className="h-11 border border-line bg-ink px-2 text-[0.65rem] tracking-[0.14em] uppercase"
          onClick={() => setView({ x: 0, y: 0, scale: 1 })}
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
  const radius = (selected ? 7 : 5) / scale
  const hit = 8 / scale

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
      <circle className="pin-hit" r={hit} fill="transparent" stroke="transparent" />
      {colors.slice(1).map((color, index) => (
        <circle
          key={color}
          r={radius + 3 + index * 2.5}
          fill="none"
          stroke={color}
          strokeWidth={1.4 / scale}
        />
      ))}
      <circle r={radius} fill={fill} stroke={selected ? "#f3efe6" : "none"} strokeWidth={1.2 / scale} />
    </g>
  )
}

function clampView(view: View): View {
  const scale = Math.min(maxScale, Math.max(minScale, view.scale))
  const limitX = (MAP_WIDTH * (scale - 1)) / 2 + 90
  const limitY = (MAP_HEIGHT * (scale - 1)) / 2 + 70
  return {
    scale,
    x: Math.min(limitX, Math.max(-limitX, view.x)),
    y: Math.min(limitY, Math.max(-limitY, view.y)),
  }
}
