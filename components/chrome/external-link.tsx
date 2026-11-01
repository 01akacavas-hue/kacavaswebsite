import type { ReactNode } from "react"

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="underline decoration-white/25 underline-offset-[0.25em] transition-colors hover:decoration-current"
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
