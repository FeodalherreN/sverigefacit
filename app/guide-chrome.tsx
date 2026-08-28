'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function GuideHeader() {
  const pathname = usePathname();
  const utilityLink = pathname === '/datastudio'
    ? { href: '/statistik', label: 'Välj statistikområde' }
    : pathname.startsWith('/analys/')
      ? { href: '/fakta/migration-och-brott', label: 'Se kort facit' }
      : { href: '/datastudio', label: 'Öppna Datastudion' };

  return (
    <header className="guide-header">
      <a className="skip-link" href="#guide-content">Hoppa till huvudinnehållet</a>
      <Link className="brand" href="/" aria-label="Sverigefacit, startsida">
        <span className="brand-mark" aria-hidden="true"><i /><i /></span>
        <span>Sverigefacit</span>
        <em>beta</em>
      </Link>
      <nav aria-label="Fördjupningsmeny">
        <Link href="/valet-2026">Valet 2026</Link>
        <Link href="/fakta">Fakta</Link>
        <Link href="/statistik">Statistik</Link>
        <Link href="/politik/valloften">Vallöften</Link>
        <Link href="/metod">Metod</Link>
        <Link href="/kallor">Källor</Link>
      </nav>
      <Link className="guide-home-link" href={utilityLink.href}>{utilityLink.label} <span>↗</span></Link>
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
      <p>Offentlig statistik med svensk relevans, politisk kontext och tydliga evidensnivåer.</p>
      <div><a href="/feed.xml">RSS</a><Link href="/integritet">Integritet</Link><Link href="/">Till startsidan ↑</Link></div>
    </footer>
  );
}
