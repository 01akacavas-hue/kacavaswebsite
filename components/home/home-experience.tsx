"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useRef, useState } from "react"
import { brothers } from "@/data/brothers"
import { BrotherCards } from "@/components/home/brother-cards"
import { WebGLBoundary } from "@/components/home/webgl-boundary"
import type { CubeHandle } from "@/hooks/use-cube-input"
import type { TurnDirection } from "@/lib/cube"

const BrotherCube = dynamic(
  () => import("@/components/home/brother-cube").then((module) => module.BrotherCube),
  { ssr: false },
)

type Mode = "boot" | "cube" | "snap" | "stage"

export function HomeExperience() {
  const [mode, setMode] = useState<Mode>("boot")
  const [index, setIndex] = useState(0)
  const apiRef = useRef<CubeHandle | null>(null)
  const brother = brothers[index] ?? brothers[0]

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 900px)")
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    const decide = () => {
      let webgl = false
      try {
        const canvas = document.createElement("canvas")
        webgl = Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      } catch {
        webgl = false
      }
      if (narrow.matches) setMode("snap")
      else if (reduce.matches || !webgl) setMode("stage")
      else setMode("cube")
    }
    decide()
    narrow.addEventListener("change", decide)
    reduce.addEventListener("change", decide)
    return () => {
      narrow.removeEventListener("change", decide)
      reduce.removeEventListener("change", decide)
    }
  }, [])

  const select = useCallback(
    (next: number) => {
      const wrapped = (next + brothers.length) % brothers.length
      if (mode === "cube") {
        apiRef.current?.goTo(wrapped)
        return
      }
      setIndex(wrapped)
    },
    [mode],
  )

  const step = useCallback(
    (direction: TurnDirection) => {
      if (mode === "cube") {
        apiRef.current?.go(direction)
        return
      }
      setIndex((current) => (current + direction + brothers.length) % brothers.length)
    },
    [mode],
  )

  return (
    <section
      className="home-stage flex h-dvh flex-col overflow-hidden"
      data-brother={brother.id}
      aria-labelledby="home-title"
      aria-describedby="cube-help"
    >
      <header className="z-30 grid grid-cols-[1fr_auto_1fr] items-center px-5 pt-5 sm:px-8">
        <span />
        <h1 id="home-title" className="font-serif text-sm tracking-[0.42em]">
          KACAVAS
        </h1>
        <p className="justify-self-end font-mono text-xs text-muted">
          0{brother.index + 1}
          <span className="text-faint"> / 03</span>
        </p>
      </header>
      <p className="sr-only" aria-live="polite">
        {brother.name}, {brother.epithet}
      </p>

      <div className="relative min-h-0 flex-1">
        {mode === "boot" ? (
          <p className="grid h-full place-items-center font-serif text-2xl tracking-[0.28em]">KACAVAS</p>
        ) : null}
        {mode === "cube" ? (
          <WebGLBoundary fallback={<BrotherCards index={index} presentation="stage" onIndex={setIndex} />}>
            <BrotherCube apiRef={apiRef} brother={brother} onIndex={setIndex} />
          </WebGLBoundary>
        ) : null}
        {mode === "snap" || mode === "stage" ? (
          <BrotherCards index={index} presentation={mode} onIndex={setIndex} />
        ) : null}
      </div>

      <div className="z-30 flex flex-col items-center gap-3 px-4 pt-2 pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="grid size-11 place-items-center border border-line text-lg"
            aria-label="Previous brother"
            onClick={() => step(-1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          {brothers.map((item) => {
            const selected = item.index === brother.index
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                className="min-h-11 px-3 text-xs tracking-[0.16em] uppercase"
                style={{ color: selected ? item.accent : undefined }}
                onClick={() => select(item.index)}
              >
                {item.shortName}
              </button>
            )
          })}
          <button
            type="button"
            className="grid size-11 place-items-center border border-line text-lg"
            aria-label="Next brother"
            onClick={() => step(1)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
        <p id="cube-help" className="text-center text-[0.7rem] tracking-[0.16em] text-muted uppercase">
          {mode === "snap" ? "Swipe, or use the arrow keys" : "Scroll, drag, swipe, or the arrow keys"}
        </p>
      </div>
    </section>
  )
}
