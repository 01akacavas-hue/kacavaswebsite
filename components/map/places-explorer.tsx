"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { FilterBar } from "@/components/map/filter-bar"
import { PlaceCard } from "@/components/map/place-card"
import { PlaceList } from "@/components/map/place-list"
import { useMapFilters } from "@/components/map/use-map-filters"
import { supportsWebGL, usePhone, usePrefersReducedMotion, useWideScreen } from "@/components/map/use-viewport"
import { cityOptions, visiblePlaces } from "@/lib/map-filters"
import { uniqueValues } from "@/lib/places"
import { citiesForBrother, type CityStop } from "@/lib/trails"
import type { CityTable } from "@/data/places"
import type { Place, PlaceCategory } from "@/lib/types"

const GlobeMap = dynamic(() => import("@/components/map/globe-map").then((mod) => mod.GlobeMap), {
  ssr: false,
  loading: () => <div className="h-[70vh] min-h-[28rem] border border-line bg-ink" role="status" aria-label="Loading the globe" />,
})

export function PlacesExplorer({ places, cityTables }: { places: readonly Place[]; cityTables: readonly CityTable[] }) {
  const router = useRouter()
  const reducedMotion = usePrefersReducedMotion()
  const phone = usePhone()
  const wide = useWideScreen()
  const [booted, setBooted] = useState(false)
  const [webgl, setWebgl] = useState(true)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [cityFocus, setCityFocus] = useState<{ longitude: number; latitude: number; token: number } | null>(null)
  const [tour, setTour] = useState<{ stops: CityStop[]; token: number } | null>(null)
  const [playing, setPlaying] = useState(false)
  const placeIds = useMemo(() => new Set(places.map((place) => place.id)), [places])
  const { filters, update } = useMapFilters(placeIds)
  const visible = useMemo(() => visiblePlaces(places, filters), [places, filters])
  const categories = useMemo(() => uniqueValues(places, "category") as PlaceCategory[], [places])
  const cities = useMemo(() => cityOptions(places, filters), [places, filters])
  const selected = places.find((place) => place.id === filters.placeId) ?? null
  const hovered = visible.find((place) => place.id === hoveredId) ?? null
  const tables = cityTables.filter((table) => !filters.city || table.city === filters.city || table.country === filters.city)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setWebgl(supportsWebGL())
      setBooted(true)
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!filters.placeId) return
    if (visible.some((place) => place.id === filters.placeId)) return
    update({ placeId: null })
  }, [filters.placeId, update, visible])

  const endTour = useCallback(() => {
    setPlaying(false)
    setTour(null)
  }, [])

  function choose(id: string | null) {
    endTour()
    update({ placeId: id, view: wide ? filters.view : "map" })
  }

  function chooseCity(city: string) {
    endTour()
    update({ city, placeId: null })
    if (!city) {
      setCityFocus(null)
      return
    }
    const match = cities.find((option) => option.city === city) ?? cityOptions(places, { ...filters, city: "", query: "" }).find((option) => option.city === city)
    if (!match) return
    setCityFocus({ longitude: match.longitude, latitude: match.latitude, token: Date.now() })
  }

  function play() {
    const stops = filters.trails.flatMap((id) => citiesForBrother(places, id))
    if (stops.length === 0) return
    setPlaying(true)
    setTour({ stops, token: Date.now() })
    if (!wide) update({ view: "map" })
  }

  async function lock() {
    await fetch("/api/unlock", { method: "DELETE" })
    router.push("/restaurants")
    router.refresh()
  }

  const showMap = booted && webgl && (wide || filters.view === "map")
  const showList = !booted || !webgl || wide || filters.view === "list"

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.2em] text-muted uppercase">Private</p>
          <h1 className="mt-2 font-serif text-5xl tracking-tight sm:text-6xl">Restaurants & places</h1>
        </div>
        <button type="button" className="h-11 border border-line px-4 text-xs tracking-[0.16em] uppercase" onClick={() => void lock()}>
          Lock
        </button>
      </header>
      <p className="mt-5 max-w-2xl text-muted">
        Alexander&apos;s guide and Nicholas&apos;s, on one globe. Filled pins are visits. Open rings are recommendations, including cities still ahead.
      </p>

      <FilterBar
        places={places}
        filters={filters}
        categories={categories}
        cities={cities}
        playing={playing}
        onChange={update}
        onCity={chooseCity}
        onPlay={play}
      />

      {booted && !webgl ? (
        <p className="mt-4 max-w-xl text-sm text-muted" role="status">
          This browser can&apos;t draw the globe. The list still has every place.
        </p>
      ) : null}

      <div className={`relative mt-4 ${showList && showMap ? "lg:grid lg:grid-cols-[20.5rem_minmax(0,1fr)] lg:items-start lg:gap-3" : ""}`}>
        {showList ? (
          <PlaceList places={visible} selectedId={selected?.id ?? null} hoveredId={hovered?.id ?? null} onSelect={(id) => choose(id)} onHover={setHoveredId} />
        ) : null}
        {showMap ? (
          <div className="relative">
            <GlobeMap
              places={visible}
              catalog={places}
              trailBrothers={filters.trails}
              selected={selected}
              hovered={hovered}
              cityFocus={cityFocus}
              tour={tour}
              reducedMotion={reducedMotion}
              phone={phone}
              visible={showMap}
              onSelect={choose}
              onHover={setHoveredId}
              onTourEnd={endTour}
            />
            {selected ? <PlaceCard place={selected} places={visible} reducedMotion={reducedMotion} onClose={() => choose(null)} onSelect={(id) => choose(id)} /> : null}
          </div>
        ) : null}
      </div>

      {tables.length > 0 ? (
        <section className="mt-12" aria-labelledby="at-the-table">
          <h2 id="at-the-table" className="font-serif text-3xl tracking-tight">
            At the table
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">Dishes Nicholas noted for a city. They stay off the map.</p>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {tables.map((table) => (
              <li key={table.id} className="border border-line p-5">
                <h3 className="font-serif text-2xl">
                  {table.city}
                  <span className="text-muted">, {table.country}</span>
                </h3>
                {table.note ? <p className="mt-3 text-sm leading-relaxed text-muted">{table.note}</p> : null}
                <ul className="mt-3 list-disc pl-5 text-sm leading-relaxed">
                  {table.dishes.map((dish) => (
                    <li key={dish}>{dish}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
