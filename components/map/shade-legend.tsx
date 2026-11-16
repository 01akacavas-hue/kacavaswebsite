import { brotherLabel } from "@/lib/places"
import { mixBrotherColors, shadeGroups } from "@/lib/shade-color"
import type { BrotherId } from "@/lib/types"

export type MapScope = "world" | "us"

function swatchLabel(ids: readonly BrotherId[]): string {
  if (ids.length === 3) return "All three"
  return ids.map((id) => brotherLabel(id)).join(" and ")
}

export function MapScopeToggle({ scope, onChange }: { scope: MapScope; onChange: (scope: MapScope) => void }) {
  const options = [
    { id: "world" as const, label: "World" },
    { id: "us" as const, label: "United States" },
  ]
  return (
    <div className="pointer-events-auto flex gap-2" role="group" aria-label="World or United States">
      {options.map((option) => {
        const pressed = scope === option.id
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={pressed}
            className={`h-11 border px-3 text-xs tracking-[0.14em] uppercase shadow-[0_8px_20px_rgb(26_23_20_/_0.12)] ${pressed ? "border-paper bg-paper text-ink" : "border-line bg-ink text-paper"}`}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export function ShadeLegend({ scope }: { scope: MapScope }) {
  return (
    <div className="max-w-[18rem] border border-line bg-ink px-3 py-2.5 text-paper shadow-[0_8px_20px_rgb(26_23_20_/_0.12)]" aria-label="Who has been where">
      <p className="text-[0.62rem] tracking-[0.14em] text-muted uppercase">Who has been</p>
      <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1.5">
        {shadeGroups.map((ids) => (
          <li key={ids.join("-")} className="flex items-center gap-1.5 text-[0.7rem] leading-none">
            <span className="size-2.5 shrink-0" style={{ background: mixBrotherColors(ids) }} aria-hidden="true" />
            {swatchLabel(ids)}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[0.68rem] leading-snug text-muted">One brother fills the place. Two blend. All three mix.</p>
      {scope === "us" ? <p className="mt-1 text-[0.68rem] leading-snug text-muted">States and Washington, DC. Pan for Alaska and Hawaii.</p> : null}
    </div>
  )
}
