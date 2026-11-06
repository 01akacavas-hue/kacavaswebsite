import { accents } from "@/lib/theme"
import { brotherIds, type BrotherId } from "@/lib/types"

const order: readonly BrotherId[] = brotherIds

function slicesFor(counts: Record<BrotherId, number>) {
  const parts = order
    .map((id) => ({ id, value: counts[id], color: accents[id] }))
    .filter((part) => part.value > 0)
  const total = parts.reduce((sum, part) => sum + part.value, 0) || 1
  const radius = 15
  const circumference = 2 * Math.PI * radius
  const slices: { id: BrotherId; color: string; length: number; offset: number }[] = []
  let offset = 0
  for (const part of parts) {
    const length = (part.value / total) * circumference
    slices.push({ id: part.id, color: part.color, length, offset })
    offset += length
  }
  return { radius, circumference, slices }
}

export function ClusterDonut({
  count,
  alec,
  niko,
  eli,
}: {
  count: number
  alec: number
  niko: number
  eli: number
}) {
  const { radius, circumference, slices } = slicesFor({ alec, niko, eli })

  return (
    <svg viewBox="0 0 44 44" className="size-11" aria-hidden="true">
      <circle cx="22" cy="22" r={radius} fill="#f7f3ec" />
      {slices.map((slice) => (
        <circle
          key={slice.id}
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke={slice.color}
          strokeWidth="6"
          strokeDasharray={`${slice.length} ${circumference - slice.length}`}
          strokeDashoffset={-slice.offset}
          transform="rotate(-90 22 22)"
        />
      ))}
      <text x="22" y="23" textAnchor="middle" dominantBaseline="middle" fill="#1a1714" fontSize="11" fontFamily="ui-sans-serif, system-ui, sans-serif">
        {count}
      </text>
    </svg>
  )
}
