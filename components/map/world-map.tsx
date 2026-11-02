"use client"

import { geoEqualEarth, geoPath } from "d3-geo"
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import { clusterPoints } from "@/lib/cluster"
import { clampCamera, frameBounds, framePoint, zoomAt, type Camera } from "@/lib/map-camera"
import { spiderfy } from "@/lib/spiderfy"
import { brotherLabel } from "@/lib/places"
import { accents } from "@/lib/theme"
import type { Place } from "@/lib/types"
import { MAP_HEIGHT, MAP_WIDTH, countries } from "@/lib/world"

export type MapHandle = {
  flyTo: (latitude: number, longitude: number, scale?: number) => void
}

type Props = {
  places: readonly Place[]
  selectedId: string | null
  onSelect: (id: string) => void
}

const minScale = 1
const maxScale = 7200
const sea = "#c5d5e4"
const land = "#f4efe4"
const coast = "#6e675c"
const home: Camera = { x: 0, y: 0, scale: 1.15 }

export const WorldMap = forwardRef<MapHandle, Props>(function WorldMap({ places, selectedId, onSelect }, ref) {
  const svgRef = useRef<SVGSVGElement>(null)
  const camera = useRef<Camera>(home)
  const frame = useRef<number | null>(null)
  const [view, setView] = useState<Camera>(home)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinch = useRef<{ distance: number; camera: Camera; x: number; y: number } | null>(null)
  const drag = useRef({ active: false, pointerId: -1, x: 0, y: 0, originX: 0, originY: 0 })

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

  function commit(next: Camera) {
    const clamped = clampCamera(next, MAP_WIDTH, MAP_HEIGHT, minScale, maxScale)
    camera.current = clamped
    setView(clamped)
  }

  function animateTo(target: Camera) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const destination = clampCamera(target, MAP_WIDTH, MAP_HEIGHT, minScale, maxScale)
    if (frame.current) cancelAnimationFrame(frame.current)
    if (reduce) {
      commit(destination)
      return
    }
    const start = camera.current
    const began = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - began) / 760)
      const eased = 1 - (1 - t) ** 3
      commit({
        x: start.x + (destination.x - start.x) * eased,
        y: start.y + (destination.y - start.y) * eased,
        scale: start.scale + (destination.scale - start.scale) * eased,
      })
      if (t < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
  }

  useImperativeHandle(ref, () => ({
    flyTo(latitude, longitude, scale = 4200) {
      const point = projection([longitude, latitude])
      if (!point) return
      setExpandedId(null)
      animateTo(framePoint(point[0], point[1], scale, MAP_WIDTH, MAP_HEIGHT, minScale, maxScale))
    },
  }))

  useEffect(() => {
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const rect = svg.getBoundingClientRect()
      const factor = event.deltaY > 0 ? 0.9 : 1.12
      setExpandedId(null)
      commit(zoomAt(camera.current, factor, event.clientX, event.clientY, rect, MAP_WIDTH, MAP_HEIGHT, minScale, maxScale))
    }
    svg.addEventListener("wheel", onWheel, { passive: false })
    return () => svg.removeEventListener("wheel", onWheel)
  }, [])

  const projected = useMemo(() => {
    return places.flatMap((place) => {
      const point = projection([place.longitude, place.latitude])
      if (!point) return []
      return [{ ...place, id: place.id, x: point[0], y: point[1], place }]
    })
  }, [places, projection])

  const groups = useMemo(() => {
    const visits = projected.filter((place) => !place.wishlist)
    const wishes = projected.filter((place) => place.wishlist)
    const radius = 28 / view.scale
    return [...clusterPoints(visits, radius), ...clusterPoints(wishes, radius)]
  }, [projected, view.scale])

  function zoomBy(factor: number) {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return
    setExpandedId(null)
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    animateTo(zoomAt(camera.current, factor, cx, cy, rect, MAP_WIDTH, MAP_HEIGHT, minScale, maxScale))
  }

  function openCluster(members: { x: number; y: number }[], id: string) {
    const next = frameBounds(members, MAP_WIDTH, MAP_HEIGHT, minScale, maxScale)
    if (next.scale <= camera.current.scale * 1.12) {
      setExpandedId(id)
      return
    }
    setExpandedId(null)
    animateTo(next)
  }

  function onPointerDown(event: ReactPointerEvent<SVGSVGElement>) {
    if (event.target instanceof Element && event.target.closest("[data-pin]")) return
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    event.currentTarget.setPointerCapture(event.pointerId)
    if (pointers.current.size >= 2) {
      const [first, second] = [...pointers.current.values()]
      if (!first || !second) return
      drag.current.active = false
      pinch.current = {
        distance: Math.max(1, Math.hypot(first.x - second.x, first.y - second.y)),
        camera: camera.current,
        x: (first.x + second.x) / 2,
        y: (first.y + second.y) / 2,
      }
      return
    }
    if (event.button !== 0) return
    if (event.target instanceof Element && event.target.closest("[data-pin]")) return
    drag.current = {
      active: true,
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      originX: camera.current.x,
      originY: camera.current.y,
    }
  }

  function onPointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    if (!pointers.current.has(event.pointerId)) return
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    if (pointers.current.size >= 2 && pinch.current) {
      const [first, second] = [...pointers.current.values()]
      if (!first || !second) return
      const distance = Math.max(1, Math.hypot(first.x - second.x, first.y - second.y))
      const rect = event.currentTarget.getBoundingClientRect()
      setExpandedId(null)
      commit(
        zoomAt(
          pinch.current.camera,
          distance / pinch.current.distance,
          pinch.current.x,
          pinch.current.y,
          rect,
          MAP_WIDTH,
          MAP_HEIGHT,
          minScale,
          maxScale,
        ),
      )
      return
    }
    if (!drag.current.active || drag.current.pointerId !== event.pointerId) return
    const dx = event.clientX - drag.current.x
    const dy = event.clientY - drag.current.y
    const rect = event.currentTarget.getBoundingClientRect()
    commit({
      ...camera.current,
      x: drag.current.originX + dx * (MAP_WIDTH / rect.width),
      y: drag.current.originY + dy * (MAP_HEIGHT / rect.height),
    })
  }

  function onPointerUp(event: ReactPointerEvent<SVGSVGElement>) {
    pointers.current.delete(event.pointerId)
    if (pointers.current.size < 2) pinch.current = null
    if (drag.current.pointerId === event.pointerId) drag.current.active = false
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
          setExpandedId(null)
          animateTo(zoomAt(camera.current, 1.8, event.clientX, event.clientY, rect, MAP_WIDTH, MAP_HEIGHT, minScale, maxScale))
        }}
      >
        <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill={sea} />
        <g transform={`translate(${MAP_WIDTH / 2} ${MAP_HEIGHT / 2}) translate(${view.x} ${view.y}) scale(${view.scale}) translate(${-MAP_WIDTH / 2} ${-MAP_HEIGHT / 2})`}>
          {lands.map((shape) => (
            <path key={shape.id} d={shape.d} fill={land} stroke={coast} strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
          ))}
          {groups.map((group) => {
            const open = group.members.length > 1 && group.id === expandedId
            if (group.members.length > 1 && !open) {
              return (
                <ClusterBadge
                  key={group.id}
                  x={group.x}
                  y={group.y}
                  count={group.members.length}
                  scale={view.scale}
                  wishlist={Boolean(group.members[0]?.wishlist)}
                  onOpen={() => openCluster(group.members, group.id)}
                />
              )
            }
            const pins =
              group.members.length === 1
                ? group.members.map((member) => ({ ...member, x: member.x, y: member.y }))
                : spiderfy(
                    group.members.map((member) => ({ item: member, x: member.x, y: member.y })),
                    16 / view.scale,
                  ).map((pin) => ({ ...pin.item, x: pin.x, y: pin.y }))
            return pins.map((pin) => (
              <Pin
                key={pin.id}
                place={pin.place}
                x={pin.x}
                y={pin.y}
                scale={view.scale}
                selected={pin.id === selectedId}
                onSelect={onSelect}
              />
            ))
          })}
        </g>
      </svg>
      <div className="absolute top-3 left-3 flex flex-col gap-2" role="group" aria-label="Map zoom">
        <button type="button" className="size-11 border border-line bg-ink text-lg" onClick={() => zoomBy(1.45)} aria-label="Zoom in">
          +
        </button>
        <button type="button" className="size-11 border border-line bg-ink text-lg" onClick={() => zoomBy(0.7)} aria-label="Zoom out">
          −
        </button>
        <button type="button" className="h-11 border border-line bg-ink px-2 text-[0.65rem] tracking-[0.14em] uppercase" onClick={() => animateTo(home)}>
          Reset
        </button>
      </div>
      <ul className="absolute bottom-3 left-3 flex flex-wrap gap-x-3 gap-y-1 bg-ink/90 px-3 py-2 text-[0.7rem] tracking-[0.12em] uppercase">
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-alec" /> {brotherLabel("alec")}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-eli" /> {brotherLabel("eli")}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-niko" /> {brotherLabel("niko")}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full border border-ink bg-transparent" /> Next up
        </li>
      </ul>
    </div>
  )
})

function ClusterBadge({
  x,
  y,
  count,
  scale,
  wishlist,
  onOpen,
}: {
  x: number
  y: number
  count: number
  scale: number
  wishlist: boolean
  onOpen: () => void
}) {
  const radius = 13 / scale
  return (
    <g
      data-pin="true"
      role="button"
      tabIndex={0}
      aria-label={`${count} places. Zoom in.`}
      transform={`translate(${x} ${y})`}
      onClick={(event) => {
        event.stopPropagation()
        onOpen()
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onOpen()
        }
      }}
      style={{ cursor: "pointer" }}
    >
      <circle r={radius} fill={wishlist ? "#f7f3ec" : "#1a1714"} stroke="#1a1714" strokeWidth={1.2 / scale} />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill={wishlist ? "#1a1714" : "#f7f3ec"}
        fontSize={9 / scale}
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {count}
      </text>
    </g>
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
  const fill = colors[0] ?? "#1a1714"
  const radius = (selected ? 7.5 : 5.5) / scale
  const hit = 14 / scale

  function choose() {
    onSelect(place.id)
  }

  return (
    <g
      data-pin="true"
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${place.name}, ${place.city}`}
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
      <circle r={hit} fill="transparent" />
      {colors.slice(1).map((color, index) => (
        <circle key={color} r={radius + (3 + index * 2) / scale} fill="none" stroke={color} strokeWidth={1.6 / scale} />
      ))}
      <circle
        r={radius}
        fill={place.wishlist ? "none" : fill}
        stroke={selected ? "#1a1714" : place.wishlist ? fill : "#fffdf8"}
        strokeWidth={(place.wishlist ? 2 : 1.4) / scale}
      />
    </g>
  )
}
