import assert from "node:assert/strict"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import { describe, it } from "node:test"
import { pages } from "../data/nav"
import { places } from "../data/places"
import { products } from "../data/products"
import { accents } from "../lib/theme"
import { PASSWORD_FALLBACK } from "../lib/auth"

const root = join(import.meta.dirname, "..")

const forbidden = [
  "fort stewart",
  "3rd infantry",
  "3rd id",
  "2 abct",
  "2nd armored",
  "6-8 cav",
  "6th squadron",
  "8th cavalry",
  "deputy commanding general",
  "poland",
]

function sourceFiles(directory: string): string[] {
  const found: string[] = []
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry)
    const stat = statSync(path)
    if (stat.isDirectory()) {
      found.push(...sourceFiles(path))
      continue
    }
    if (/\.(tsx?|css|md)$/.test(entry) && entry !== "README.md") found.push(path)
  }
  return found
}

describe("published copy", () => {
  it("does not name Nicholas's unit, base, or deployment", () => {
    const files = ["app", "components", "data", "lib"].flatMap((directory) =>
      sourceFiles(join(root, directory)),
    )
    const hits: string[] = []
    for (const file of files) {
      const text = readFileSync(file, "utf8").toLowerCase()
      for (const phrase of forbidden) {
        if (text.includes(phrase)) hits.push(`${file} contains “${phrase}”`)
      }
    }
    assert.deepEqual(hits, [])
  })

  it("keeps accent colors in the stylesheet", () => {
    const css = readFileSync(join(root, "app/globals.css"), "utf8").toLowerCase()
    for (const hex of Object.values(accents)) {
      assert.ok(css.includes(hex.toLowerCase()), `globals.css is missing ${hex}`)
    }
  })

  it("documents the password placeholder", () => {
    const readme = readFileSync(join(root, "README.md"), "utf8")
    assert.ok(readme.includes(PASSWORD_FALLBACK))
    assert.ok(readme.includes("SITE_PASSWORD"))
    assert.ok(readme.includes("kacavas.com"))
  })

  it("ships starter places as labeled examples with valid coordinates", () => {
    const ids = new Set<string>()
    for (const place of places) {
      assert.equal(ids.has(place.id), false, place.id)
      ids.add(place.id)
      assert.equal(place.example, true, place.id)
      assert.match(place.notes, /EXAMPLE/)
      assert.ok(place.brothers.length > 0)
      assert.ok(place.latitude >= -90 && place.latitude <= 90)
      assert.ok(place.longitude >= -180 && place.longitude <= 180)
      assert.ok(place.name.length > 0)
    }
  })

  it("ships starter products as examples without Stripe prices", () => {
    assert.ok(products.length > 0)
    for (const product of products) {
      assert.equal(product.example, true)
      assert.equal(product.stripePriceId, undefined)
      assert.ok(product.priceCents > 0)
    }
  })

  it("keeps the private map out of the menu's public index", () => {
    const restaurants = pages.find((page) => page.id === "restaurants")
    assert.ok(restaurants)
    assert.equal(restaurants?.index, false)
    assert.equal(pages.filter((page) => page.href === "/restaurants").length, 1)
    const hrefs = pages.map((page) => page.href)
    assert.equal(new Set(hrefs).size, hrefs.length)
  })
})
