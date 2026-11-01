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
import { advanceBrother, angleForIndex, indexFromAngle, snapToBrother } from "../lib/cube"
import { formatPrice } from "../lib/money"
import { filterPlaces } from "../lib/places"
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

describe("cube", () => {
  it("cycles forward through three brothers and passes a full turn back to Eli", () => {
    let state = { index: 0, angle: 0 }
    state = advanceBrother(state.index, 1, state.angle)
    assert.deepEqual(state, { index: 1, angle: -Math.PI / 2 })
    state = advanceBrother(state.index, 1, state.angle)
    assert.deepEqual(state, { index: 2, angle: -Math.PI })
    state = advanceBrother(state.index, 1, state.angle)
    assert.deepEqual(state, { index: 0, angle: -Math.PI * 2 })
    state = advanceBrother(state.index, 1, state.angle)
    assert.equal(state.index, 1)
    assert.ok(Math.abs(state.angle - (-Math.PI * 2 - Math.PI / 2)) < 1e-10)
  })

  it("steps backward from Eli to Alec without landing on the monogram", () => {
    const next = advanceBrother(0, -1, 0)
    assert.equal(next.index, 2)
    assert.ok(Math.abs(next.angle - Math.PI) < 1e-10)
    assert.equal(indexFromAngle(next.angle), 2)
  })

  it("reads the brother facing the camera", () => {
    assert.equal(indexFromAngle(0), 0)
    assert.equal(indexFromAngle(-Math.PI / 2), 1)
    assert.equal(indexFromAngle(-Math.PI), 2)
    assert.equal(indexFromAngle(-Math.PI * 2), 0)
    assert.equal(indexFromAngle(Math.PI), 2)
  })

  it("stays on a face when the drag has no flick", () => {
    const snapped = snapToBrother(-0.05, 0)
    assert.equal(snapped.index, 0)
    assert.equal(snapped.angle, 0)
  })

  it("commits forward once a drag crosses halfway", () => {
    const snapped = snapToBrother(-Math.PI / 4, 0)
    assert.equal(snapped.index, 1)
  })

  it("uses a flick to carry onto the next face", () => {
    const snapped = snapToBrother(-0.2, -3)
    assert.equal(snapped.index, 1)
    assert.ok(snapped.angle < -0.2)
  })

  it("jumps to a chosen brother on the nearest turn", () => {
    const angle = angleForIndex(2, 0)
    assert.equal(indexFromAngle(angle), 2)
    assert.ok(Math.abs(Math.abs(angle) - Math.PI) < 1e-10)
  })
})

describe("places and prices", () => {
  const sample: Place[] = [
    {
      id: "a",
      name: "A",
      city: "City",
      country: "Country",
      type: "restaurant",
      latitude: 1,
      longitude: 2,
      brothers: ["eli", "alec"],
      notes: "EXAMPLE",
      example: true,
    },
    {
      id: "b",
      name: "B",
      city: "City",
      country: "Country",
      type: "place",
      latitude: 3,
      longitude: 4,
      brothers: ["niko"],
      notes: "EXAMPLE",
      example: true,
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
})
