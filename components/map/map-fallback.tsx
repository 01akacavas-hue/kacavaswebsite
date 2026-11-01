export function MapFallback() {
  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-muted uppercase">Private</p>
      <h1 className="mt-2 font-serif text-5xl tracking-tight sm:text-6xl">Restaurants & places</h1>
      <p className="mt-6 text-muted" role="status">
        Opening the map…
      </p>
      <div className="mt-8 h-[52vh] border border-line bg-ink sm:h-[min(68vh,640px)]" aria-hidden="true" />
    </div>
  )
}
