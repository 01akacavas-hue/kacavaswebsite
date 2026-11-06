import { Suspense, type ReactNode } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { SiteFrame } from "@/components/chrome/site-frame"
import { JsonLd } from "@/components/seo/json-ld"
import { SESSION_COOKIE, isSessionValid } from "@/lib/auth"

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <SiteFrame>
      <Suspense fallback={null}>
        <Authorized>{children}</Authorized>
      </Suspense>
    </SiteFrame>
  )
}

async function Authorized({ children }: { children: ReactNode }) {
  await connection()
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!(await isSessionValid(token))) redirect("/gate")
  return (
    <>
      <JsonLd />
      {children}
    </>
  )
}
