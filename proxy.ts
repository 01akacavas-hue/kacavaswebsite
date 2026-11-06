import { NextResponse, type NextRequest } from "next/server"
import { SESSION_COOKIE, isPublicPath, isSessionValid } from "@/lib/auth"

/**
 * Next.js 16 renamed Middleware to Proxy. This file is that middleware.
 *
 * It does not see the password. It only checks the signed httpOnly cookie.
 * `app/api/unlock/route.ts` compares the password to `SITE_PASSWORD` and sets
 * the cookie. A request without that cookie is rewritten to the password
 * screen, and the address bar stays on the page they asked for.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(SESSION_COOKIE)?.value
  const valid = await isSessionValid(token)

  if (isPublicPath(pathname)) {
    if (pathname === "/gate" && valid) {
      const url = request.nextUrl.clone()
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  if (valid) return NextResponse.next()

  if (pathname.startsWith("/api/") || pathname.startsWith("/workers/")) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const url = request.nextUrl.clone()
  url.pathname = "/gate"
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico).*)"],
}
