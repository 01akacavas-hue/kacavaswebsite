import assert from "node:assert/strict"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import { describe, it } from "node:test"
import { alecRoles } from "../data/alec"
import { brothers } from "../data/brothers"
import { pages } from "../data/nav"
import { cityTables, places } from "../data/places"
import { brotherIds } from "../lib/types"
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

  it("lists the brothers as Nicholas, then Elias, then Alexander", () => {
    assert.deepEqual([...brotherIds], ["niko", "eli", "alec"])
    assert.deepEqual(
      brothers.map((brother) => brother.id),
      ["niko", "eli", "alec"],
    )
    assert.deepEqual(
      brothers.map((brother) => brother.shortName),
      ["Nicholas", "Elias", "Alexander"],
    )
    assert.deepEqual(
      brothers.map((brother) => brother.index),
      [0, 1, 2],
    )
    const elias = brothers.find((brother) => brother.id === "eli")
    assert.equal(elias?.shortName, "Elias")
    assert.equal(elias !== undefined && "knownAs" in elias, false)
    assert.deepEqual(
      pages.filter((page) => page.brother).map((page) => page.brother),
      ["niko", "eli", "alec"],
    )
    const explorer = readFileSync(join(root, "components/map/places-explorer.tsx"), "utf8")
    assert.match(explorer, /Nicholas&apos;s, Elias&apos;s, and Alexander&apos;s/)
    assert.equal(explorer.includes("Eli's"), false)
  })

  it("keeps Elias's restaurants on his own pins", () => {
    const eli = places.filter((place) => place.brothers.includes("eli"))
    assert.equal(eli.length, 19)
    const losAngeles = eli.filter((place) => place.city === "Los Angeles")
    const newYork = eli.filter((place) => place.city === "New York")
    assert.equal(losAngeles.length, 16)
    assert.equal(newYork.length, 3)
    for (const place of eli) {
      assert.deepEqual(place.brothers, ["eli"])
      assert.equal(place.country, "United States")
      assert.equal(place.countryPin, undefined)
      assert.equal(place.recommended, undefined)
      assert.equal(place.wishlist, undefined)
      assert.equal(place.price, undefined)
      assert.equal(place.stars, undefined)
      assert.equal(place.approximate, undefined)
      assert.equal(/\bEli\b/.test(place.name), false)
      assert.equal(place.notes.includes("Eli"), false)
    }
    assert.deepEqual(
      eli.map((place) => place.name).sort(),
      [
        "Avra",
        "Backyard Bowls",
        "Catch",
        "Chiba",
        "Estiatorio Louká",
        "Good Beer",
        "Hedley's",
        "Kitchen 24",
        "Pause Cafe",
        "Philz Coffee",
        "Quantum Leap",
        "Sachi Sushi",
        "Salsa and Beer",
        "Sugarfish",
        "Tar & Roses",
        "The Apple Pan",
        "The Bombay Frankie Company",
        "The Carving Board",
        "Tu Madre",
      ],
    )
    const chiba = eli.find((place) => place.id === "eli-chiba")
    assert.match(chiba?.notes ?? "", /Ask for Shig/)
    assert.match(chiba?.notes ?? "", /Raul/)
    const madre = eli.find((place) => place.id === "eli-tu-madre")
    assert.match(madre?.notes ?? "", /Tacos/)
    assert.match(madre?.notes ?? "", /Sandeep suggested it/)
    assert.match(eli.find((place) => place.id === "eli-sugarfish")?.notes ?? "", /Sugar fish/)
    assert.match(eli.find((place) => place.id === "eli-estiatorio-louka")?.notes ?? "", /Estiotoria Luka/)
    assert.match(eli.find((place) => place.id === "eli-hedleys")?.notes ?? "", /Hedleys/)
    assert.match(eli.find((place) => place.id === "eli-bombay-frankie")?.notes ?? "", /Bombay Frankies/)
    assert.match(eli.find((place) => place.id === "eli-tar-and-roses")?.notes ?? "", /Tar and Roses/)
    assert.match(eli.find((place) => place.id === "eli-apple-pan")?.notes ?? "", /Apple Pan/)
    assert.equal(
      places.some((place) => place.countryPin && place.brothers.includes("eli")),
      false,
    )
    assert.equal(places.filter((place) => place.id === "la-avra" && place.brothers.includes("eli")).length, 0)
    assert.equal(places.filter((place) => place.id === "nyc-catch" && place.brothers.includes("eli")).length, 0)
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

  it("keeps every page out of the public index", () => {
    const restaurants = pages.find((page) => page.id === "restaurants")
    assert.ok(restaurants)
    assert.equal(restaurants?.index, false)
    assert.equal(pages.filter((page) => page.href === "/restaurants").length, 1)
    assert.equal(pages.filter((page) => page.enabled && page.index).length, 0)
    const robots = readFileSync(join(root, "app/robots.ts"), "utf8")
    assert.match(robots, /disallow:\s*"\/"/)
    const hrefs = pages.map((page) => page.href)
    assert.equal(new Set(hrefs).size, hrefs.length)
  })
})
