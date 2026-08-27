export function FollowSverigefacit({ context }: { context: string }) {
  const headingId = `follow-${context}`;
  return (
    <section className="follow-sverigefacit" aria-labelledby={headingId}>
      <div>
        <p className="section-kicker">Missa inget nytt facit</p>
        <h2 id={headingId}>Följ siffrorna fram till valet.</h2>
        <p>Nya datapass publiceras när myndigheterna släpper uppdaterad statistik. Välj hur du vill följa dem.</p>
      </div>
      <nav aria-label="Följ Sverigefacit">
        <a href="https://www.google.com/preferences/source?q=www.sverigefacit.se" target="_blank" rel="noreferrer">Välj oss som källa i Google <span>↗</span></a>
        <a href="/feed.xml">Följ via RSS <span>↗</span></a>
      </nav>
    </section>
  );
}
