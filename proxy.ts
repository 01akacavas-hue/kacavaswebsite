import { NextResponse, type NextRequest } from "next/server"
import { SESSION_COOKIE, isSessionValid } from "@/lib/auth"

/**
 * Next.js 16 renamed Middleware to Proxy. This file is that middleware.
 *
 * It does not see the password. It only checks the signed httpOnly cookie.
 * `app/api/unlock/route.ts` compares the password to `SITE_PASSWORD` and sets
 * the cookie. Unauthenticated requests for /restaurants are rewritten to the
 * password screen. The URL stays /restaurants.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(SESSION_COOKIE)?.value
  const valid = await isSessionValid(token)
  const restaurants = pathname === "/restaurants" || pathname.startsWith("/restaurants/")

  if (restaurants && !valid) {
    const url = request.nextUrl.clone()
    url.pathname = "/gate"
    return NextResponse.rewrite(url)
  }

  if (pathname === "/gate" && valid) {
    const url = request.nextUrl.clone()
    url.pathname = "/restaurants"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/restaurants", "/restaurants/:path*", "/gate"],
}
