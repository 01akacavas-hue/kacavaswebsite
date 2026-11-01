"use client"

import { createContext, useContext, type RefObject } from "react"

export type MenuContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: RefObject<HTMLButtonElement | null>
}

export const MenuContext = createContext<MenuContextValue | null>(null)

export function useMenu(): MenuContextValue {
  const value = useContext(MenuContext)
  if (!value) throw new Error("useMenu must be used inside SiteFrame")
  return value
}
