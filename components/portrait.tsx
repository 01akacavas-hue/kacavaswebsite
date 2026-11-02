import Image from "next/image"
import { portraits } from "@/data/images"
import type { BrotherId } from "@/lib/types"

export function Portrait({
  id,
  priority = false,
  sizes,
  className,
}: {
  id: BrotherId
  priority?: boolean
  sizes: string
  className?: string
}) {
  const image = portraits[id]
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      fetchPriority={priority ? "high" : "auto"}
      quality={65}
      className={className ?? "object-cover"}
    />
  )
}
