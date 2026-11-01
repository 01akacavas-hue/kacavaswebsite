import type { Metadata } from "next"
import { AlecView } from "@/components/brothers/alec-view"
import { Page } from "@/components/chrome/page"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata("alec")

export default function AlecPage() {
  return (
    <Page tone="alec">
      <AlecView />
    </Page>
  )
}
