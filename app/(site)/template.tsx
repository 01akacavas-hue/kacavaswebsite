import { ViewTransition, type ReactNode } from "react"

export default function Template({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-fade" exit="page-fade" default="none">
      {children}
    </ViewTransition>
  )
}
