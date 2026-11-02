import { ViewTransition } from "react"
import { alecQuote, alecRoles } from "@/data/alec"
import { ExternalLink } from "@/components/chrome/external-link"
import { Portrait } from "@/components/portrait"
import { Reveal } from "@/components/motion/reveal"

export function AlecView() {
  const current = alecRoles.find((role) => role.current)

  return (
    <>
      <header className="grid items-end gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <div>
          <p className="text-xs tracking-[0.22em] text-alec uppercase">GTM lead</p>
          <h1 className="mt-3 font-serif text-6xl tracking-tight sm:text-8xl">Alec</h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            GTM lead at Lance, in San Francisco. I went to Babson, and I love any sport.
          </p>
        </div>
        <ViewTransition name="portrait-alec">
          <div className="relative aspect-[4/5] bg-ink-2">
            <Portrait id="alec" priority sizes="(max-width: 768px) 100vw, 360px" />
          </div>
        </ViewTransition>
      </header>

      <Reveal className="mt-12 max-w-3xl">
        <blockquote className="border-l-2 border-alec pl-5">
          <p className="font-serif text-2xl leading-snug sm:text-3xl">“{alecQuote.text}”</p>
          <footer className="mt-4 text-sm text-muted">
            <ExternalLink href={alecQuote.href}>{alecQuote.source}</ExternalLink>
          </footer>
        </blockquote>
      </Reveal>

      {current ? (
        <Reveal className="mt-12 border border-alec/50 p-6 sm:p-8">
          <p className="text-xs tracking-[0.18em] text-alec uppercase">Now</p>
          <h2 className="mt-2 font-serif text-4xl">
            {current.title}, {current.org}
          </h2>
          <p className="mt-2 font-mono text-sm text-muted">
            {current.period} · {current.place}
          </p>
          <p className="mt-4 max-w-2xl leading-relaxed">{current.detail}</p>
          <p className="mt-4">
            <ExternalLink href="https://lance.live">lance.live</ExternalLink>
          </p>
        </Reveal>
      ) : null}

      <Reveal className="mt-16">
        <h2 className="font-serif text-4xl">Record</h2>
        <p className="mt-3 max-w-2xl text-muted">
          I went to Babson, including the Management Consulting Field Experience. A few of these dates overlap, the way they do on my profile.
        </p>
        <ol className="mt-8">
          {alecRoles.map((role) => (
            <li key={role.id} className="grid gap-2 border-t border-line py-6 sm:grid-cols-[12rem_minmax(0,1fr)]">
              <p className="font-mono text-sm text-alec">{role.period}</p>
              <div>
                <h3 className="font-serif text-2xl">
                  {role.title}
                  <span className="text-muted">, {role.org}</span>
                </h3>
                <p className="mt-1 text-sm text-faint">{role.place}</p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{role.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal className="mt-12 max-w-2xl">
        <h2 className="font-serif text-3xl">Outside</h2>
        <p className="mt-4 leading-relaxed">
          I play and organize Rho Hoops, a five-on-five run with San Francisco founders. In 2026 I moderated a startup fireside chat. I grew up in a sports-heavy house with my brothers.
        </p>
        <p className="mt-6">
          <ExternalLink href="https://www.linkedin.com/in/aleckacavas">LinkedIn</ExternalLink>
        </p>
      </Reveal>
    </>
  )
}
