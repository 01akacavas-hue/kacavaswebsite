import Image from "next/image"
import { objectPosition, portraits } from "@/data/images"
import type { BrotherId, SiteImage } from "@/lib/types"

export function Portrait({
  id,
  image,
  priority = false,
  sizes,
  className,
}: {
  id: BrotherId
  image?: SiteImage
  priority?: boolean
  sizes: string
  className?: string
}) {
  const photo = image ?? portraits[id]
  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      fill
      sizes={sizes}
      priority={priority}
      fetchPriority={priority ? "high" : "auto"}
      quality={65}
      className={className ?? "object-cover"}
      style={{ objectPosition: objectPosition(photo) }}
    />
  )
}
