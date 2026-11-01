"use client"

import { useRef, useState, type ReactNode } from "react"
import { MenuContext } from "@/components/chrome/menu-context"
import { SideMenu } from "@/components/chrome/side-menu"

export function SiteFrame({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <MenuContext.Provider value={{ open, setOpen, triggerRef }}>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <SideMenu />
      <main id="content" tabIndex={-1} inert={open ? true : undefined}>
        {children}
      </main>
    </MenuContext.Provider>
  )
}
