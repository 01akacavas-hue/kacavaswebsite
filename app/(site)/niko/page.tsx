import type { Metadata } from "next"
import { NikoView } from "@/components/brothers/niko-view"
import { Page } from "@/components/chrome/page"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata("niko")

export default function NikoPage() {
  return (
    <Page tone="niko">
      <NikoView />
    </Page>
  )
}
