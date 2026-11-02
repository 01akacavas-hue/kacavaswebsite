import type { ReactNode } from "react"
import { SiteLinks } from "@/components/chrome/site-links"
import type { BrotherId } from "@/lib/types"

const toneClass: Record<BrotherId, string> = {
  eli: "border-eli",
  niko: "border-niko",
  alec: "border-alec",
}

export function Page({
  children,
  tone,
  width = "default",
}: {
  children: ReactNode
  tone?: BrotherId
  width?: "default" | "wide"
}) {
  const max = width === "wide" ? "max-w-[1120px]" : "max-w-6xl"
  return (
    <article
      className={`mx-auto w-full border-t-2 ${max} px-5 pt-24 pb-16 sm:px-8 ${tone ? toneClass[tone] : "border-transparent"}`}
    >
      {children}
      <footer className="mt-20 border-t border-line pt-6">
        <SiteLinks />
      </footer>
    </article>
  )
}
