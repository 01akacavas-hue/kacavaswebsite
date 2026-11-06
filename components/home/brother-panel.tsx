import Link from "next/link"
import type { Brother } from "@/data/brothers"
import { portraits } from "@/data/images"
import { Portrait } from "@/components/portrait"

export function BrotherPanel({
  brother,
  variant,
}: {
  brother: Brother
  variant: "cube" | "card"
}) {
  const compact = variant === "cube"
  const portrait = portraits[brother.id]
  const landscape = portrait.width > portrait.height
  return (
    <article
      className={
        compact
          ? "w-[440px] border border-t-2 bg-ink-2 p-0 text-paper"
          : "w-full max-w-md border bg-ink-2 p-5 text-paper sm:p-7"
      }
      style={{ borderColor: brother.accent }}
    >
      <div
        className={`relative overflow-hidden bg-ink ${compact ? "h-[250px]" : landscape ? "aspect-[3/2] w-full" : "h-44 sm:aspect-[4/5] sm:h-auto sm:max-h-[22rem]"}`}
      >
        <Portrait
          id={brother.id}
          priority={brother.index === 0}
          sizes={compact ? "440px" : "(max-width: 768px) 90vw, 420px"}
          className="object-cover object-center"
        />
      </div>
      <div className={compact ? "px-4 pt-3 pb-4" : ""}>
      <p className={`${compact ? "mt-0" : "mt-3"} text-[0.68rem] tracking-[0.2em] text-muted uppercase`}>
        0{brother.index + 1}
        <span className="px-2 text-faint">/</span>
        {brother.epithet}
      </p>
      <h2 className={`font-serif leading-none tracking-tight ${compact ? "mt-1 text-4xl" : "mt-2 text-5xl"}`}>
        {brother.shortName}
      </h2>
      {brother.knownAs ? <p className="mt-1 text-sm text-muted">Goes by {brother.knownAs}.</p> : null}
      <p className={`text-muted ${compact ? "mt-2 line-clamp-3 text-[0.82rem] leading-snug" : "mt-4 text-base leading-relaxed"}`}>
        {brother.bio}
      </p>
      <dl className={`grid gap-2 ${compact ? "mt-3 text-[0.78rem]" : "mt-6 text-sm"}`}>
        <div>
          <dt className="text-[0.65rem] tracking-[0.16em] text-faint uppercase">Career</dt>
          <dd className="mt-0.5 leading-snug">{brother.career}</dd>
        </div>
        <div>
          <dt className="text-[0.65rem] tracking-[0.16em] text-faint uppercase">{brother.asideLabel}</dt>
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
            className="underline decoration-paper/30 underline-offset-4 hover:decoration-current"
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
      </div>
    </article>
  )
}
