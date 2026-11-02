"use client"

import { brotherLabel, brothersInOrder, sortPlaces } from "@/lib/places"
import { placeStateLabel } from "@/lib/map-filters"
import { accents } from "@/lib/theme"
import type { Place } from "@/lib/types"

export function PlaceList({
  places,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
}: {
  places: readonly Place[]
  selectedId: string | null
  hoveredId: string | null
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}) {
  const rows = sortPlaces([...places], "city", "asc")

  return (
    <div className="border border-line lg:max-h-[70vh] lg:overflow-auto">
      <p className="border-b border-line px-3 py-3 text-sm text-muted">
        {rows.length} {rows.length === 1 ? "place" : "places"}
      </p>
      <ul>
        {rows.map((place) => {
          const active = place.id === selectedId || place.id === hoveredId
          return (
            <li key={place.id} className="border-b border-line last:border-b-0">
              <button
                type="button"
                className={`flex min-h-11 w-full items-start gap-3 px-3 py-3 text-left ${active ? "bg-paper text-ink" : ""}`}
                onClick={() => onSelect(place.id)}
                onMouseEnter={() => onHover(place.id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(place.id)}
                onBlur={() => onHover(null)}
              >
                <span className="mt-1 flex shrink-0">
                  {brothersInOrder(place.brothers).map((id, index) => (
                    <span
                      key={id}
                      className="size-2.5 rounded-full border"
                      style={{
                        background: placeStateLabel(place) === "Visited" ? accents[id] : "transparent",
                        borderColor: accents[id],
                        marginLeft: index === 0 ? 0 : -4,
                      }}
                    />
                  ))}
                </span>
                <span>
                  <span className="block font-serif text-lg leading-tight">{place.name}</span>
                  <span className={`mt-1 block text-xs tracking-[0.08em] uppercase ${active ? "text-ink/70" : "text-muted"}`}>
                    {place.city} · {placeStateLabel(place)} · {brothersInOrder(place.brothers).map((id) => brotherLabel(id)).join(", ")}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
