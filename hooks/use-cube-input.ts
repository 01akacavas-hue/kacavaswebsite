"use client"

import { useEffect, useRef, type RefObject } from "react"
import {
  advanceBrother,
  angleForIndex,
  indexFromAngle,
  snapToBrother,
  type TurnDirection,
} from "@/lib/cube"

export type Rig = {
  rotation: number
  velocity: number
  target: number
  index: number
  dragging: boolean
}

export type CubeHandle = {
  go: (direction: TurnDirection) => void
  goTo: (index: number) => void
}

export function createRig(): Rig {
  return { rotation: 0, velocity: 0, target: 0, index: 0, dragging: false }
}

export function useCubeInput(
  stageRef: RefObject<HTMLDivElement | null>,
  rigRef: RefObject<Rig>,
  apiRef: RefObject<CubeHandle | null>,
  onIndex: (index: number) => void,
) {
  const onIndexRef = useRef(onIndex)

  useEffect(() => {
    onIndexRef.current = onIndex
  }, [onIndex])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const go = (direction: TurnDirection) => {
      const next = advanceBrother(rigRef.current.index, direction, rigRef.current.target)
      rigRef.current.target = next.angle
      rigRef.current.index = next.index
      rigRef.current.dragging = false
      onIndexRef.current(next.index)
    }

    const goTo = (index: number) => {
      rigRef.current.target = angleForIndex(index, rigRef.current.target)
      rigRef.current.index = index
      rigRef.current.dragging = false
      onIndexRef.current(index)
    }

    const handle: CubeHandle = { go, goTo }
    apiRef.current = handle

    let pointerId: number | null = null
    let lastX = 0
    let lastY = 0
    let lastTime = 0
    let moved = false
    let suppressClick = false
    let wheelLockedUntil = 0

    const menuIsOpen = () => document.querySelector("[role='dialog']") !== null

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.repeat || menuIsOpen()) return
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
        go(1)
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault()
        go(-1)
      }
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const now = performance.now()
      if (now < wheelLockedUntil) return
      const dominant = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
      if (Math.abs(dominant) < 4) return
      const steps = Math.min(2, Math.max(1, Math.round(Math.abs(dominant) / 220)))
      const direction: TurnDirection = dominant > 0 ? 1 : -1
      for (let step = 0; step < steps; step += 1) go(direction)
      wheelLockedUntil = now + 560
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      if (event.target instanceof Element && event.target.closest("a, button")) return
      pointerId = event.pointerId
      lastX = event.clientX
      lastY = event.clientY
      lastTime = performance.now()
      moved = false
      stage.setPointerCapture(event.pointerId)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return
      const dx = event.clientX - lastX
      const dy = event.clientY - lastY
      if (!moved && Math.hypot(dx, dy) < 8) return
      moved = true
      rigRef.current.dragging = true
      const now = performance.now()
      const dt = Math.max((now - lastTime) / 1000, 0.001)
      const dominant = Math.abs(dx) >= Math.abs(dy) ? dx : dy
      const delta = -dominant * 0.0075
      rigRef.current.rotation += delta
      rigRef.current.velocity = Math.max(-8, Math.min(8, delta / dt))
      lastX = event.clientX
      lastY = event.clientY
      lastTime = now
      const live = indexFromAngle(rigRef.current.rotation)
      if (live !== rigRef.current.index) {
        rigRef.current.index = live
        onIndexRef.current(live)
      }
    }

    const endDrag = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return
      pointerId = null
      if (!moved) {
        rigRef.current.dragging = false
        return
      }
      suppressClick = true
      rigRef.current.dragging = false
      const snapped = snapToBrother(rigRef.current.rotation, rigRef.current.velocity)
      rigRef.current.target = snapped.angle
      rigRef.current.index = snapped.index
      onIndexRef.current(snapped.index)
    }

    const onClickCapture = (event: MouseEvent) => {
      if (!suppressClick) return
      suppressClick = false
      event.preventDefault()
      event.stopPropagation()
    }

    stage.addEventListener("wheel", onWheel, { passive: false })
    stage.addEventListener("pointerdown", onPointerDown)
    stage.addEventListener("pointermove", onPointerMove)
    stage.addEventListener("pointerup", endDrag)
    stage.addEventListener("pointercancel", endDrag)
    stage.addEventListener("click", onClickCapture, true)
    window.addEventListener("keydown", onKeyDown)

    return () => {
      if (apiRef.current === handle) apiRef.current = null
      stage.removeEventListener("wheel", onWheel)
      stage.removeEventListener("pointerdown", onPointerDown)
      stage.removeEventListener("pointermove", onPointerMove)
      stage.removeEventListener("pointerup", endDrag)
      stage.removeEventListener("pointercancel", endDrag)
      stage.removeEventListener("click", onClickCapture, true)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [apiRef, onIndexRef, rigRef, stageRef])
}
