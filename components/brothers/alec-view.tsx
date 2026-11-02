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
            GTM lead at Lance, San Francisco. Babson College. He loves any sport.
          </p>
        </div>
        <div className="relative aspect-[4/5] bg-ink-2">
          <Portrait id="alec" priority sizes="(max-width: 768px) 100vw, 360px" />
        </div>
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
          He attended Babson College, including the Management Consulting Field Experience. Some of
          the dates below overlap, as they do on his public profile.
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
          He plays and organizes Rho Hoops, a five-on-five run with San Francisco founders. In 2026
          he moderated a startup fireside chat. He grew up in the same sports-heavy house as his
          brothers.
        </p>
        <p className="mt-6">
          <ExternalLink href="https://www.linkedin.com/in/aleckacavas">LinkedIn</ExternalLink>
        </p>
      </Reveal>
    </>
  )
}
