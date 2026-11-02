"use client"

import { useCallback, useEffect, useMemo, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { parseMapFilters, serializeMapFilters, type MapFilters } from "@/lib/map-filters"

export function useMapFilters(placeIds: ReadonlySet<string>) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const filters = useMemo(() => parseMapFilters(params, placeIds), [params, placeIds])
  const filtersRef = useRef(filters)
  useEffect(() => {
    filtersRef.current = filters
  }, [filters])

  const commit = useCallback(
    (next: MapFilters) => {
      const query = serializeMapFilters(next)
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    },
    [pathname, router],
  )

  const update = useCallback(
    (patch: Partial<MapFilters>) => {
      commit({ ...filtersRef.current, ...patch })
    },
    [commit],
  )

  return { filters, update }
}
