"use client"

import { useMemo, useState } from "react"
import { brotherLabel, emptyPlaceQuery, priceLabel, queryPlaces, sortPlaces, starLabel, uniqueValues, type PlaceQuery } from "@/lib/places"
import { brotherIds, type Place, type PlaceSortKey } from "@/lib/types"

const columns: { key: PlaceSortKey; label: string }[] = [
  { key: "name", label: "Place" },
  { key: "city", label: "City" },
  { key: "neighborhood", label: "Neighborhood" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  { key: "stars", label: "Stars" },
]

export function PlaceTable({ places, onOpen }: { places: readonly Place[]; onOpen: (place: Place) => void }) {
  const [query, setQuery] = useState<PlaceQuery>(emptyPlaceQuery)
  const [sortKey, setSortKey] = useState<PlaceSortKey>("city")
  const [direction, setDirection] = useState<"asc" | "desc">("asc")

  const cities = useMemo(() => uniqueValues(places, "city"), [places])
  const neighborhoods = useMemo(() => uniqueValues(places, "neighborhood"), [places])
  const categories = useMemo(() => uniqueValues(places, "category"), [places])
  const rows = useMemo(() => sortPlaces(queryPlaces(places, query), sortKey, direction), [places, query, sortKey, direction])

  function toggleSort(key: PlaceSortKey) {
    if (key === sortKey) {
      setDirection((current) => (current === "asc" ? "desc" : "asc"))
      return
    }
    setSortKey(key)
    setDirection("asc")
  }

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="block text-xs tracking-[0.14em] text-muted uppercase sm:col-span-2 lg:col-span-1">
          Search
          <input
            value={query.text}
            onChange={(event) => setQuery((current) => ({ ...current, text: event.target.value }))}
            className="mt-1 h-11 w-full border border-line bg-transparent px-3 text-sm tracking-normal text-paper normal-case"
            placeholder="Name, note, city"
          />
        </label>
        <Filter label="City" value={query.city} options={cities} onChange={(city) => setQuery((current) => ({ ...current, city }))} />
        <Filter
          label="Neighborhood"
          value={query.neighborhood}
          options={neighborhoods}
          onChange={(neighborhood) => setQuery((current) => ({ ...current, neighborhood }))}
        />
        <Filter label="Category" value={query.category} options={categories} onChange={(category) => setQuery((current) => ({ ...current, category }))} />
        <label className="block text-xs tracking-[0.14em] text-muted uppercase">
          Brother
          <select
            value={query.brother}
            onChange={(event) => setQuery((current) => ({ ...current, brother: event.target.value as PlaceQuery["brother"] }))}
            className="mt-1 h-11 w-full border border-line bg-ink px-3 text-sm tracking-normal text-paper normal-case"
          >
            <option value="all">All</option>
            {brotherIds.map((id) => (
              <option key={id} value={id}>
                {brotherLabel(id)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="mt-4 text-sm text-muted">
        {rows.length} {rows.length === 1 ? "place" : "places"}
      </p>
      <div className="mt-3 overflow-x-auto border border-line">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-[0.68rem] tracking-[0.14em] text-muted uppercase">
            <tr>
              {columns.map((column) => {
                const active = sortKey === column.key
                return (
                  <th key={column.key} scope="col" className="px-3 py-2 font-normal" aria-sort={active ? (direction === "asc" ? "ascending" : "descending") : "none"}>
                    <button type="button" className="inline-flex h-11 items-center gap-1" onClick={() => toggleSort(column.key)}>
                      {column.label}
                      <span aria-hidden="true">{active ? (direction === "asc" ? "↑" : "↓") : ""}</span>
                    </button>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((place) => (
              <tr
                key={place.id}
                tabIndex={0}
                className="cursor-pointer border-b border-line last:border-b-0 hover:bg-ink-2"
                onClick={() => onOpen(place)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    onOpen(place)
                  }
                }}
              >
                <th scope="row" className="px-3 py-3 text-left font-normal">
                  <span className="font-serif text-base">{place.name}</span>
                  {place.wishlist ? <span className="mt-1 block text-[0.68rem] tracking-[0.14em] text-muted uppercase">Next up</span> : null}
                </th>
                <td className="px-3 py-3">{place.city}</td>
                <td className="px-3 py-3 text-muted">{place.neighborhood ?? "—"}</td>
                <td className="px-3 py-3 capitalize">{place.category}</td>
                <td className="px-3 py-3">{priceLabel(place.price) || "—"}</td>
                <td className="px-3 py-3 tracking-widest">{starLabel(place.stars) || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Filter({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return (
    <label className="block text-xs tracking-[0.14em] text-muted uppercase">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 h-11 w-full border border-line bg-ink px-3 text-sm tracking-normal text-paper normal-case">
        <option value="all">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}
