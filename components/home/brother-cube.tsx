"use client"

import { ContactShadows, Edges } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import type { Brother } from "@/data/brothers"
import { BrotherPanel } from "@/components/home/brother-panel"
import {
  createRig,
  useCubeInput,
  type CubeHandle,
  type Rig,
} from "@/hooks/use-cube-input"

const FACE = 3.15

const faceLayout = [
  { position: [0, 0, FACE / 2 + 0.01] as const, rotation: [0, 0, 0] as const, letter: "E" },
  { position: [FACE / 2 + 0.01, 0, 0] as const, rotation: [0, Math.PI / 2, 0] as const, letter: "N" },
  { position: [0, 0, -(FACE / 2 + 0.01)] as const, rotation: [0, Math.PI, 0] as const, letter: "A" },
  { position: [-(FACE / 2 + 0.01), 0, 0] as const, rotation: [0, -Math.PI / 2, 0] as const, letter: "K" },
]

export function BrotherCube({
  apiRef,
  brother,
  onIndex,
}: {
  apiRef: React.RefObject<CubeHandle | null>
  brother: Brother
  onIndex: (index: number) => void
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const rigRef = useRef<Rig>(createRig())
  const parallaxRef = useRef({ x: 0, y: 0 })
  const panelRef = useRef<HTMLDivElement>(null)

  useCubeInput(stageRef, rigRef, apiRef, onIndex)

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (rigRef.current.dragging) return
      const width = window.innerWidth || 1
      const height = window.innerHeight || 1
      parallaxRef.current.x = (event.clientX / width) * 2 - 1
      parallaxRef.current.y = (event.clientY / height) * 2 - 1
    }
    window.addEventListener("pointermove", onMove)
    return () => window.removeEventListener("pointermove", onMove)
  }, [parallaxRef, rigRef])

  return (
    <div ref={stageRef} className="absolute inset-0 touch-none">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0.05, 6.05], fov: 32, near: 0.1, far: 40 }}
      >
        <Scene
          rigRef={rigRef}
          parallaxRef={parallaxRef}
          panelRef={panelRef}
          accent={brother.accent}
        />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
        <div ref={panelRef} className="pointer-events-auto max-w-[320px]">
          <BrotherPanel brother={brother} variant="cube" />
        </div>
      </div>
    </div>
  )
}

function Scene({
  rigRef,
  parallaxRef,
  panelRef,
  accent,
}: {
  rigRef: React.RefObject<Rig>
  parallaxRef: React.RefObject<{ x: number; y: number }>
  panelRef: React.RefObject<HTMLDivElement | null>
  accent: string
}) {
  const groupRef = useRef<THREE.Group>(null)
  const textures = useFaceTextures(accent)

  useFrame((state, delta) => {
    const current = rigRef.current
    const dt = Math.min(delta, 0.033)
    if (!current.dragging) {
      const diff = current.target - current.rotation
      const acceleration = diff * 46 - current.velocity * 13
      current.velocity += acceleration * dt
      current.rotation += current.velocity * dt
      if (Math.abs(diff) < 0.0008 && Math.abs(current.velocity) < 0.0008) {
        current.rotation = current.target
        current.velocity = 0
      }
    }
    if (groupRef.current) groupRef.current.rotation.y = current.rotation

    const camera = state.camera
    camera.position.x = THREE.MathUtils.damp(camera.position.x, parallaxRef.current.x * 0.35, 4, dt)
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      0.08 + parallaxRef.current.y * -0.2,
      4,
      dt,
    )
    camera.lookAt(0, 0, 0)

    const panel = panelRef.current
    if (panel) {
      panel.style.opacity = alignment(current.rotation).toFixed(3)
    }
  })

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4.5, 5.5, 6]} intensity={2.2} color="#fff6ea" />
      <directionalLight position={[-5, 1.5, -2]} intensity={0.9} color={accent} />
      <Particles color={accent} />
      <group ref={groupRef}>
        <mesh>
          <boxGeometry args={[FACE, FACE, FACE]} />
          <meshStandardMaterial color="#10100e" metalness={0.62} roughness={0.34} />
          <Edges color={accent} />
        </mesh>
        {faceLayout.map((face, index) => (
          <mesh key={face.letter} position={face.position} rotation={face.rotation}>
            <planeGeometry args={[2.72, 2.72]} />
            <meshBasicMaterial map={textures[index]} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <ContactShadows position={[0, -1.85, 0]} opacity={0.45} scale={10} blur={2.4} far={3.4} color="#000000" />
    </>
  )
}

function useFaceTextures(accent: string): THREE.CanvasTexture[] {
  const textures = useMemo(() => faceLayout.map((face) => drawFace(face.letter, accent)), [accent])
  useEffect(
    () => () => {
      for (const texture of textures) texture.dispose()
    },
    [textures],
  )
  return textures
}

function drawFace(letter: string, accent: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas")
  canvas.width = 512
  canvas.height = 512
  const context = canvas.getContext("2d")
  if (!context) return new THREE.CanvasTexture(canvas)
  context.fillStyle = "#141412"
  context.fillRect(0, 0, 512, 512)
  context.fillStyle = accent
  context.fillRect(48, 56, 72, 6)
  context.fillStyle = "#f3efe6"
  context.font = "220px Georgia, serif"
  context.textAlign = "center"
  context.textBaseline = "middle"
  context.fillText(letter, 256, 270)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

function alignment(rotation: number): number {
  const stops = [0, -Math.PI / 2, -Math.PI]
  let best = 0
  for (const stop of stops) {
    const delta = Math.atan2(Math.sin(rotation - stop), Math.cos(rotation - stop))
    best = Math.max(best, Math.cos(delta))
  }
  return smoothstep(0.45, 0.92, best)
}

function smoothstep(edge0: number, edge1: number, value: number): number {
  const amount = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)))
  return amount * amount * (3 - 2 * amount)
}

function particleGeometry(): THREE.BufferGeometry {
  const random = mulberry32(20261101)
  const positions = new Float32Array(72 * 3)
  for (let index = 0; index < 72; index += 1) {
    positions[index * 3] = (random() - 0.5) * 12
    positions[index * 3 + 1] = (random() - 0.5) * 7
    positions[index * 3 + 2] = (random() - 0.5) * 8
  }
  const buffer = new THREE.BufferGeometry()
  buffer.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  return buffer
}

function mulberry32(seed: number): () => number {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function Particles({ color }: { color: string }) {
  const pointsRef = useRef<THREE.Points>(null)
  const geometry = useMemo(() => particleGeometry(), [])
  useEffect(() => () => geometry.dispose(), [geometry])
  useFrame(({ clock }) => {
    if (pointsRef.current) pointsRef.current.rotation.y = clock.elapsedTime * 0.015
  })
  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial color={color} size={0.028} transparent opacity={0.8} sizeAttenuation depthWrite={false} />
    </points>
  )
}
