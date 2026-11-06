"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Map, { Layer, Marker, Source, type MapRef } from "react-map-gl/maplibre"
import { setWorkerUrl, type ExpressionSpecification, type FilterSpecification, type GeoJSONSource, type Map as MaplibreMap, type MapLayerMouseEvent, type StyleSpecification } from "maplibre-gl"

setWorkerUrl("/workers/maplibre")
import "maplibre-gl/dist/maplibre-gl.css"
import { ClusterDonut } from "@/components/map/cluster-donut"
import { loadEditorialStyle, type RecolorableStyle } from "@/lib/globe-style"
import { placeIdFromMapFeatures, placesToGeoJSON, trailsToGeoJSON } from "@/lib/pins"
import { accents } from "@/lib/theme"
import type { CityStop } from "@/lib/trails"
import { brotherIds, type BrotherId, type Place } from "@/lib/types"

type ClusterMark = {
  id: number
  longitude: number
  latitude: number
  count: number
  alec: number
  niko: number
  eli: number
}

const dashFrames: number[][] = Array.from({ length: 20 }, (_, index) => {
  const shift = (index / 20) * 4
  return [shift, 1.4, Math.max(0.2, 4 - shift), 1.4]
})

function colorMatch(field: "primary" | "secondary"): ExpressionSpecification {
  return ["match", ["get", field], "alec", accents.alec, "niko", accents.niko, "eli", accents.eli, accents.alec]
}

const unclustered = ["!", ["has", "point_count"]] as FilterSpecification

function readClusters(map: MaplibreMap): ClusterMark[] {
  const features = map.querySourceFeatures("places")
  const seen = new Set<number>()
  const marks: ClusterMark[] = []
  for (const feature of features) {
    const props = feature.properties
    if (!props?.cluster || feature.geometry.type !== "Point") continue
    const id = Number(props.cluster_id)
    if (seen.has(id)) continue
    seen.add(id)
    const [longitude, latitude] = feature.geometry.coordinates
    marks.push({
      id,
      longitude: longitude ?? 0,
      latitude: latitude ?? 0,
      count: Number(props.point_count) || 0,
      alec: Number(props.alec) || 0,
      niko: Number(props.niko) || 0,
      eli: Number(props.eli) || 0,
    })
  }
  return marks
}

async function expandCluster(map: MaplibreMap, mark: ClusterMark, reducedMotion: boolean) {
  const source = map.getSource("places")
  if (!source || source.type !== "geojson") return
  const expanded = await (source as GeoJSONSource).getClusterExpansionZoom(mark.id)
  const zoom = Math.max(expanded, map.getZoom() + 1.25)
  map.easeTo({
    center: [mark.longitude, mark.latitude],
    zoom,
    duration: reducedMotion ? 0 : 700,
    essential: true,
  })
}

function fly(map: MaplibreMap, longitude: number, latitude: number, zoom: number, pitch: number, duration: number) {
  return new Promise<void>((resolve) => {
    if (duration === 0) {
      map.jumpTo({ center: [longitude, latitude], zoom, pitch })
      resolve()
      return
    }
    const done = () => {
      map.off("moveend", done)
      resolve()
    }
    map.once("moveend", done)
    map.easeTo({
      center: [longitude, latitude],
      zoom,
      pitch,
      duration,
      essential: true,
      easing: (t) => 1 - (1 - t) ** 3,
    })
  })
}

export function GlobeMap({
  places,
  catalog,
  trailBrothers,
  selected,
  hovered,
  cityFocus,
  tour,
  reducedMotion,
  phone,
  onSelect,
  onHover,
  onTourEnd,
  visible,
}: {
  places: readonly Place[]
  catalog: readonly Place[]
  trailBrothers: readonly BrotherId[]
  selected: Place | null
  hovered: Place | null
  cityFocus: { longitude: number; latitude: number; token: number } | null
  tour: { stops: CityStop[]; token: number } | null
  reducedMotion: boolean
  phone: boolean
  onSelect: (id: string | null) => void
  onHover: (id: string | null) => void
  onTourEnd: () => void
  visible: boolean
}) {
  const mapRef = useRef<MapRef>(null)
  const [style, setStyle] = useState<RecolorableStyle | null>(null)
  const [failed, setFailed] = useState(false)
  const [map, setMap] = useState<MaplibreMap | null>(null)
  const [clusters, setClusters] = useState<ClusterMark[]>([])
  const [wave, setWave] = useState<{ places: readonly Place[]; count: number }>({ places, count: 0 })
  const spinPaused = useRef(false)
  const flown = useRef<string | null>(null)
  const pixelRatio = typeof window === "undefined" ? 1 : Math.min(window.devicePixelRatio || 1, phone ? 1.5 : 2)

  useEffect(() => {
    let cancel = false
    loadEditorialStyle()
      .then((next) => {
        if (!cancel) setStyle(next)
      })
      .catch(() => {
        if (!cancel) setFailed(true)
      })
    return () => {
      cancel = true
    }
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    let shown = 0
    const chunk = Math.max(24, Math.ceil(places.length / 10))
    const timer = window.setInterval(() => {
      shown = Math.min(places.length, shown + chunk)
      setWave({ places, count: shown })
      if (shown >= places.length) window.clearInterval(timer)
    }, 45)
    return () => window.clearInterval(timer)
  }, [places, reducedMotion])

  const revealed = wave.places === places ? wave.count : 0
  const pins = useMemo(() => placesToGeoJSON(reducedMotion || revealed >= places.length ? places : places.slice(0, revealed)), [places, revealed, reducedMotion])
  const trails = useMemo(() => trailsToGeoJSON(catalog, trailBrothers), [catalog, trailBrothers])

  useEffect(() => {
    if (!map) return
    const refresh = () => {
      if (!map.getSource("places") || !map.isSourceLoaded("places")) return
      setClusters(readClusters(map))
    }
    map.on("move", refresh)
    map.on("sourcedata", refresh)
    refresh()
    return () => {
      map.off("move", refresh)
      map.off("sourcedata", refresh)
    }
  }, [map, pins])

  useEffect(() => {
    if (!map) return
    map.resize()
  }, [map, phone, visible])

  useEffect(() => {
    if (!map || reducedMotion || trailBrothers.length === 0) return
    let frame = 0
    let index = 0
    let last = 0
    const step = (now: number) => {
      frame = window.requestAnimationFrame(step)
      if (now - last < 70) return
      last = now
      index = (index + 1) % dashFrames.length
      const dash = dashFrames[index]
      if (!dash) return
      for (const id of ["trail-alec", "trail-niko", "trail-eli"] as const) {
        if (map.getLayer(id)) map.setPaintProperty(id, "line-dasharray", dash)
      }
    }
    frame = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(frame)
  }, [map, reducedMotion, trailBrothers])

  useEffect(() => {
    if (!map || !selected) {
      flown.current = null
      return
    }
    const key = `${selected.id}:${phone}:${reducedMotion}`
    if (flown.current === key) return
    flown.current = key
    spinPaused.current = true
    const pitch = phone || reducedMotion ? 0 : 38
    const zoom = selected.wishlist ? 4.4 : phone ? 12.2 : 13.4
    void fly(map, selected.longitude, selected.latitude, zoom, pitch, reducedMotion ? 0 : 1400)
  }, [map, selected, phone, reducedMotion])

  useEffect(() => {
    if (!map || !cityFocus) return
    spinPaused.current = true
    void fly(map, cityFocus.longitude, cityFocus.latitude, phone ? 12.6 : 13.2, phone || reducedMotion ? 0 : 28, reducedMotion ? 0 : 1500)
  }, [map, cityFocus, phone, reducedMotion])

  useEffect(() => {
    if (!map || !tour) return
    spinPaused.current = true
    let cancel = false
    const pitch = phone || reducedMotion ? 0 : 32
    ;(async () => {
      for (const stop of tour.stops) {
        if (cancel) return
        await fly(map, stop.longitude, stop.latitude, phone ? 5.2 : 5.6, pitch, reducedMotion ? 0 : 1650)
      }
      if (!cancel) onTourEnd()
    })()
    return () => {
      cancel = true
    }
  }, [map, tour, phone, reducedMotion, onTourEnd])

  useEffect(() => {
    if (!map || reducedMotion) return
    const stop = () => {
      spinPaused.current = true
    }
    map.on("mousedown", stop)
    map.on("touchstart", stop)
    map.on("wheel", stop)
    map.on("dragstart", stop)
    let frame = 0
    let last = performance.now()
    const spin = (now: number) => {
      frame = window.requestAnimationFrame(spin)
      if (spinPaused.current || map.getZoom() > 2.7 || map.isMoving()) {
        last = now
        return
      }
      const delta = now - last
      last = now
      const center = map.getCenter()
      map.setCenter({ lng: center.lng + delta * 0.0035, lat: center.lat })
    }
    const start = window.setTimeout(() => {
      last = performance.now()
      frame = window.requestAnimationFrame(spin)
    }, reducedMotion ? 0 : 2900)
    return () => {
      window.clearTimeout(start)
      window.cancelAnimationFrame(frame)
      map.off("mousedown", stop)
      map.off("touchstart", stop)
      map.off("wheel", stop)
      map.off("dragstart", stop)
    }
  }, [map, reducedMotion])

  function onLoad(event: { target: MaplibreMap }) {
    const next = event.target
    next.setSky({
      "sky-color": "#c5d4e6",
      "horizon-color": "#f7f3ec",
      "fog-color": "#e7e0d4",
      "sky-horizon-blend": 0.72,
      "horizon-fog-blend": 0.7,
      "fog-ground-blend": 0.35,
      "atmosphere-blend": ["interpolate", ["linear"], ["zoom"], 0, 1, 4, 0.72, 8, 0.15, 11, 0],
    })
    if (!phone) {
      try {
        if (!next.getSource("terrain")) {
          next.addSource("terrain", {
            type: "raster-dem",
            tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
            encoding: "terrarium",
            tileSize: 256,
            maxzoom: 15,
          })
        }
        next.setTerrain({ source: "terrain", exaggeration: 1.12 })
      } catch {
        next.setTerrain(null)
      }
    }
    if (!selected) {
      if (reducedMotion) next.jumpTo({ center: [-30, 24], zoom: 1.65, pitch: 0 })
      else next.jumpTo({ center: [48, 8], zoom: 0.8, pitch: phone ? 0 : 18 })
      if (!reducedMotion) {
        next.easeTo({ center: [-28, 25], zoom: 1.72, pitch: phone ? 0 : 16, duration: 2600, essential: true })
      }
    }
    setMap(next)
  }

  function onClick(event: MapLayerMouseEvent) {
    const map = event.target
    const layers = ["pins-hit", "pins", "pins-shared"].filter((id) => map.getLayer(id))
    const pad = phone ? 28 : 16
    const box: [[number, number], [number, number]] = [
      [event.point.x - pad, event.point.y - pad],
      [event.point.x + pad, event.point.y + pad],
    ]
    const features = layers.length ? map.queryRenderedFeatures(box, { layers }) : []
    let bestId: string | null = null
    let best = Number.POSITIVE_INFINITY
    const seen = new Set<string>()
    for (const feature of features) {
      const id = placeIdFromMapFeatures([feature])
      if (!id || seen.has(id) || feature.geometry.type !== "Point") continue
      seen.add(id)
      const [lng, lat] = feature.geometry.coordinates
      const projected = map.project([lng ?? 0, lat ?? 0])
      const distance = Math.hypot(projected.x - event.point.x, projected.y - event.point.y)
      if (distance < best) {
        best = distance
        bestId = id
      }
    }
    onSelect(bestId)
  }

  function onMove(event: MapLayerMouseEvent) {
    const feature = event.features?.find((item) => item.properties && !item.properties.cluster && item.properties.id)
    onHover(feature?.properties?.id ? String(feature.properties.id) : null)
  }

  if (failed) {
    return (
      <div className="flex h-[70vh] min-h-[28rem] items-center border border-line px-6">
        <p className="max-w-md text-muted">The globe style didn&apos;t load. The list still has every place.</p>
      </div>
    )
  }

  if (!style) {
    return <div className="h-[70vh] min-h-[28rem] border border-line bg-ink" role="status" aria-label="Loading the globe" />
  }

  const marker = hovered ?? selected

  return (
    <div className="globe-map relative h-[70vh] min-h-[28rem] overflow-hidden border border-line">
      <Map
        ref={mapRef}
        mapStyle={style as StyleSpecification}
        projection="globe"
        initialViewState={{ longitude: selected?.longitude ?? 40, latitude: selected?.latitude ?? 10, zoom: selected ? 2.2 : 0.8, pitch: 0 }}
        minZoom={0.8}
        maxZoom={17}
        maxPitch={phone ? 0 : 50}
        pitchWithRotate={!phone}
        dragRotate={!phone}
        touchPitch={false}
        pixelRatio={pixelRatio}
        cursor={hovered ? "pointer" : "grab"}
        interactiveLayerIds={["pins-hit", "pins", "pins-shared"]}
        onLoad={onLoad}
        onClick={onClick}
        onMouseMove={onMove}
        onMouseLeave={() => onHover(null)}
      >
        <Source id="trails" type="geojson" data={trails}>
          {brotherIds.map((id) => (
            <Layer
              key={id}
              id={`trail-${id}`}
              type="line"
              filter={["==", ["get", "brother"], id] as FilterSpecification}
              paint={{
                "line-color": accents[id],
                "line-width": 2.25,
                "line-opacity": 0.9,
                "line-dasharray": reducedMotion ? [1.4, 1.2] : [0, 1.4, 4, 1.4],
              }}
              layout={{ "line-cap": "round", "line-join": "round" }}
            />
          ))}
        </Source>
        <Source
          id="places"
          type="geojson"
          data={pins}
          cluster
          clusterRadius={52}
          clusterMaxZoom={11}
          clusterProperties={{
            alec: ["+", ["get", "alec"]],
            niko: ["+", ["get", "niko"]],
            eli: ["+", ["get", "eli"]],
          }}
          promoteId="id"
        >
          <Layer
            id="pins-hit"
            type="circle"
            filter={unclustered}
            paint={{
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 2, 18, 8, 22, 14, 28],
              "circle-color": "#000000",
              "circle-opacity": 0,
            }}
          />
          <Layer
            id="pins"
            type="circle"
            filter={unclustered}
            paint={{
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 1.5, 3.5, 8, 6, 14, 9],
              "circle-color": colorMatch("primary"),
              "circle-opacity": ["case", ["==", ["get", "open"], 1], 0, 0.94],
              "circle-stroke-color": colorMatch("primary"),
              "circle-stroke-width": ["case", ["==", ["get", "open"], 1], 2.4, 0.75],
              "circle-stroke-opacity": 1,
            }}
          />
          <Layer
            id="pins-shared"
            type="circle"
            filter={["all", unclustered, ["!=", ["get", "secondary"], ""]] as FilterSpecification}
            paint={{
              "circle-radius": ["interpolate", ["linear"], ["zoom"], 1.5, 7, 8, 11, 14, 15],
              "circle-color": "transparent",
              "circle-stroke-color": colorMatch("secondary"),
              "circle-stroke-width": 2,
              "circle-opacity": 1,
            }}
          />
        </Source>
        {clusters.map((mark) => (
          <Marker key={mark.id} longitude={mark.longitude} latitude={mark.latitude} anchor="center">
            <button
              type="button"
              className="rounded-full"
              aria-label={`${mark.count} places. Zoom in.`}
              onPointerUp={(event) => {
                event.stopPropagation()
                event.preventDefault()
                if (map) void expandCluster(map, mark, reducedMotion)
              }}
            >
              <ClusterDonut count={mark.count} alec={mark.alec} niko={mark.niko} eli={mark.eli} />
            </button>
          </Marker>
        ))}
        {marker ? (
          <Marker longitude={marker.longitude} latitude={marker.latitude} anchor="center" style={{ pointerEvents: "none" }}>
            <span
              className={reducedMotion ? "pin-pulse pin-pulse-still" : "pin-pulse"}
              style={{ color: accents[marker.brothers[0] ?? "alec"] }}
            />
          </Marker>
        ) : null}
      </Map>
    </div>
  )
}
