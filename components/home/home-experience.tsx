"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { ViewTransition } from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { brothers } from "@/data/brothers"
import { portraits } from "@/data/images"
import { BrotherCards } from "@/components/home/brother-cards"
import { WebGLBoundary } from "@/components/home/webgl-boundary"

const ScrollScene = dynamic(
  () => import("@/components/home/scroll-scene").then((module) => module.ScrollScene),
  { ssr: false },
)

type Mode = "boot" | "scroll" | "still"

export function HomeExperience() {
  const sectionRef = useRef<HTMLElement>(null)
  const progressRef = useRef(0)
  const parallaxRef = useRef({ x: 0, y: 0 })
  const [mode, setMode] = useState<Mode>("boot")
  const [sceneOn, setSceneOn] = useState(false)
  const [index, setIndex] = useState(0)
  const brother = brothers[index] ?? brothers[0]
  const portrait = portraits[brother.id]

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    const decide = () => {
      let webgl = false
      try {
        const canvas = document.createElement("canvas")
        webgl = Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      } catch {
        webgl = false
      }
      setMode(reduce.matches || !webgl ? "still" : "scroll")
    }
    decide()
    reduce.addEventListener("change", decide)
    return () => reduce.removeEventListener("change", decide)
  }, [])

  useEffect(() => {
    if (mode !== "scroll" || sceneOn) return
    const start = () => {
      if (window.scrollY < 24) return
      setSceneOn(true)
    }
    window.addEventListener("scroll", start, { passive: true })
    return () => window.removeEventListener("scroll", start)
  }, [mode, sceneOn])

  useEffect(() => {
    if (mode !== "scroll") return
    const onScroll = () => {
      const section = sectionRef.current
      if (!section) return
      const total = section.offsetHeight - window.innerHeight
      const start = section.getBoundingClientRect().top + window.scrollY
      const traveled = Math.min(Math.max(window.scrollY - start, 0), Math.max(total, 0))
      progressRef.current = total > 0 ? traveled / total : 0
      const next = Math.round(progressRef.current * (brothers.length - 1))
      setIndex((current) => (current === next ? current : next))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [mode])

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const width = window.innerWidth || 1
      const height = window.innerHeight || 1
      parallaxRef.current.x = event.clientX / width * 2 - 1
      parallaxRef.current.y = event.clientY / height * 2 - 1
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [])

  const goTo = useCallback(
    (next: number) => {
      const wrapped = (next + brothers.length) % brothers.length
      if (mode !== "scroll") {
        setIndex(wrapped)
        return
      }
      const section = sectionRef.current
      if (!section) {
        setIndex(wrapped)
        return
      }
      const total = section.offsetHeight - window.innerHeight
      const start = section.getBoundingClientRect().top + window.scrollY
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      window.scrollTo({
        top: start + (wrapped / (brothers.length - 1)) * total,
        behavior: reduce ? "auto" : "smooth",
      })
    },
    [mode],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat) return
      if (document.querySelector("[role='dialog']")) return
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return
      }
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault()
        goTo(index + 1)
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault()
        goTo(index - 1)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [goTo, index])

  const frame = (
    <div className="sticky top-0 z-0 flex h-dvh flex-col px-5 pt-20 pb-4 sm:px-8">
      <header className="pointer-events-none grid grid-cols-[1fr_auto_1fr] items-center">
        <span />
        <h1 id="home-title" className="font-serif text-sm tracking-[0.42em]">
          KACAVAS
        </h1>
        <p className="justify-self-end font-mono text-xs text-muted">
          0{brother.index + 1}
          <span> / 03</span>
        </p>
      </header>
      <p className="sr-only" aria-live="polite">
        {brother.name}, {brother.epithet}
      </p>
      <div className="mx-auto grid min-h-0 w-full max-w-6xl flex-1 items-center gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-12">
        <div className="order-2 max-w-xl md:order-1">
          <p className="text-xs tracking-[0.22em] uppercase" style={{ color: brother.accent }}>
            {brother.epithet}
          </p>
          <h2 className="mt-2 font-serif text-5xl leading-none tracking-tight md:text-7xl">{brother.shortName}</h2>
          <p className="mt-3 line-clamp-3 max-w-md text-base leading-relaxed text-muted md:mt-4 md:line-clamp-none md:text-lg">
            {brother.bio}
          </p>
          <dl className="mt-4 hidden gap-4 text-sm md:mt-6 md:grid">
            <div>
              <dt className="text-[0.68rem] tracking-[0.16em] text-muted uppercase">Career</dt>
              <dd className="mt-1">{brother.career}</dd>
            </div>
            <div>
              <dt className="text-[0.68rem] tracking-[0.16em] text-muted uppercase">{brother.asideLabel}</dt>
              <dd className="mt-1">{brother.sports}</dd>
            </div>
          </dl>
          <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {brother.socials.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-ink/30 underline-offset-4"
              >
                {social.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
            <Link href={brother.href} className="tracking-[0.14em] uppercase" style={{ color: brother.accent }}>
              Enter
            </Link>
          </p>
        </div>
        <div className="relative order-1 h-[34vh] min-h-48 md:order-2 md:h-full">
          <ViewTransition name={`portrait-${brother.id}`}>
            <div className={`absolute inset-0 ${sceneOn ? "pointer-events-none opacity-0" : ""}`} aria-hidden={sceneOn || undefined}>
              <Image
                src={portrait.src}
                alt={sceneOn ? "" : portrait.alt}
                fill
                priority={brother.index === 0}
                fetchPriority={brother.index === 0 ? "high" : "auto"}
                quality={65}
                sizes="(max-width: 768px) 80vw, 42vw"
                className="object-cover"
              />
            </div>
          </ViewTransition>
          {sceneOn ? (
            <div className="absolute inset-0" role="img" aria-label={portrait.alt}>
              <WebGLBoundary fallback={null}>
                <ScrollScene progressRef={progressRef} parallaxRef={parallaxRef} />
              </WebGLBoundary>
            </div>
          ) : null}
        </div>
      </div>
      <div className="relative z-40 mx-auto flex w-full max-w-6xl flex-col items-center gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="grid size-11 place-items-center border border-line text-lg"
            aria-label="Previous brother"
            onClick={() => goTo(index - 1)}
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
                onClick={() => goTo(item.index)}
              >
                {item.shortName}
              </button>
            )
          })}
          <button
            type="button"
            className="grid size-11 place-items-center border border-line text-lg"
            aria-label="Next brother"
            onClick={() => goTo(index + 1)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
        <p id="cube-help" className="text-center text-[0.7rem] tracking-[0.16em] text-muted uppercase">
          {mode === "scroll" ? "Scroll, or use the arrow keys" : "Use the arrow keys"}
        </p>
      </div>
    </div>
  )

  if (mode === "still") {
    return (
      <section
        className="home-stage"
        data-brother={brother.id}
        aria-labelledby="home-title"
        aria-describedby="cube-help"
      >
        <div className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-5 py-24">
          <h1 id="home-title" className="mb-8 text-center font-serif text-sm tracking-[0.42em]">
            KACAVAS
          </h1>
          <BrotherCards index={index} presentation="stage" onIndex={setIndex} />
          <div className="mt-6 flex items-center justify-center gap-2">
            <button type="button" className="grid size-11 place-items-center border border-line" aria-label="Previous brother" onClick={() => goTo(index - 1)}>
              ←
            </button>
            {brothers.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={item.index === index}
                className="min-h-11 px-3 text-xs tracking-[0.16em] uppercase"
                style={{ color: item.index === index ? item.accent : undefined }}
                onClick={() => goTo(item.index)}
              >
                {item.shortName}
              </button>
            ))}
            <button type="button" className="grid size-11 place-items-center border border-line" aria-label="Next brother" onClick={() => goTo(index + 1)}>
              →
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className="home-stage relative h-[320vh]"
      data-brother={brother.id}
      aria-labelledby="home-title"
      aria-describedby="cube-help"
    >
      {frame}
    </section>
  )
}
