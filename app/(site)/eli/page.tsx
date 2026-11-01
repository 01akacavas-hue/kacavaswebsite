import type { Metadata } from "next"
import { EliView } from "@/components/brothers/eli-view"
import { Page } from "@/components/chrome/page"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata("eli")

export default function EliPage() {
  return (
    <Page tone="eli">
      <EliView />
    </Page>
  )
}
