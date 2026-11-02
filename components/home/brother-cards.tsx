"use client"

import { useEffect, useRef } from "react"
import { brothers } from "@/data/brothers"
import { BrotherPanel } from "@/components/home/brother-panel"

export function BrotherCards({
  index,
  presentation,
  onIndex,
}: {
  index: number
  presentation: "snap" | "stage"
  onIndex: (index: number) => void
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const onIndexRef = useRef(onIndex)

  useEffect(() => {
    onIndexRef.current = onIndex
  }, [onIndex])

  useEffect(() => {
    if (presentation !== "snap") return
    const scroller = scrollerRef.current
    if (!scroller) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        const value = visible?.target.getAttribute("data-index")
        if (value) onIndexRef.current(Number(value))
      },
      { root: scroller, threshold: [0.6] },
    )
    for (const child of scroller.querySelectorAll("[data-index]")) observer.observe(child)
    return () => observer.disconnect()
  }, [presentation])

  useEffect(() => {
    if (presentation !== "snap") return
    const scroller = scrollerRef.current
    const card = document.getElementById(`brother-card-${index}`)
    if (!scroller || !card) return
    if (Math.abs(scroller.scrollLeft - card.offsetLeft) < 8) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    card.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      inline: "start",
      block: "nearest",
    })
  }, [index, presentation])

  if (presentation === "stage") {
    const brother = brothers[index] ?? brothers[0]
    return (
      <div className="flex h-full items-center justify-center px-6">
        <BrotherPanel brother={brother} variant="card" />
      </div>
    )
  }

  return (
    <div
      ref={scrollerRef}
      className="flex h-full snap-x snap-mandatory overflow-x-auto"
      aria-label="Brothers"
    >
      {brothers.map((brother) => (
        <div
          key={brother.id}
          id={`brother-card-${brother.index}`}
          data-index={brother.index}
          className="flex h-full min-w-full snap-start items-center justify-center px-5"
        >
          <BrotherPanel brother={brother} variant="card" />
        </div>
      ))}
    </div>
  )
}
