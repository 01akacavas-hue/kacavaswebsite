"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { brothers } from "@/data/brothers"
import { portraits } from "@/data/images"

const CARD_W = 1.46
const CARD_H = 1.96

export function ScrollScene({
  progressRef,
  parallaxRef,
}: {
  progressRef: { current: number }
  parallaxRef: { current: { x: number; y: number } }
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.04, 4.35], fov: 30, near: 0.1, far: 30 }}
      style={{ pointerEvents: "none", width: "100%", height: "100%" }}
      frameloop="always"
    >
      <Scene progressRef={progressRef} parallaxRef={parallaxRef} />
    </Canvas>
  )
}

function Scene({
  progressRef,
  parallaxRef,
}: {
  progressRef: { current: number }
  parallaxRef: { current: { x: number; y: number } }
}) {
  const rigRef = useRef<THREE.Group>(null)
  const shadow = useMemo(() => shadowTexture(), [])

  useEffect(() => () => shadow.dispose(), [shadow])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.033)
    const camera = state.camera
    camera.position.x = THREE.MathUtils.damp(camera.position.x, parallaxRef.current.x * 0.18, 3, dt)
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      0.04 + parallaxRef.current.y * -0.1,
      3,
      dt,
    )
    camera.lookAt(0, 0, 0)
    if (rigRef.current) rigRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.015
  })

  return (
    <>
      <color attach="background" args={["#f7f3ec"]} />
      <ambientLight intensity={1.05} />
      <directionalLight position={[2.4, 4.2, 5]} intensity={1.15} color="#fff8ee" />
      <directionalLight position={[-3.2, 1.4, 2]} intensity={0.35} color="#f0e6d8" />
      <group ref={rigRef}>
        {brothers.map((brother, index) => (
          <PortraitCard key={brother.id} index={index} progressRef={progressRef} />
        ))}
      </group>
      <mesh position={[0, -1.22, 0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.6, 1.3]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} />
      </mesh>
    </>
  )
}

function PortraitCard({
  index,
  progressRef,
}: {
  index: number
  progressRef: { current: number }
}) {
  const groupRef = useRef<THREE.Group>(null)
  const brother = brothers[index]
  const texture = usePortrait(brother ? portraits[brother.id].src : "")

  useFrame(() => {
    const group = groupRef.current
    if (!group) return
    const t = progressRef.current * (brothers.length - 1)
    const delta = index - t
    const angle = delta * 0.92
    group.position.x = Math.sin(angle) * 1.22
    group.position.z = (1 - Math.cos(angle)) * -1.45
    group.position.y = Math.abs(delta) * -0.05
    group.rotation.y = angle * 0.72
    const front = Math.max(0, Math.cos(angle))
    const scale = 0.84 + front * 0.16
    group.scale.setScalar(scale)
  })

  if (!brother) return null
  const accent = brother.accent

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[CARD_W + 0.07, CARD_H + 0.07]} />
        <meshBasicMaterial color="#fffdf8" side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <planeGeometry args={[CARD_W, CARD_H]} />
        {texture ? (
          <meshBasicMaterial map={texture} color="#ffffff" toneMapped={false} side={THREE.DoubleSide} />
        ) : (
          <meshBasicMaterial color={accent} side={THREE.DoubleSide} />
        )}
      </mesh>
    </group>
  )
}

function usePortrait(src: string): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    let active = true
    let loaded: THREE.Texture | null = null
    const loader = new THREE.TextureLoader()
    loader.load(src, (next) => {
      if (!active) {
        next.dispose()
        return
      }
      coverCrop(next, CARD_W / CARD_H)
      next.colorSpace = THREE.SRGBColorSpace
      next.anisotropy = 8
      next.needsUpdate = true
      loaded = next
      setTexture(next)
    })
    return () => {
      active = false
      loaded?.dispose()
    }
  }, [src])

  return texture
}

function coverCrop(texture: THREE.Texture, planeAspect: number) {
  const image = texture.image as { width?: number; height?: number } | undefined
  const width = image?.width ?? 1
  const height = image?.height ?? 1
  const imageAspect = width / height
  if (imageAspect > planeAspect) {
    const repeatX = planeAspect / imageAspect
    texture.repeat.set(repeatX, 1)
    texture.offset.set((1 - repeatX) / 2, 0)
  } else {
    const repeatY = imageAspect / planeAspect
    texture.repeat.set(1, repeatY)
    texture.offset.set(0, (1 - repeatY) / 2)
  }
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
}

function shadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = 256
  canvas.height = 128
  const context = canvas.getContext("2d")
  if (context) {
    const gradient = context.createRadialGradient(128, 64, 10, 128, 64, 120)
    gradient.addColorStop(0, "rgba(26, 23, 20, 0.18)")
    gradient.addColorStop(1, "rgba(26, 23, 20, 0)")
    context.fillStyle = gradient
    context.fillRect(0, 0, 256, 128)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}
