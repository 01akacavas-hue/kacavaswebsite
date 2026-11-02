import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, it } from "node:test"
import { achievements, creditCount, oscarCount } from "../data/achievements"
import { places } from "../data/places"
import { scoreboard } from "../lib/leaderboard"
import { stateForCity } from "../lib/us-states"
import type { Place } from "../lib/types"

function place(partial: Partial<Place> & Pick<Place, "id" | "city" | "country">): Place {
  return {
    name: partial.id,
    category: "restaurant",
    latitude: 0,
    longitude: 0,
    brothers: ["alec"],
    notes: "",
    ...partial,
  }
}

describe("leaderboard", () => {
  it("counts a shared visit for each brother and skips recommendations", () => {
    const sample: Place[] = [
      place({ id: "boston", city: "Boston", country: "United States", brothers: ["alec", "niko"] }),
      place({ id: "paris", city: "Paris", country: "France", brothers: ["niko"] }),
      place({ id: "later", city: "Lisbon", country: "Portugal", brothers: ["alec"], recommended: true }),
      place({ id: "star", city: "Lille", country: "France", brothers: ["niko"], michelin: 1 }),
      place({ id: "unread", city: "Lille", country: "France", brothers: ["niko"], michelin: 1, recommended: true }),
    ]
    const scores = scoreboard(sample, achievements)
    const alec = scores.find((score) => score.id === "alec")
    const niko = scores.find((score) => score.id === "niko")
    assert.equal(alec?.cities, 1)
    assert.equal(alec?.countries, 1)
    assert.equal(alec?.states, 1)
    assert.equal(niko?.cities, 3)
    assert.equal(niko?.michelin, 1)
    assert.equal(alec?.michelin, 0)
  })

  it("maps every visited U.S. city to a state or the District", () => {
    const missing = new Set<string>()
    for (const place of places) {
      if (place.country !== "United States" || place.recommended || place.wishlist) continue
      if (!stateForCity(place.city)) missing.add(place.city)
    }
    assert.deepEqual([...missing], [])
  })

  it("counts Elias's series and movies, leaves Oscars at zero, and ignores shorts", () => {
    const eli = achievements.eli
    assert.equal(creditCount(eli.shows), 3)
    assert.equal(creditCount(eli.movies), 7)
    assert.equal(oscarCount(eli.movies), 0)
    assert.equal(eli.shorts.length, 4)
    assert.equal(eli.trophies.length, 0)
    assert.deepEqual(
      eli.superlatives.map((item) => item.title),
      ["Dog Dad"],
    )
    assert.equal(eli.movies?.some((credit) => credit.kind === "short"), false)
  })

  it("keeps Alexander to CODA, with no role, and leaves Nicholas blank", () => {
    assert.equal(creditCount(achievements.alec.movies), 1)
    assert.equal(oscarCount(achievements.alec.movies), 1)
    assert.equal(achievements.alec.movies?.[0]?.title, "CODA")
    assert.equal(achievements.alec.movies?.[0]?.role, null)
    assert.match(achievements.alec.movies?.[0]?.note ?? "", /Appeared in CODA/)
    assert.equal(achievements.alec.shows, null)
    assert.equal(achievements.niko.movies, null)
    assert.equal(achievements.niko.shows, null)
    assert.equal(achievements.niko.trophies.length, 0)
    assert.deepEqual(
      achievements.niko.superlatives.map((item) => item.title),
      ["The Fattest", "Overly Angry"],
    )
    assert.deepEqual(
      achievements.alec.superlatives.map((item) => item.title),
      ["Best Scooter Driver"],
    )
    assert.deepEqual(
      achievements.alec.trophies.map((item) => item.title),
      ["CODA", "1,430", "Grillmaster"],
    )
    const titles = ["niko", "eli", "alec"].flatMap((id) => achievements[id as "niko" | "eli" | "alec"].superlatives.map((item) => item.title))
    assert.deepEqual(titles, ["The Fattest", "Overly Angry", "Dog Dad", "Best Scooter Driver"])
  })

  it("flags only Michelin stars the notes name", () => {
    const angler = places.find((place) => place.id === "sf-angler")
    const birdsong = places.find((place) => place.id === "sf-birdsong")
    const cerisier = places.find((place) => place.id === "niko-cerisier")
    const clarance = places.find((place) => place.id === "niko-clarance")
    assert.equal(angler?.michelin, 1)
    assert.equal(birdsong?.michelin, undefined)
    assert.equal(cerisier?.michelin, 1)
    assert.equal(clarance?.recommended, true)
    const scores = scoreboard(places, achievements)
    const niko = scores.find((score) => score.id === "niko")
    const alec = scores.find((score) => score.id === "alec")
    assert.equal(niko?.michelin, 1)
    assert.equal(alec?.michelin, 1)
  })

  it("does not invent a twin, a school, or a posting in the achievements file", () => {
    const text = readFileSync(join(import.meta.dirname, "../data/achievements.ts"), "utf8").toLowerCase()
    for (const phrase of ["twin", "nyu", "west point", "fort ", "cavalry", "captain"]) {
      assert.equal(text.includes(phrase), false, phrase)
    }
  })
})
