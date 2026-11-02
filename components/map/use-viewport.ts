"use client"

import { useEffect, useState } from "react"

function useMedia(query: string) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const media = window.matchMedia(query)
    const sync = () => setMatches(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [query])
  return matches
}

export function usePrefersReducedMotion() {
  return useMedia("(prefers-reduced-motion: reduce)")
}

export function usePhone() {
  return useMedia("(max-width: 767px)")
}

export function useWideScreen() {
  return useMedia("(min-width: 1024px)")
}

export function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas")
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"))
  } catch {
    return false
  }
}
