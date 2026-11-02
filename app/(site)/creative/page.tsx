import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Gallery } from "@/components/creative/gallery"
import { Page } from "@/components/chrome/page"
import { isPageEnabled } from "@/data/nav"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata("creative")

export default function CreativePage() {
  if (!isPageEnabled("creative")) notFound()
  return (
    <Page>
      <p className="text-xs tracking-[0.2em] text-muted uppercase">Creative</p>
      <h1 className="mt-3 font-serif text-6xl tracking-tight">Gallery</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        These frames are placeholders. Add photographs the brothers own in{" "}
        <code className="text-paper">data/images.ts</code>. Press photos stay off the site.
      </p>
      <Gallery />
    </Page>
  )
}
