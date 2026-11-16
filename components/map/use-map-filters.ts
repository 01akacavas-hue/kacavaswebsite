"use client"

import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { parseMapFilters, serializeMapFilters, type MapFilters } from "@/lib/map-filters"

const QUERY_DELAY_MS = 250

/**
 * Filters update on screen immediately. The address bar follows.
 * A search used to write the URL on every key, from the last URL value.
 * Fast typing then kept only the last letter.
 */
export function useMapFilters(placeIds: ReadonlySet<string>) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const parsed = useMemo(() => parseMapFilters(params, placeIds), [params, placeIds])
  const [filters, setFilters] = useState(parsed)
  const filtersRef = useRef(filters)
  const written = useRef(serializeMapFilters(parsed))
  const timer = useRef<number | null>(null)
  const fromHistory = useRef(false)

  useEffect(() => {
    filtersRef.current = filters
  }, [filters])

  useEffect(() => {
    const onPop = () => {
      fromHistory.current = true
    }
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  useEffect(() => {
    if (!fromHistory.current) return
    fromHistory.current = false
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
    written.current = serializeMapFilters(parsed)
    filtersRef.current = parsed
    setFilters(parsed)
  }, [parsed])

  const write = useCallback(
    (next: MapFilters) => {
      const query = serializeMapFilters(next)
      written.current = query
      const href = query ? `${pathname}?${query}` : pathname
      startTransition(() => {
        router.replace(href, { scroll: false })
      })
    },
    [pathname, router],
  )

  const commit = useCallback(
    (next: MapFilters, delay: number) => {
      filtersRef.current = next
      setFilters(next)
      if (timer.current !== null) window.clearTimeout(timer.current)
      if (delay === 0) {
        timer.current = null
        write(next)
        return
      }
      timer.current = window.setTimeout(() => {
        timer.current = null
        write(filtersRef.current)
      }, delay)
    },
    [write],
  )

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    }
  }, [])

  const update = useCallback(
    (patch: Partial<MapFilters>) => {
      const next = { ...filtersRef.current, ...patch }
      const queryOnly = Object.keys(patch).every((key) => key === "query")
      commit(next, queryOnly ? QUERY_DELAY_MS : 0)
    },
    [commit],
  )

  return { filters, update }
}
