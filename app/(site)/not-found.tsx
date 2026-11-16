import Link from "next/link"

/**
 * Pages inside the site layout already draw the menu.
 * The root not-found file draws it again for addresses that match no page.
 */
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center px-5 pt-24">
      <p className="text-xs tracking-[0.2em] text-muted uppercase">404</p>
      <h1 className="mt-3 font-serif text-6xl">This page is not on the map.</h1>
      <p className="mt-6">
        <Link href="/" className="underline underline-offset-4">
          Back home
        </Link>
      </p>
    </div>
  )
}
