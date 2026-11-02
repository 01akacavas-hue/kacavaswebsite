"use client"

import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { PlaceSheet } from "@/components/map/place-sheet"
import { PlaceTable } from "@/components/map/place-table"
import { WorldMap, type MapHandle } from "@/components/map/world-map"
import { cityTables } from "@/data/places"
import { filterPlaces } from "@/lib/places"
import { accents } from "@/lib/theme"
import type { BrotherId, Place, PlaceFilter } from "@/lib/types"

const filters = [
  { id: "all", label: "All" },
  { id: "alec", label: "Alec" },
  { id: "eli", label: "Eli" },
  { id: "niko", label: "Niko" },
] as const satisfies readonly { id: PlaceFilter; label: string }[]

type Mode = "map" | "table"

export function PlacesExplorer({ places }: { places: readonly Place[] }) {
  const [filter, setFilter] = useState<PlaceFilter>("all")
  const [mode, setMode] = useState<Mode>("map")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([])
  const mapRef = useRef<MapHandle>(null)
  const pending = useRef<Place | null>(null)
  const router = useRouter()
  const visible = filterPlaces(places, filter)
  const selected = places.find((place) => place.id === selectedId) ?? null
  const wishlist = places.filter((place) => place.wishlist)

  useEffect(() => {
    if (mode !== "map" || !pending.current) return
    const place = pending.current
    pending.current = null
    mapRef.current?.flyTo(place.latitude, place.longitude, place.wishlist ? 320 : 4200)
  }, [mode, selectedId])

  function chooseFilter(next: PlaceFilter, focus = false) {
    setFilter(next)
    setSelectedId((current) => {
      if (!current) return null
      return filterPlaces(places, next).some((place) => place.id === current) ? current : null
    })
    if (focus) {
      const index = filters.findIndex((item) => item.id === next)
      tabsRef.current[index]?.focus()
    }
  }

  function onTabKey(event: KeyboardEvent) {
    const current = filters.findIndex((item) => item.id === filter)
    let next = current
    if (event.key === "ArrowRight") next = (current + 1) % filters.length
    else if (event.key === "ArrowLeft") next = (current - 1 + filters.length) % filters.length
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = filters.length - 1
    else return
    event.preventDefault()
    const id = filters[next]?.id
    if (id) chooseFilter(id, true)
  }

  function openFromTable(place: Place) {
    setFilter("all")
    pending.current = place
    setSelectedId(place.id)
    setMode("map")
  }

  function stepTo(id: string) {
    const place = places.find((item) => item.id === id)
    setSelectedId(id)
    if (place && mode === "map") mapRef.current?.flyTo(place.latitude, place.longitude, place.wishlist ? 320 : 4200)
  }

  async function lock() {
    await fetch("/api/unlock", { method: "DELETE" })
    router.push("/restaurants")
    router.refresh()
  }

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
      <p className="mt-5 max-w-2xl text-muted">Tables and towns the brothers have been to, and the places still ahead.</p>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label="Map or table" className="flex gap-2">
          {(["map", "table"] as const).map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={mode === item}
              className={`h-11 border px-4 text-xs tracking-[0.16em] uppercase ${mode === item ? "border-paper bg-paper text-ink" : "border-line"}`}
              onClick={() => setMode(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div role="tablist" aria-label="Filter by brother" className="flex flex-wrap gap-2" onKeyDown={onTabKey}>
          {filters.map((item, index) => {
            const selectedTab = item.id === filter
            const color = item.id === "all" ? undefined : accents[item.id as BrotherId]
            return (
              <button
                key={item.id}
                ref={(node) => {
                  tabsRef.current[index] = node
                }}
                type="button"
                role="tab"
                aria-selected={selectedTab}
                tabIndex={selectedTab ? 0 : -1}
                className={`inline-flex h-11 items-center gap-2 border px-3 text-xs tracking-[0.16em] uppercase ${selectedTab ? "border-paper" : "border-line"}`}
                onClick={() => chooseFilter(item.id)}
              >
                {color ? <span className="size-2 rounded-full" style={{ background: color }} /> : null}
                {item.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="relative mt-4">
        {mode === "map" ? (
          <WorldMap ref={mapRef} places={visible} selectedId={selectedId} onSelect={setSelectedId} />
        ) : (
          <PlaceTable places={places} onOpen={openFromTable} />
        )}
        {mode === "map" && selected ? <PlaceSheet place={selected} places={visible} onClose={() => setSelectedId(null)} onSelect={stepTo} /> : null}
      </div>

      <section className="mt-10" aria-labelledby="what-to-eat">
        <h2 id="what-to-eat" className="font-serif text-3xl tracking-tight">
          What to eat
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">Dishes, not places. They stay off the map.</p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {cityTables.map((table) => (
            <li key={table.id} className="border border-line p-4">
              <p className="text-xs tracking-[0.16em] text-muted uppercase">
                {table.city}, {table.country}
              </p>
              {table.note ? <p className="mt-2 text-sm leading-relaxed">{table.note}</p> : null}
              <p className="mt-2 text-sm leading-relaxed">{table.dishes.join(". ")}.</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="next-up">
        <h2 id="next-up" className="font-serif text-3xl tracking-tight">
          Next up
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">Cities still on the list. The outline pins sit on the map.</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {wishlist.map((place) => (
            <li key={place.id}>
              <button type="button" className="h-11 border border-line px-3 text-sm" onClick={() => openFromTable(place)}>
                {place.name}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
