import type { Metadata } from "next"
import { PasswordForm } from "@/components/gate/password-form"
import { isUsingPasswordFallback } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Private map",
  description: "A password is required.",
  robots: { index: false, follow: false },
}

export default function GatePage() {
  return (
    <div className="flex min-h-dvh items-center px-5 py-24">
      <PasswordForm usingFallback={isUsingPasswordFallback()} />
    </div>
  )
}
