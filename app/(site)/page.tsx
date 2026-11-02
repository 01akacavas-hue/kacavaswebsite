import type { Metadata } from "next"
import { HomeExperience } from "@/components/home/home-experience"
import { HomeLanding } from "@/components/home/home-landing"
import { pageMetadata } from "@/lib/metadata"

export const metadata: Metadata = pageMetadata("home")

export default function HomePage() {
  return (
    <>
      <HomeLanding />
      <HomeExperience />
    </>
  )
}
