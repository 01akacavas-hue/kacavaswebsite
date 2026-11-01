import { Suspense } from "react"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { places } from "@/data/places"
import { Page } from "@/components/chrome/page"
import { MapFallback } from "@/components/map/map-fallback"
import { PlacesExplorer } from "@/components/map/places-explorer"
import { SESSION_COOKIE, isSessionValid } from "@/lib/auth"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata("restaurants")

export default function RestaurantsPage() {
  return (
    <Page width="wide">
      <Suspense fallback={<MapFallback />}>
        <AuthorizedPlaces />
      </Suspense>
    </Page>
  )
}

async function AuthorizedPlaces() {
  await connection()
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!(await isSessionValid(token))) redirect("/gate")
  return <PlacesExplorer places={places} />
}
