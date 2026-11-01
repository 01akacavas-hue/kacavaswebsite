import type { Metadata } from "next"
import { getPage, type PageId } from "@/data/nav"

export function pageMetadata(id: PageId): Metadata {
  const page = getPage(id)
  return {
    title: id === "home" ? { absolute: page.title } : page.title,
    description: page.description,
    alternates: { canonical: page.href },
    robots: page.index
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title: page.title,
      description: page.description,
      url: page.href,
    },
  }
}
