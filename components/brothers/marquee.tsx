export function Marquee({ titles }: { titles: readonly string[] }) {
  const items = titles.map((title) => title.toUpperCase())
  return (
    <div className="marquee my-10" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <p key={copy} className="marquee-copy">
            {items.map((title) => (
              <span key={`${copy}-${title}`}>{title}</span>
            ))}
          </p>
        ))}
      </div>
    </div>
  )
}
