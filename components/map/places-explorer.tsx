"use client"

import { useRef, useState, type KeyboardEvent } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { brothers } from "@/data/brothers"
import { WorldMap } from "@/components/map/world-map"
import { filterPlaces } from "@/lib/places"
import { accents } from "@/lib/theme"
import type { BrotherId, Place, PlaceFilter } from "@/lib/types"

const filters = [
  { id: "all", label: "All" },
  { id: "alec", label: "Alec" },
  { id: "eli", label: "Eli" },
  { id: "niko", label: "Niko" },
] as const satisfies readonly { id: PlaceFilter; label: string }[]

export function PlacesExplorer({ places }: { places: readonly Place[] }) {
  const [filter, setFilter] = useState<PlaceFilter>("all")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([])
  const router = useRouter()
  const reduce = useReducedMotion()
  const visible = filterPlaces(places, filter)
  const selected = visible.find((place) => place.id === selectedId) ?? null

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
      <p className="mt-5 max-w-2xl text-muted">Tables, towns, and rooms the brothers have been.</p>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label="Filter by brother" className="flex flex-wrap gap-2" onKeyDown={onTabKey}>
          {filters.map((item, index) => {
            const selectedTab = item.id === filter
            return (
              <button
                key={item.id}
                ref={(node) => {
                  tabsRef.current[index] = node
                }}
                id={`places-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={selectedTab}
                aria-controls="places-panel"
                tabIndex={selectedTab ? 0 : -1}
                className={`h-11 border px-4 text-xs tracking-[0.16em] uppercase ${selectedTab ? "border-paper text-paper" : "border-line text-muted"}`}
                onClick={() => chooseFilter(item.id)}
              >
                {item.label}
              </button>
            )
          })}
        </div>
        <ul className="flex flex-wrap gap-4 text-sm" aria-label="Legend">
          {(["alec", "eli", "niko"] as const).map((id) => (
            <li key={id} className="flex items-center gap-2">
              <span className="inline-block size-2.5 rounded-full" style={{ background: accents[id] }} aria-hidden="true" />
              {brothers.find((brother) => brother.id === id)?.shortName}
            </li>
          ))}
        </ul>
      </div>

      <div
        id="places-panel"
        role="tabpanel"
        aria-labelledby={`places-tab-${filter}`}
        className="mt-5"
      >
        <WorldMap places={visible} selectedId={selected?.id ?? null} onSelect={setSelectedId} />
        <PlaceDetail
          place={selected}
          empty={visible.length === 0}
          reduce={Boolean(reduce)}
          onClear={() => setSelectedId(null)}
        />
        <PlaceList places={visible} selectedId={selected?.id ?? null} onSelect={setSelectedId} />
      </div>
    </div>
  )
}

function PlaceDetail({
  place,
  empty,
  reduce,
  onClear,
}: {
  place: Place | null
  empty: boolean
  reduce: boolean
  onClear: () => void
}) {
  return (
    <div aria-live="polite" className="mt-4 min-h-28">
      <AnimatePresence mode="wait">
        {place ? (
          <motion.article
            key={place.id}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 4 }}
            transition={{ duration: 0.25 }}
            className="border border-line p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[0.68rem] tracking-[0.16em] text-muted uppercase">
                  {place.type === "restaurant" ? "Restaurant" : "Place"}
                </p>
                <h2 className="mt-1 font-serif text-3xl">{place.name}</h2>
                <p className="mt-1 text-muted">
                  {place.city}, {place.country}
                </p>
              </div>
              <button type="button" className="h-10 px-2 text-xs tracking-[0.14em] text-muted uppercase" onClick={onClear}>
                Close
              </button>
            </div>
            <p className="mt-4 max-w-2xl leading-relaxed">{place.notes}</p>
            <p className="mt-4 text-sm">
              <span className="text-muted">Who went </span>
              {place.brothers.map((id, index) => (
                <span key={id}>
                  {index === 0 ? "" : index === place.brothers.length - 1 ? ", and " : ", "}
                  <span style={{ color: accents[id] }}>{nameFor(id)}</span>
                </span>
              ))}
            </p>
          </motion.article>
        ) : (
          <p className="text-sm text-muted">
            {empty ? "Nothing pinned yet." : "Select a pin, or a name in the list."}
          </p>
        )}
      </AnimatePresence>
    </div>
  )
}

function PlaceList({
  places,
  selectedId,
  onSelect,
}: {
  places: readonly Place[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  if (places.length === 0) {
    return <p className="mt-8 text-muted">Nothing pinned yet.</p>
  }
  return (
    <ul className="mt-6 divide-y divide-line border-y border-line">
      {places.map((place) => {
        const selected = place.id === selectedId
        return (
          <li key={place.id}>
            <button
              type="button"
              aria-pressed={selected}
              className="flex w-full flex-wrap items-baseline justify-between gap-3 py-4 text-left"
              onClick={() => onSelect(place.id)}
            >
              <span>
                <span className="block font-serif text-2xl">{place.name}</span>
                <span className="mt-1 block text-sm text-muted">
                  {place.city}, {place.country}
                  <span className="px-2 text-faint">·</span>
                  {place.type === "restaurant" ? "Restaurant" : "Place"}
                </span>
              </span>
              <span className="flex gap-2" aria-hidden="true">
                {place.brothers.map((id) => (
                  <span key={id} className="size-2.5 rounded-full" style={{ background: accents[id] }} />
                ))}
              </span>
              <span className="sr-only">{place.brothers.map((id) => nameFor(id)).join(", ")}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function nameFor(id: BrotherId): string {
  return brothers.find((brother) => brother.id === id)?.shortName ?? id
}
