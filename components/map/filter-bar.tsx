"use client"

import type { KeyboardEvent, ReactNode } from "react"
import { brotherCount, type CityOption, type MapFilters, type VisitState } from "@/lib/map-filters"
import { brotherLabel } from "@/lib/places"
import { citiesForBrother } from "@/lib/trails"
import { accents } from "@/lib/theme"
import { brotherIds, type BrotherId, type Place, type PlaceCategory } from "@/lib/types"

function Chip({
  pressed,
  onClick,
  children,
  label,
}: {
  pressed: boolean
  onClick: () => void
  children: ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={label}
      onClick={onClick}
      className={`inline-flex h-11 shrink-0 items-center gap-2 border px-3 text-xs tracking-[0.14em] uppercase ${pressed ? "border-paper bg-paper text-ink" : "border-line bg-transparent"}`}
    >
      {children}
    </button>
  )
}

export function FilterBar({
  places,
  filters,
  categories,
  cities,
  playing,
  onChange,
  onCity,
  onPlay,
}: {
  places: readonly Place[]
  filters: MapFilters
  categories: readonly PlaceCategory[]
  cities: readonly CityOption[]
  playing: boolean
  onChange: (patch: Partial<MapFilters>) => void
  onCity: (city: string) => void
  onPlay: () => void
}) {
  const rail = cities.slice(0, 18)
  const tourStops = filters.trails.reduce((sum, id) => sum + citiesForBrother(places, id).length, 0)

  function toggleBrother(id: BrotherId) {
    const next = filters.brothers.includes(id) ? filters.brothers.filter((item) => item !== id) : [...filters.brothers, id]
    onChange({ brothers: next })
  }

  function toggleVisit(visit: VisitState) {
    const next = filters.visits.includes(visit) ? filters.visits.filter((item) => item !== visit) : [...filters.visits, visit]
    onChange({ visits: next })
  }

  function toggleCategory(category: PlaceCategory) {
    const current = filters.categories ?? [...categories]
    const next = current.includes(category) ? current.filter((item) => item !== category) : [...current, category]
    const every = categories.every((item) => next.includes(item))
    onChange({ categories: every ? null : next })
  }

  function toggleTrail(id: BrotherId) {
    const next = filters.trails.includes(id) ? filters.trails.filter((item) => item !== id) : [...filters.trails, id]
    onChange({ trails: next })
  }

  function onSearchKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return
    const match = rail[0]
    if (!match) return
    event.preventDefault()
    onCity(match.city)
  }

  return (
    <div className="mt-8">
      <p className="text-sm text-muted">Filled is a visit. A ring is a recommendation. A second ring means another brother.</p>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Brothers">
        {brotherIds.map((id) => {
          const pressed = filters.brothers.includes(id)
          const count = brotherCount(places, filters, id)
          return (
            <Chip key={id} pressed={pressed} label={`${brotherLabel(id)}, ${count} places`} onClick={() => toggleBrother(id)}>
              <span className="size-2.5 rounded-full" style={{ background: accents[id] }} />
              {brotherLabel(id)}
              <span className="font-mono tracking-normal">{count}</span>
            </Chip>
          )
        })}
      </div>

      <div className="mt-2 flex gap-2 overflow-x-auto pb-1" aria-label="Visited or recommended">
        <Chip pressed={filters.visits.includes("visited")} label="Visited" onClick={() => toggleVisit("visited")}>
          Visited
        </Chip>
        <Chip pressed={filters.visits.includes("recommended")} label="Recommended" onClick={() => toggleVisit("recommended")}>
          Recommended
        </Chip>
      </div>

      <div className="mt-2 flex gap-2 overflow-x-auto pb-1" aria-label="Place types">
        {categories.map((category) => {
          const pressed = filters.categories === null || filters.categories.includes(category)
          return (
            <Chip key={category} pressed={pressed} label={category} onClick={() => toggleCategory(category)}>
              {category}
            </Chip>
          )
        })}
      </div>

      <label className="mt-4 block text-xs tracking-[0.14em] text-muted uppercase">
        Search cities and places
        <input
          value={filters.query}
          onChange={(event) => onChange({ query: event.target.value })}
          onKeyDown={onSearchKey}
          placeholder="Boston, Charleston, a room"
          className="mt-1 h-11 w-full border border-line bg-transparent px-3 text-sm tracking-normal text-paper normal-case"
        />
      </label>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Cities">
        <Chip pressed={filters.city === ""} label="All cities" onClick={() => onCity("")}>
          All cities
        </Chip>
        {rail.map((option) => (
          <Chip key={option.city} pressed={filters.city === option.city} label={`${option.city}, ${option.count} places`} onClick={() => onCity(option.city)}>
            {option.city}
            <span className="font-mono tracking-normal">{option.count}</span>
          </Chip>
        ))}
      </div>

      <div className="mt-4 border border-line p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-xl text-sm text-muted">
            Trails join each brother&apos;s cities from west to east. The guide has no dates, so this is a reading order, not the trip.
          </p>
          <button
            type="button"
            className="h-11 shrink-0 border border-paper px-4 text-xs tracking-[0.16em] uppercase disabled:opacity-40"
            disabled={filters.trails.length === 0 || tourStops === 0}
            onClick={onPlay}
          >
            {playing ? "Playing" : "Play"}
          </button>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto" aria-label="Brother trails">
          {brotherIds.map((id) => (
            <Chip key={id} pressed={filters.trails.includes(id)} label={`${brotherLabel(id)} trail`} onClick={() => toggleTrail(id)}>
              <span className="size-2.5 rounded-full" style={{ background: accents[id] }} />
              {brotherLabel(id)} trail
            </Chip>
          ))}
        </div>
      </div>
    </div>
  )
}
