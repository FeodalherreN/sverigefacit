import Link from 'next/link';

export function GuideFooter() {
  return (
    <footer className="guide-footer">
      <div className="footer-brand">
        <span className="brand-mark" aria-hidden="true"><i /><i /></span>
        <div><strong>Sverigefacit</strong><small>Data bakom politiken</small></div>
      </div>
          <p>Svensk offentlig statistik med originalkällor, politisk kontext och förklaringar.</p>
      <div><Link href="/om">Om</Link><Link href="/metod">Metod</Link><Link href="/kallor">Källor</Link><Link href="/rattelser">Rättelser</Link><a href="/feed.xml">RSS</a><Link href="/integritet">Integritet</Link></div>
    </footer>
  );
}
