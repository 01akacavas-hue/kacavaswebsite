"use client"

import { useRef, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function PasswordForm({ usingFallback }: { usingFallback: boolean }) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)
    try {
      const response = await fetch("/api/unlock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      })
      if (!response.ok) {
        setError("That password is not right.")
        setPending(false)
        inputRef.current?.focus()
        return
      }
      router.push("/restaurants")
      router.refresh()
    } catch {
      setError("The request did not go through. Try again.")
      setPending(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <p className="text-xs tracking-[0.22em] text-muted uppercase">Private</p>
      <h1 className="mt-3 font-serif text-5xl tracking-tight">Restaurants & places</h1>
      <p className="mt-4 text-muted">A map of tables and towns. Ask a brother for the password.</p>
      <form className="mt-8" onSubmit={(event) => void onSubmit(event)}>
        <label htmlFor="site-password" className="text-xs tracking-[0.16em] text-faint uppercase">
          Password
        </label>
        <input
          ref={inputRef}
          id="site-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "password-error" : undefined}
          disabled={pending}
          className="mt-2 h-12 w-full border border-line bg-ink px-3 text-paper outline-none"
          onChange={(event) => setPassword(event.target.value)}
        />
        {error ? (
          <p id="password-error" role="alert" className="mt-3 text-sm text-alec">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="mt-5 h-12 w-full bg-paper text-sm tracking-[0.16em] text-ink uppercase disabled:opacity-60"
        >
          {pending ? "Checking" : "Enter"}
        </button>
      </form>
      {usingFallback ? (
        <p className="mt-6 text-sm leading-relaxed text-muted">
          This deployment has no <code className="text-paper">SITE_PASSWORD</code> set, so it is using
          the placeholder documented in the README. Set the variable in Vercel before sharing the site.
        </p>
      ) : null}
      <p className="mt-8">
        <Link href="/" className="text-sm text-muted underline underline-offset-4">
          Back home
        </Link>
      </p>
    </div>
  )
}
