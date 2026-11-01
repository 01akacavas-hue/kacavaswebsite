import { NextResponse } from "next/server"
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionValue,
  getSitePassword,
  passwordsMatch,
} from "@/lib/auth"
import { isRecord, isSameOrigin, readJson } from "@/lib/http"

function cookieBase(request: Request) {
  const forwarded = request.headers.get("x-forwarded-proto")
  const protocol = forwarded ?? new URL(request.url).protocol.replace(":", "")
  return {
    httpOnly: true,
    secure: protocol === "https",
    sameSite: "lax" as const,
    path: "/",
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false }, { status: 403 })
  }

  const body = await readJson(request)
  const password = isRecord(body) && typeof body.password === "string" ? body.password : ""
  const matches = await passwordsMatch(password, getSitePassword())
  if (!matches) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, await createSessionValue(), {
    ...cookieBase(request),
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
  return response
}

export async function DELETE(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ ok: false }, { status: 403 })
  }
  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, "", { ...cookieBase(request), maxAge: 0 })
  return response
}
