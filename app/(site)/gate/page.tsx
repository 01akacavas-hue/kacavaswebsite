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
    <div className="grid min-h-dvh place-items-center px-6 py-24">
      <PasswordForm showDevHint={process.env.NODE_ENV === "development" && isUsingPasswordFallback()} />
    </div>
  )
}
