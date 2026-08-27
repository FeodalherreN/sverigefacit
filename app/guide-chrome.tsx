import Link from 'next/link';

export function GuideHeader() {
  return (
    <header className="guide-header">
      <Link className="brand" href="/" aria-label="Sverigefacit, startsida">
        <span className="brand-mark" aria-hidden="true"><i /><i /></span>
        <span>Sverigefacit</span>
        <em>beta</em>
      </Link>
      <nav aria-label="Fördjupningsmeny">
        <Link href="/statistik">Statistik</Link>
        <Link href="/politik/valloften">Vallöften</Link>
        <Link href="/metod">Metod</Link>
        <Link href="/kallor">Källor</Link>
      </nav>
      <Link className="guide-home-link" href="/#datastudio">Öppna Datastudion <span>↗</span></Link>
    </header>
  );
}

export function GuideFooter() {
  return (
    <footer className="guide-footer">
      <div className="footer-brand">
        <span className="brand-mark" aria-hidden="true"><i /><i /></span>
        <div><strong>Sverigefacit</strong><small>Data bakom politiken</small></div>
      </div>
      <p>Offentlig svensk statistik med politisk kontext och tydliga evidensnivåer.</p>
      <Link href="/">Till startsidan ↑</Link>
    </footer>
  );
}
