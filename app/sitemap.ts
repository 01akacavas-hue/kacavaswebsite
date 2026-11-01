import type { MetadataRoute } from "next"
import { pages } from "@/data/nav"
import { SITE_URL } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return pages
    .filter((page) => page.index)
    .map((page) => ({
      url: new URL(page.href, SITE_URL).toString(),
      changeFrequency: "monthly",
      priority: page.href === "/" ? 1 : 0.7,
    }))
}
