import assert from "node:assert/strict"
import { afterEach, describe, it } from "node:test"
import {
  PASSWORD_FALLBACK,
  createSessionValue,
  getSitePassword,
  isSessionValid,
  isUsingPasswordFallback,
  passwordsMatch,
} from "../lib/auth"
import { formatPrice } from "../lib/money"
import { clusterPoints } from "../lib/cluster"
import { framePoint } from "../lib/map-camera"
import { filterPlaces, queryPlaces } from "../lib/places"
import { spiderfy } from "../lib/spiderfy"
import type { Place } from "../lib/types"

const previousPassword = process.env.SITE_PASSWORD

afterEach(() => {
  if (previousPassword === undefined) delete process.env.SITE_PASSWORD
  else process.env.SITE_PASSWORD = previousPassword
})

describe("password", () => {
  it("uses the documented placeholder when SITE_PASSWORD is unset", () => {
    delete process.env.SITE_PASSWORD
    assert.equal(getSitePassword(), PASSWORD_FALLBACK)
    assert.equal(isUsingPasswordFallback(), true)
  })

  it("uses the environment value when it is set", () => {
    process.env.SITE_PASSWORD = "a-real-secret"
    assert.equal(getSitePassword(), "a-real-secret")
    assert.equal(isUsingPasswordFallback(), false)
  })

  it("treats an empty variable as unset", () => {
    process.env.SITE_PASSWORD = ""
    assert.equal(getSitePassword(), PASSWORD_FALLBACK)
  })

  it("compares passwords without matching a different string", async () => {
    assert.equal(await passwordsMatch("kacavas-local", "kacavas-local"), true)
    assert.equal(await passwordsMatch("kacavas-local", "kacavas-local-x"), false)
    assert.equal(await passwordsMatch("", "kacavas-local"), false)
  })
})

describe("session", () => {
  it("round-trips a signed cookie", async () => {
    process.env.SITE_PASSWORD = "test-secret"
    const now = Date.parse("2026-11-01T00:00:00Z")
    const value = await createSessionValue(now)
    assert.equal(await isSessionValid(value, now + 1000), true)
  })

  it("rejects a tampered signature, a bad shape, and an expired token", async () => {
    process.env.SITE_PASSWORD = "test-secret"
    const now = Date.parse("2026-11-01T00:00:00Z")
    const value = await createSessionValue(now)
    const [version, expiresAt, signature] = value.split(".")
    const flipped = signature?.endsWith("a")
      ? `${signature.slice(0, -1)}b`
      : `${signature?.slice(0, -1)}a`
    assert.equal(await isSessionValid(`${version}.${expiresAt}.${flipped}`, now + 1000), false)
    assert.equal(await isSessionValid("nope", now), false)
    assert.equal(await isSessionValid(undefined, now), false)
    assert.equal(await isSessionValid(value, now + 1000 * 60 * 60 * 24 * 31), false)
  })

  it("rejects a token signed with a different password", async () => {
    process.env.SITE_PASSWORD = "one"
    const value = await createSessionValue(1_000)
    process.env.SITE_PASSWORD = "two"
    assert.equal(await isSessionValid(value, 1_000), false)
  })
})

describe("places and prices", () => {
  const sample: Place[] = [
    {
      id: "a",
      name: "A",
      city: "City",
      country: "Country",
      category: "restaurant",
      latitude: 1,
      longitude: 2,
      brothers: ["eli", "alec"],
      notes: "EXAMPLE",
    },
    {
      id: "b",
      name: "B",
      city: "City",
      country: "Country",
      category: "bar",
      latitude: 3,
      longitude: 4,
      brothers: ["niko"],
      notes: "EXAMPLE",
    },
  ]

  it("filters by brother and keeps shared pins on each matching tab", () => {
    assert.equal(filterPlaces(sample, "all").length, 2)
    assert.deepEqual(
      filterPlaces(sample, "eli").map((place) => place.id),
      ["a"],
    )
    assert.deepEqual(
      filterPlaces(sample, "alec").map((place) => place.id),
      ["a"],
    )
    assert.deepEqual(
      filterPlaces(sample, "niko").map((place) => place.id),
      ["b"],
    )
  })

  it("formats whole-dollar and cent prices", () => {
    assert.equal(formatPrice(4800), "$48")
    assert.equal(formatPrice(1899), "$18.99")
  })

  it("spreads pins that sit on the same point", () => {
    const placed = spiderfy(
      [
        { item: "foundry", x: 10, y: 10 },
        { item: "fotia", x: 10.4, y: 10.2 },
        { item: "london", x: 80, y: 20 },
      ],
      8,
    )
    const near = placed.filter((pin) => pin.item === "foundry" || pin.item === "fotia")
    assert.equal(near.length, 2)
    assert.ok(near.every((pin) => pin.offset))
    const gap = Math.hypot((near[0]?.x ?? 0) - (near[1]?.x ?? 0), (near[0]?.y ?? 0) - (near[1]?.y ?? 0))
    assert.ok(gap > 8)
    const london = placed.find((pin) => pin.item === "london")
    assert.equal(london?.offset, false)
  })

  it("clusters nearby pins and leaves distant ones alone", () => {
    const groups = clusterPoints(
      [
        { id: "a", x: 0, y: 0 },
        { id: "b", x: 2, y: 1 },
        { id: "c", x: 40, y: 40 },
      ],
      8,
    )
    const packed = groups.find((group) => group.members.length === 2)
    const alone = groups.find((group) => group.members.length === 1)
    assert.ok(packed)
    assert.equal(alone?.id, "c")
    assert.equal(packed?.id, "cluster:a|b")
  })

  it("frames a point by centering it in the map", () => {
    const camera = framePoint(100, 80, 4, 800, 460, 1, 100)
    assert.equal(camera.scale, 4)
    assert.equal(camera.x, -4 * (100 - 400))
    assert.equal(camera.y, -4 * (80 - 230))
  })

  it("filters the table by city and search text", () => {
    const matches = queryPlaces(sample, {
      text: "example",
      city: "City",
      neighborhood: "all",
      category: "restaurant",
      brother: "alec",
    })
    assert.deepEqual(
      matches.map((place) => place.id),
      ["a"],
    )
  })
})
