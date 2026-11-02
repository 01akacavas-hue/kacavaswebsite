"use client"

import { useEffect, useState } from "react"
import { animate, motion, useMotionValue } from "framer-motion"
import { brotherLabel, googleMapsUrl, priceLabel, starLabel } from "@/lib/places"
import { placeStateLabel } from "@/lib/map-filters"
import { accents } from "@/lib/theme"
import type { Place } from "@/lib/types"

function CardBody({
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
  const cityPlaces = places
    .filter((item) => item.city === place.city)
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
  const index = cityPlaces.findIndex((item) => item.id === place.id)
  const previous = index > 0 ? cityPlaces[index - 1] : undefined
  const next = index >= 0 && index < cityPlaces.length - 1 ? cityPlaces[index + 1] : undefined
  const where = [place.neighborhood, place.city, place.country].filter(Boolean).join(" · ")
  const open = placeStateLabel(place) !== "Visited"

  return (
    <div className="flex h-full flex-col">
      <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-line md:hidden" />
      <div className="flex items-start justify-between gap-3 px-5 pt-4">
        <p className="text-[0.68rem] tracking-[0.16em] text-muted uppercase">{placeStateLabel(place)}</p>
        <button type="button" className="h-11 px-2 text-xs tracking-[0.14em] uppercase" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto px-5 pb-5">
        <h2 className="font-serif text-3xl tracking-tight">{place.name}</h2>
        <p className="mt-1 text-sm text-muted">{where}</p>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Brothers">
          {place.brothers.map((id) => (
            <li key={id} className="inline-flex h-8 items-center gap-2 border border-line px-2.5 text-xs tracking-[0.12em] uppercase">
              <span
                className="size-2.5 rounded-full"
                style={{
                  background: open ? "transparent" : accents[id],
                  boxShadow: `inset 0 0 0 1.5px ${accents[id]}`,
                }}
              />
              {brotherLabel(id)}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-xs tracking-[0.12em] uppercase">{place.category}</span>
          {place.price ? <span>{priceLabel(place.price)}</span> : null}
          {place.stars ? (
            <span aria-label={`${place.stars} stars`} className="tracking-widest">
              {starLabel(place.stars)}
            </span>
          ) : null}
          {place.grade ? <span>Grade {place.grade}</span> : null}
          {place.michelin ? <span>Michelin {"★".repeat(place.michelin)}</span> : null}
          {place.mustTry ? <span className="text-xs tracking-[0.12em] uppercase">Must try</span> : null}
          {place.approximate ? <span className="text-xs tracking-[0.12em] text-faint uppercase">Approximate pin</span> : null}
        </div>
        <p className="mt-4 leading-relaxed">{place.notes}</p>
        <a className="mt-4 inline-flex h-11 items-center text-sm underline decoration-line underline-offset-4" href={googleMapsUrl(place)} target="_blank" rel="noreferrer">
          Open in Maps
        </a>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
          <button type="button" className="h-11 px-2 text-xs tracking-[0.14em] uppercase disabled:opacity-30" disabled={!previous} onClick={() => previous && onSelect(previous.id)}>
            Previous
          </button>
          <p className="text-xs text-muted">
            {Math.max(index, 0) + 1} of {cityPlaces.length} in {place.city}
          </p>
          <button type="button" className="h-11 px-2 text-xs tracking-[0.14em] uppercase disabled:opacity-30" disabled={!next} onClick={() => next && onSelect(next.id)}>
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export function PlaceCard({
  place,
  places,
  reducedMotion,
  onClose,
  onSelect,
}: {
  place: Place
  places: readonly Place[]
  reducedMotion: boolean
  onClose: () => void
  onSelect: (id: string) => void
}) {
  return (
    <>
      <aside role="dialog" aria-label={place.name} className="absolute top-3 right-3 bottom-3 z-20 hidden w-[22.5rem] overflow-hidden border border-line bg-ink shadow-[0_16px_40px_rgb(26_23_20_/_0.12)] md:block">
        <CardBody place={place} places={places} onClose={onClose} onSelect={onSelect} />
      </aside>
      <MobileSheet place={place} places={places} reducedMotion={reducedMotion} onClose={onClose} onSelect={onSelect} />
    </>
  )
}

function MobileSheet({
  place,
  places,
  reducedMotion,
  onClose,
  onSelect,
}: {
  place: Place
  places: readonly Place[]
  reducedMotion: boolean
  onClose: () => void
  onSelect: (id: string) => void
}) {
  const y = useMotionValue(0)
  const [span, setSpan] = useState({ sheet: 640, half: 280, peek: 500 })

  useEffect(() => {
    const measure = () => {
      const viewport = window.innerHeight
      const sheet = Math.round(viewport * 0.88)
      setSpan({
        sheet,
        half: Math.max(0, sheet - Math.round(viewport * 0.46)),
        peek: Math.max(0, sheet - 132),
      })
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  useEffect(() => {
    y.set(span.half)
  }, [place.id, span.half, y])

  return (
    <motion.aside
      role="dialog"
      aria-label={place.name}
      className="fixed inset-x-0 bottom-0 z-30 overflow-hidden border-t border-line bg-ink shadow-[0_-12px_40px_rgb(26_23_20_/_0.12)] md:hidden"
      style={{ height: span.sheet, y }}
      drag="y"
      dragConstraints={{ top: 0, bottom: span.peek }}
      dragElastic={0.06}
      onDragEnd={(_, info) => {
        const projected = y.get() + info.velocity.y * 0.18
        const snaps = [0, span.half, span.peek]
        const nearest = snaps.reduce((best, snap) => (Math.abs(snap - projected) < Math.abs(best - projected) ? snap : best))
        if (reducedMotion) y.set(nearest)
        else void animate(y, nearest, { type: "spring", stiffness: 420, damping: 42 })
      }}
    >
      <CardBody place={place} places={places} onClose={onClose} onSelect={onSelect} />
    </motion.aside>
  )
}
