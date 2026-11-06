import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { isPublicPath } from "../lib/auth"

describe("site gate", () => {
  it("locks every page and leaves the password screen open", () => {
    for (const path of ["/", "/niko", "/eli", "/alec", "/restaurants", "/shop", "/creative", "/api/checkout", "/opengraph-image", "/workers/maplibre"]) {
      assert.equal(isPublicPath(path), false, path)
    }
    for (const path of ["/gate", "/api/unlock", "/robots.txt", "/sitemap.xml", "/favicon.ico", "/icon", "/apple-icon", "/health", "/healthz", "/api/health", "/_next/static/chunks/app.js"]) {
      assert.equal(isPublicPath(path), true, path)
    }
  })
})