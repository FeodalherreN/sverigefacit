export function FollowSverigefacit({ context }: { context: string }) {
  const headingId = `follow-${context}`;
  return (
    <section className="follow-sverigefacit" aria-labelledby={headingId}>
      <div>
        <h2 id={headingId}>Få uppdateringar</h2>
        <p>Nya siffror publiceras när myndigheterna uppdaterar underlagen. Följ via RSS eller Google.</p>
      </div>
      <nav aria-label="Följ Sverigefacit">
        <a href="https://www.google.com/preferences/source?q=www.sverigefacit.se" target="_blank" rel="noreferrer">Välj oss som källa i Google <span>↗</span></a>
        <a href="/feed.xml">Följ via RSS <span aria-hidden="true">→</span></a>
      </nav>
    </section>
  );
}
