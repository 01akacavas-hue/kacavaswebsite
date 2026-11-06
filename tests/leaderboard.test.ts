import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, it } from "node:test"
import { achievements, creditCount, oscarCount } from "../data/achievements"
import { countryPinsFor } from "../data/country-pins"
import { nikoVisitedCountries } from "../data/niko-countries"
import { places } from "../data/places"
import { countriesVisited, scoreboard } from "../lib/leaderboard"
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
      if (place.countryPin || place.country !== "United States" || place.recommended || place.wishlist) continue
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

  it("counts Nicholas's country list, and keeps Alexander on visited pins", () => {
    const niko = countriesVisited(places, "niko")
    const alec = countriesVisited(places, "alec")
    const eli = countriesVisited(places, "eli")
    assert.equal(niko.length, 23)
    assert.equal(new Set(niko).size, 23)
    assert.equal(niko.includes("United States"), true)
    assert.equal(niko.includes("America"), false)
    assert.equal(niko.includes("Czech Republic"), true)
    assert.equal(niko.includes("Czechia"), false)
    assert.equal(niko.includes("England"), true)
    assert.equal(niko.includes("United Kingdom"), false)
    assert.equal(niko.includes("Turks and Caicos"), true)
    assert.deepEqual(niko, [...nikoVisitedCountries])
    assert.deepEqual(alec, ["Costa Rica", "Spain", "United Kingdom", "United States"])
    assert.deepEqual(eli, [])
    const scores = scoreboard(places, achievements)
    assert.equal(scores.find((score) => score.id === "niko")?.countries, 23)
    assert.equal(scores.find((score) => score.id === "alec")?.countries, 4)
    assert.equal(scores.find((score) => score.id === "eli")?.countries, 0)
  })

  it("adds a country pin only where Nicholas has no place", () => {
    const pins = places.filter((place) => place.countryPin)
    assert.deepEqual(
      pins.map((pin) => pin.country).sort(),
      [
        "Austria",
        "Barbados",
        "Canada",
        "England",
        "Estonia",
        "Greece",
        "Hungary",
        "Jamaica",
        "Latvia",
        "Luxembourg",
        "Monaco",
        "Netherlands",
        "Switzerland",
        "Turks and Caicos",
      ],
    )
    for (const pin of pins) {
      assert.equal(pin.category, "country")
      assert.equal(pin.city, "")
      assert.equal(pin.name, pin.country)
      assert.equal(pin.countryPin, true)
      assert.equal(pin.recommended, undefined)
      assert.equal(pin.wishlist, undefined)
      assert.deepEqual(pin.brothers, ["niko"])
    }
    const covered = ["Belgium", "Czech Republic", "France", "Germany", "Italy", "Malta", "Poland", "Spain", "United States"]
    assert.equal(pins.some((pin) => covered.includes(pin.country) || pin.country === "United Kingdom"), false)
    const blocked = countryPinsFor(
      [place({ id: "rec-greece", city: "Athens", country: "Greece", brothers: ["niko"], recommended: true })],
      [{ brother: "niko", countries: ["Greece", "Canada"] }],
    )
    assert.deepEqual(
      blocked.map((pin) => pin.country),
      ["Canada"],
    )
    const scores = scoreboard(places, achievements)
    assert.equal(scores.find((score) => score.id === "niko")?.countries, 23)
    const nikoCities = new Set(
      places.filter((item) => item.brothers.includes("niko") && !item.countryPin && !item.recommended && !item.wishlist).map((item) => `${item.city}\u0000${item.country}`),
    )
    assert.equal(scores.find((score) => score.id === "niko")?.cities, nikoCities.size)
  })

  it("merges a new visited country onto Nicholas's list without counting a recommendation", () => {
    const extra = place({ id: "porto", city: "Porto", country: "Portugal", brothers: ["niko"] })
    const recommended = place({ id: "lisbon", city: "Lisbon", country: "Portugal", brothers: ["niko"], recommended: true })
    const america = place({ id: "america", city: "Boston", country: "America", brothers: ["niko"] })
    const czechia = place({ id: "prague", city: "Prague", country: "Czechia", brothers: ["niko"] })
    const withExtra = countriesVisited([extra, recommended, america, czechia], "niko")
    assert.equal(withExtra.length, 24)
    assert.equal(withExtra.at(-1), "Portugal")
    assert.equal(withExtra.filter((country) => country === "United States").length, 1)
    assert.equal(withExtra.filter((country) => country === "Czech Republic").length, 1)
    assert.equal(countriesVisited([recommended], "alec").includes("Portugal"), false)
  })

  it("does not invent a twin, a school, or a posting in the achievements file", () => {
    const text = readFileSync(join(import.meta.dirname, "../data/achievements.ts"), "utf8").toLowerCase()
    for (const phrase of ["twin", "nyu", "west point", "fort ", "cavalry", "captain"]) {
      assert.equal(text.includes(phrase), false, phrase)
    }
  })
})
