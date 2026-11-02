"use client"

import { brotherLabel, googleMapsUrl, placesInCity, priceLabel, starLabel } from "@/lib/places"
import { accents } from "@/lib/theme"
import type { Place } from "@/lib/types"

export function PlaceSheet({
  place,
  places,
  onClose,
  onSelect,
}: {
  place: Place
  places: readonly Place[]
  onClose: () => void
  onSelect: (id: string) => void
}) {
  const cityPlaces = placesInCity(places, place)
  const index = cityPlaces.findIndex((item) => item.id === place.id)
  const previous = index > 0 ? cityPlaces[index - 1] : undefined
  const next = index >= 0 && index < cityPlaces.length - 1 ? cityPlaces[index + 1] : undefined
  const where = [place.neighborhood, place.city, place.country].filter(Boolean).join(" · ")

  return (
    <aside
      role="dialog"
      aria-label={place.name}
      className="fixed inset-x-0 bottom-0 z-30 max-h-[72vh] overflow-auto border-t border-line bg-ink px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[0_-12px_40px_rgb(26_23_20_/_0.12)] sm:absolute sm:inset-y-3 sm:right-3 sm:left-auto sm:w-[22.5rem] sm:max-h-none sm:border sm:pb-5"
    >
      <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line sm:hidden" />
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.68rem] tracking-[0.16em] text-muted uppercase">
          {place.wishlist ? "Next up" : place.recommended ? "Recommendation" : place.category}
        </p>
        <button type="button" className="h-11 px-2 text-xs tracking-[0.14em] uppercase" onClick={onClose}>
          Close
        </button>
      </div>
      <h2 className="font-serif text-3xl tracking-tight">{place.name}</h2>
      <p className="mt-1 text-sm text-muted">{where}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        {place.price ? <span>{priceLabel(place.price)}</span> : null}
        {place.stars ? (
          <span aria-label={`${place.stars} stars`} className="tracking-widest">
            {starLabel(place.stars)}
          </span>
        ) : null}
        {place.grade ? <span>{place.grade}</span> : null}
        {place.michelin ? (
          <span>{place.michelin === 1 ? "Michelin star" : `${place.michelin} Michelin stars`}</span>
        ) : null}
        {place.mustTry ? <span className="text-xs tracking-[0.12em] uppercase">Must try</span> : null}
        {place.recommended ? <span className="text-xs tracking-[0.12em] text-faint uppercase">Not tried yet</span> : null}
        {place.approximate ? <span className="text-xs tracking-[0.12em] text-faint uppercase">Approximate pin</span> : null}
      </div>
      <p className="mt-4 leading-relaxed">{place.notes}</p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label={place.recommended ? "Who recommends it" : "Who has been"}>
        {place.brothers.map((id) => (
          <li key={id} className="inline-flex h-8 items-center gap-2 border border-line px-2.5 text-xs tracking-[0.12em] uppercase">
            <span className="size-2 rounded-full" style={{ background: place.wishlist ? "transparent" : accents[id], boxShadow: place.wishlist ? `inset 0 0 0 1.5px ${accents[id]}` : undefined }} />
            {brotherLabel(id)}
          </li>
        ))}
      </ul>
      <a className="mt-4 inline-flex h-11 items-center text-sm underline decoration-line underline-offset-4" href={googleMapsUrl(place)} target="_blank" rel="noreferrer">
        Open in Google Maps
      </a>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
        <button type="button" className="h-11 px-2 text-xs tracking-[0.14em] uppercase disabled:opacity-30" disabled={!previous} onClick={() => previous && onSelect(previous.id)}>
          Previous
        </button>
        <p className="text-xs text-muted">
          {index + 1} of {cityPlaces.length} in {place.city}
        </p>
        <button type="button" className="h-11 px-2 text-xs tracking-[0.14em] uppercase disabled:opacity-30" disabled={!next} onClick={() => next && onSelect(next.id)}>
          Next
        </button>
      </div>
    </aside>
  )
}
