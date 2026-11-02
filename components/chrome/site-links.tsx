import Link from "next/link"
import { menuPages } from "@/data/nav"

/** Enabled pages only. Shop and Creative stay out until they are switched on. */
export function SiteLinks({ className = "" }: { className?: string }) {
  return (
    <nav aria-label="Site" className={className}>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs tracking-[0.14em] uppercase">
        {menuPages.map((page) => (
          <li key={page.id}>
            <Link href={page.href} className="underline decoration-line underline-offset-4">
              {page.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
