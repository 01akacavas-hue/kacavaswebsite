"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { menuPages } from "@/data/nav"
import { accents } from "@/lib/theme"
import { useMenu } from "@/components/chrome/menu-context"

const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function SideMenu() {
  const { open, setOpen, triggerRef } = useMenu()
  const pathname = usePathname()
  const router = useRouter()
  const reduce = useReducedMotion()
  const trapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement
    const root = trapRef.current
    const focusable = () =>
      root
        ? Array.from(root.querySelectorAll<HTMLElement>(focusableSelector)).filter(
            (element) => !element.hasAttribute("disabled"),
          )
        : []

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        setOpen(false)
        return
      }
      if (event.key !== "Tab") return
      const items = focusable()
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus()
      }
    }
  }, [open, setOpen])

  return (
    <div ref={trapRef}>
      <button
        ref={triggerRef}
        type="button"
        className="fixed top-5 left-5 z-[60] flex h-11 items-center gap-3 px-1 text-xs tracking-[0.18em] text-paper uppercase"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen(!open)}
      >
        <span className="flex w-5 flex-col gap-[5px]" aria-hidden="true">
          <span
            className={`h-px w-full bg-paper transition-transform duration-300 ${open ? "translate-y-[3px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-full bg-paper transition-transform duration-300 ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
          />
        </span>
        {open ? "Close" : "Menu"}
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              key="backdrop"
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              className="fixed inset-0 z-40 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.3 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              key="panel"
              id="site-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Site"
              className="fixed inset-y-0 left-0 z-50 flex w-full max-w-[24rem] flex-col border-r border-line bg-ink px-8 pt-24 pb-10"
              initial={reduce ? { x: 0 } : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={reduce ? { x: 0 } : { x: "-100%" }}
              transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <ol className="flex flex-1 flex-col justify-center gap-1">
                {menuPages.map((page, index) => {
                  const current = pathname === page.href
                  const accent = page.brother ? accents[page.brother] : undefined
                  return (
                    <motion.li
                      key={page.id}
                      initial={reduce ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: reduce ? 0 : 0.08 + index * 0.04, duration: 0.35 }}
                    >
                      <Link
                        href={page.href}
                        prefetch={page.index ? undefined : false}
                        aria-current={current ? "page" : undefined}
                        className="group flex items-baseline justify-between gap-4 py-1.5"
                        onClick={() => setOpen(false)}
                      >
                        <span className="font-serif text-4xl leading-none tracking-tight">
                          {page.label}
                        </span>
                        <span className="flex items-center gap-2 text-[0.68rem] tracking-[0.16em] text-muted uppercase">
                          {accent ? (
                            <span
                              className="inline-block size-1.5 rounded-full"
                              style={{ background: accent }}
                              aria-hidden="true"
                            />
                          ) : null}
                          {page.menuNote}
                        </span>
                      </Link>
                    </motion.li>
                  )
                })}
              </ol>
              <button
                type="button"
                className="mb-6 h-11 self-start text-xs tracking-[0.16em] uppercase"
                onClick={() => {
                  void fetch("/api/unlock", { method: "DELETE" }).then(() => {
                    router.push("/gate")
                    router.refresh()
                  })
                }}
              >
                Lock
              </button>
              <p className="text-xs tracking-[0.16em] text-faint uppercase">Kacavas</p>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
