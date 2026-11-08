import assert from "node:assert/strict"
import { afterEach, describe, it } from "node:test"
import { NextRequest } from "next/server"
import { DELETE, POST } from "../app/api/unlock/route"
import { SESSION_COOKIE, createSessionValue, isPublicPath } from "../lib/auth"
import { proxy } from "../proxy"

const previousPassword = process.env.SITE_PASSWORD

afterEach(() => {
  if (previousPassword === undefined) delete process.env.SITE_PASSWORD
  else process.env.SITE_PASSWORD = previousPassword
})

function setCookie(response: Response): string {
  const header = response.headers.getSetCookie().find((value) => value.startsWith(`${SESSION_COOKIE}=`))
  assert.ok(header, "missing session cookie")
  return header
}

describe("site gate", () => {
  it("locks every page and leaves the password screen open", () => {
    for (const path of ["/", "/niko", "/eli", "/alec", "/restaurants", "/shop", "/creative", "/api/checkout", "/opengraph-image", "/workers/maplibre"]) {
      assert.equal(isPublicPath(path), false, path)
    }
    for (const path of ["/gate", "/api/unlock", "/robots.txt", "/sitemap.xml", "/favicon.ico", "/icon", "/apple-icon", "/health", "/healthz", "/api/health", "/_next/static/chunks/app.js"]) {
      assert.equal(isPublicPath(path), true, path)
    }
  })

  it("sets a session cookie on unlock and clears it on lock", async () => {
    process.env.SITE_PASSWORD = "test-secret"
    const unlock = await POST(
      new Request("https://kacavas.com/api/unlock", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-proto": "https",
          origin: "https://kacavas.com",
          host: "kacavas.com",
        },
        body: JSON.stringify({ password: "test-secret" }),
      }),
    )
    assert.equal(unlock.status, 200)
    const granted = setCookie(unlock)
    assert.equal(/max-age/i.test(granted), false)
    assert.equal(/expires=/i.test(granted), false)
    assert.match(granted, /HttpOnly/i)
    assert.match(granted, /Secure/i)
    assert.match(granted, /Path=\//)
    assert.match(granted, /SameSite=lax/i)

    const wrong = await POST(
      new Request("https://kacavas.com/api/unlock", {
        method: "POST",
        headers: { "content-type": "application/json", origin: "https://kacavas.com", host: "kacavas.com" },
        body: JSON.stringify({ password: "nope" }),
      }),
    )
    assert.equal(wrong.status, 401)
    assert.equal(wrong.headers.getSetCookie().length, 0)

    const locked = await DELETE(
      new Request("https://kacavas.com/api/unlock", {
        method: "DELETE",
        headers: { "x-forwarded-proto": "https", origin: "https://kacavas.com", host: "kacavas.com" },
      }),
    )
    assert.equal(locked.status, 200)
    const cleared = setCookie(locked)
    assert.match(cleared, /Max-Age=0/)
    assert.match(cleared, /Expires=Thu, 01 Jan 1970/i)
  })

  it("lets an unlocked session browse and sends a new visit to the password screen", async () => {
    process.env.SITE_PASSWORD = "test-secret"
    const token = await createSessionValue(Date.now())
    const pages = ["/", "/niko", "/eli", "/alec", "/restaurants"]

    for (const path of pages) {
      const open = await proxy(new NextRequest(`https://kacavas.com${path}`, {
        headers: { cookie: `${SESSION_COOKIE}=${token}` },
      }))
      assert.equal(open.headers.get("x-middleware-next"), "1", path)
      assert.equal(open.headers.get("x-middleware-rewrite"), null, path)

      const locked = await proxy(new NextRequest(`https://kacavas.com${path}`))
      assert.match(locked.headers.get("x-middleware-rewrite") ?? "", /\/gate$/, path)
    }

    const returning = await proxy(new NextRequest("https://kacavas.com/gate", {
      headers: { cookie: `${SESSION_COOKIE}=${token}` },
    }))
    assert.equal(returning.status, 307)
    assert.match(returning.headers.get("location") ?? "", /\/$/)

    const fresh = await proxy(new NextRequest("https://kacavas.com/gate"))
    assert.equal(fresh.headers.get("x-middleware-next"), "1")
  })
})
