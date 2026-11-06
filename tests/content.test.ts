import assert from "node:assert/strict"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import { describe, it } from "node:test"
import { alecRoles } from "../data/alec"
import { pages } from "../data/nav"
import { cityTables, places } from "../data/places"
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
  "fort benning",
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
      const travelGuide =
        file.endsWith(join("data", "places.ts")) ||
        file.endsWith(join("data", "niko-places.ts")) ||
        file.endsWith(join("data", "niko-countries.ts"))
      if (!travelGuide && text.includes("poland")) hits.push(`${file} contains “poland”`)
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

  it("keeps place records well formed", () => {
    const ids = new Set<string>()
    for (const place of places) {
      assert.equal(ids.has(place.id), false, place.id)
      ids.add(place.id)
      assert.equal(place.notes.includes("EXAMPLE"), false)
      assert.equal(place.notes.toLowerCase().includes("in contacts"), false)
      assert.ok(place.brothers.length > 0)
      assert.ok(place.brothers.every((id) => id === "alec" || id === "niko" || id === "eli"))
      assert.ok(place.latitude >= -90 && place.latitude <= 90)
      assert.ok(place.longitude >= -180 && place.longitude <= 180)
      assert.ok(place.name.length > 0)
      assert.ok(place.category.length > 0)
    }
    assert.ok(places.length > 150)
    assert.equal(places.filter((place) => place.id === "boston-anchor").length, 1)
    assert.equal(places.filter((place) => place.name.toLowerCase().includes("tonga")).length, 1)
    assert.equal(places.filter((place) => place.id === "sf-parklab").length, 1)
    assert.equal(places.filter((place) => place.id === "sf-alora").length, 1)
    assert.equal(places.filter((place) => place.wishlist).length, 12)
    const belt = places.find((place) => place.id === "atlanta-beltline")
    assert.equal(belt?.category, "activity")
    const puena = places.find((place) => place.id === "hawaii-puena")
    assert.equal(puena?.category, "beach")
    const nikoPlaces = places.filter((place) => place.brothers.includes("niko") && !place.brothers.includes("alec"))
    assert.ok(nikoPlaces.length > 80)
    assert.equal(places.some((place) => place.name === "Le Welsh"), false)
    assert.equal(places.some((place) => place.name.toLowerCase().includes("balbuljata")), false)
    const boca = places.find((place) => place.id === "niko-boca-chica")
    assert.equal(boca?.recommended, true)
    assert.equal(boca?.brothers.includes("niko"), true)
    const cerisier = places.find((place) => place.id === "niko-cerisier")
    assert.equal(cerisier?.michelin, 1)
    const tasting = places.find((place) => place.id === "niko-miedzy-mostami")
    assert.equal(tasting?.grade, "A+")
    assert.equal(cityTables.some((table) => table.city === "Lille"), true)
    assert.equal(cityTables.some((table) => table.dishes.some((dish) => dish.startsWith("Balbuljata"))), true)
    assert.equal(places.some((place) => place.notes.toLowerCase().includes("fort benning")), false)
    assert.equal(places.some((place) => place.notes.toLowerCase().includes("jordi")), false)
  })

  it("hides shop and creative until they are switched on", () => {
    const shop = pages.find((page) => page.id === "shop")
    const creative = pages.find((page) => page.id === "creative")
    assert.equal(shop?.enabled, false)
    assert.equal(creative?.enabled, false)
    assert.equal(shop?.index, false)
    assert.equal(creative?.index, false)
  })

  it("ships starter products as examples without Stripe prices", () => {
    assert.ok(products.length > 0)
    for (const product of products) {
      assert.equal(product.example, true)
      assert.equal(product.stripePriceId, undefined)
      assert.ok(product.priceCents > 0)
    }
  })

  it("writes Alec's page in the first person", () => {
    const view = readFileSync(join(root, "components/brothers/alec-view.tsx"), "utf8")
    assert.match(view, /I went to Babson/)
    assert.match(view, /I was in the movie CODA/)
    assert.match(view, /I hold a world record: the longest continuous shotski, with 1,430 people, in Park City, Utah/)
    assert.match(view, /academyAwardPhoto\.license/)
    assert.match(view, /academyAwardPhoto\.sourceUrl/)
    assert.equal(view.includes("Best Actor"), false)
    assert.equal(view.includes("He loves"), false)
    const photo = readFileSync(join(root, "data/alec.ts"), "utf8")
    assert.match(photo, /https:\/\/commons\.wikimedia\.org\/wiki\/File:DSC_7227_/)
    assert.match(photo, /creativecommons\.org\/licenses\/by-sa\/4\.0/)
    assert.ok(statSync(join(root, "public/images/alec/academy-award.jpg")).size > 1000)
    assert.equal(view.includes("He attended"), false)
    for (const role of alecRoles) {
      assert.equal(/\bHe\b/.test(role.detail), false, role.id)
    }
  })

  it("keeps the private map out of the menu's public index", () => {
    const restaurants = pages.find((page) => page.id === "restaurants")
    assert.ok(restaurants)
    assert.equal(restaurants?.index, false)
    assert.equal(pages.filter((page) => page.href === "/restaurants").length, 1)
    const robots = readFileSync(join(root, "app/robots.ts"), "utf8")
    assert.match(robots, /\/restaurants/)
    assert.equal(pages.filter((page) => page.index && page.enabled).some((page) => page.href === "/restaurants"), false)
    const hrefs = pages.map((page) => page.href)
    assert.equal(new Set(hrefs).size, hrefs.length)
  })
})
