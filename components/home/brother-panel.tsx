import Link from "next/link"
import type { Brother } from "@/data/brothers"
import { Portrait } from "@/components/portrait"

export function BrotherPanel({
  brother,
  variant,
}: {
  brother: Brother
  variant: "cube" | "card"
}) {
  const compact = variant === "cube"
  return (
    <article
      className={
        compact
          ? "w-[300px] border bg-ink-2 p-3.5 text-paper shadow-[0_20px_60px_rgb(0_0_0/0.35)]"
          : "w-full max-w-md border bg-ink-2 p-5 text-paper sm:p-7"
      }
      style={{ borderColor: `${brother.accent}66` }}
    >
      <div
        className={`relative overflow-hidden bg-ink ${compact ? "h-28" : "h-36 sm:aspect-[4/5] sm:h-auto sm:max-h-[22rem]"}`}
      >
        <Portrait
          id={brother.id}
          priority={brother.index === 0}
          sizes={compact ? "300px" : "(max-width: 768px) 90vw, 420px"}
        />
        <span
          className="absolute inset-x-0 top-0 h-0.5"
          style={{ background: brother.accent }}
          aria-hidden="true"
        />
      </div>
      <p className="mt-3 text-[0.68rem] tracking-[0.2em] text-muted uppercase">
        0{brother.index + 1}
        <span className="px-2 text-faint">/</span>
        {brother.epithet}
      </p>
      <h2 className={`font-serif leading-none tracking-tight ${compact ? "mt-1 text-4xl" : "mt-2 text-5xl"}`}>
        {brother.shortName}
      </h2>
      <p className={`text-muted ${compact ? "mt-2 line-clamp-3 text-[0.82rem] leading-snug" : "mt-4 text-base leading-relaxed"}`}>
        {brother.bio}
      </p>
      <dl className={`grid gap-2 ${compact ? "mt-3 text-[0.78rem]" : "mt-6 text-sm"}`}>
        <div>
          <dt className="text-[0.65rem] tracking-[0.16em] text-faint uppercase">Career</dt>
          <dd className="mt-0.5 leading-snug">{brother.career}</dd>
        </div>
        <div>
          <dt className="text-[0.65rem] tracking-[0.16em] text-faint uppercase">Sports</dt>
          <dd className="mt-0.5 leading-snug">{brother.sports}</dd>
        </div>
      </dl>
      <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${compact ? "mt-3 text-[0.78rem]" : "mt-6 text-sm"}`}>
        {brother.socials.map((social) => (
          <a
            key={social.href}
            href={social.href}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-white/25 underline-offset-4 hover:decoration-current"
          >
            {social.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ))}
        <Link href={brother.href} className="ml-auto tracking-[0.14em] uppercase" style={{ color: brother.accent }}>
          Enter
          <span aria-hidden="true"> →</span>
        </Link>
      </div>
    </article>
  )
}
